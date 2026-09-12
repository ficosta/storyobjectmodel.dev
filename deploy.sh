#!/usr/bin/env bash
# Publish storyobjectmodel.dev: build -> Bunny edge storage -> purge the pull zone.
#
# Credentials live in the (gitignored) BunnyConfiguration .env:
#   SOM_STORAGE_ZONE, SOM_STORAGE_KEY, SOM_PULL_ID, BUNNY_API_KEY
# Override ENV_FILE to point somewhere else.
set -euo pipefail

ENV_FILE="${ENV_FILE:-$HOME/Documents/GIT/BunnyConfiguration/.env}"
[ -f "$ENV_FILE" ] || { echo "missing env file: $ENV_FILE" >&2; exit 1; }
set -a; . "$ENV_FILE"; set +a

: "${SOM_STORAGE_ZONE:?}" "${SOM_STORAGE_KEY:?}" "${SOM_PULL_ID:?}" "${BUNNY_API_KEY:?}"

cd "$(dirname "$0")"
npm run build

echo "--> uploading dist/ to storage zone $SOM_STORAGE_ZONE"
cd dist
find . -type f | sed 's|^\./||' | while read -r f; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -X PUT \
    -H "AccessKey: $SOM_STORAGE_KEY" --data-binary "@$f" \
    "https://storage.bunnycdn.com/$SOM_STORAGE_ZONE/$f")
  case "$code" in 20*) printf '    %s  %s\n' "$code" "$f" ;;
                  *)   printf '    %s  %s  FAILED\n' "$code" "$f" >&2; exit 1 ;; esac
done
cd ..

# Hashed assets get new filenames every build, but index.html keeps its path and
# the edge holds it for 30 days — so a deploy is only live once the zone is purged.
echo "--> purging pull zone $SOM_PULL_ID"
curl -s -o /dev/null -w '    purge:%{http_code}\n' -X POST \
  -H "AccessKey: $BUNNY_API_KEY" "https://api.bunny.net/pullzone/$SOM_PULL_ID/purgeCache"

echo "--> live: https://${SOM_HOST:-storyobjectmodel.dev}/"
