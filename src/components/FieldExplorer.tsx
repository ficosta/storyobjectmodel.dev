import { useState } from 'react';
import type { FieldDoc } from '../data/envelope';
import { useUi } from '../i18n/useLocale';

export interface FieldExplorerProps {
  fields: FieldDoc[];
  /** Sample value per field name, written exactly as it should appear on the
   *  right of the colon (quotes included for strings). */
  samples: Record<string, string>;
  /** Optional trailing comment rendered after a sample value. */
  comments?: Record<string, string>;
}

function isStringLiteral(v: string) {
  return v.startsWith('"');
}

/** A clickable JSON pane paired with a detail panel — the same component drives
 *  the envelope and the skill-warning payload. */
export default function FieldExplorer({ fields, samples, comments }: FieldExplorerProps) {
  const ui = useUi();
  const [selected, setSelected] = useState(fields[0]?.name ?? '');
  const field = fields.find((f) => f.name === selected) ?? fields[0];

  return (
    <div className="explorer">
      <div className="json-pane">
        <div className="row">
          <span className="p">{'{'}</span>
        </div>
        {fields.map((f, i) => {
          const value = samples[f.name] ?? 'null';
          const comment = comments?.[f.name];
          return (
            <div className="row" key={f.name}>
              {'  '}
              <span
                className={`k${f.name === selected ? ' sel' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(f.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(f.name);
                  }
                }}
              >
                &quot;{f.name}&quot;
              </span>
              <span className="p">: </span>
              <span className={isStringLiteral(value) ? 's' : 'p'}>{value}</span>
              <span className="p">{i < fields.length - 1 ? ',' : ''}</span>
              {comment ? <span className="c">{`  // ${comment}`}</span> : null}
            </div>
          );
        })}
        <div className="row">
          <span className="p">{'}'}</span>
        </div>
      </div>

      <div className="detail-pane">
        {field && (
          <>
            <h4>{field.name}</h4>
            <div className="meta">
              <span className={`tag ${field.required ? 'req' : 'opt'}`}>
                {field.required ? ui.field.required : ui.field.optional}
              </span>
              <span className="tag">{field.type}</span>
            </div>
            <p dangerouslySetInnerHTML={{ __html: field.desc }} />
            {field.note && <p className="hint" dangerouslySetInnerHTML={{ __html: field.note }} />}
          </>
        )}
      </div>
    </div>
  );
}
