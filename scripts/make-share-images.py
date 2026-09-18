#!/usr/bin/env python3
"""Generate the share images for storyobjectmodel.dev.

Everything is drawn from the same tokens the site uses, on the light ground
that is the site's default, so a WhatsApp or Slack preview looks like the page
it links to.

    python3 scripts/make-share-images.py

Writes public/og.png (1200x630), public/og-square.png (1000x1000),
public/apple-touch-icon.png (180x180), and the favicons: public/favicon.ico
(16/32/48), public/icon-192.png and public/icon-512.png.

The favicons sit on the solid light ground rather than transparent: Google
shows them on white and on dark results pages, and wants a square at least
48px on a side. The SVG favicon adapts to dark mode; these cannot.
"""

from __future__ import annotations

import math
import os

from PIL import Image, ImageDraw, ImageFont

# --- tokens, mirroring src/styles/site.css -------------------------------

BG = (255, 255, 255)
FG = (16, 26, 36)
FG_2 = (77, 91, 104)
FG_3 = (125, 139, 152)
ACCENT = (211, 32, 26)       # AP red
ACCENT_2 = (47, 107, 222)
LINE = (227, 233, 238)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")

# Supersampling factor — everything is drawn large and reduced once at the end.
SS = 3

FONT_CANDIDATES = [
    ("/System/Library/Fonts/HelveticaNeue.ttc", 0, 1),   # (path, regular idx, bold idx)
    ("/System/Library/Fonts/Helvetica.ttc", 0, 1),
    ("/Library/Fonts/Arial.ttf", None, None),
]


def load_fonts():
    for path, reg, bold in FONT_CANDIDATES:
        if not os.path.exists(path):
            continue
        try:
            if reg is None:
                return path, None, None
            ImageFont.truetype(path, 20, index=reg)
            ImageFont.truetype(path, 20, index=bold)
            return path, reg, bold
        except OSError:
            continue
    raise SystemExit("No usable system font found — edit FONT_CANDIDATES.")


FONT_PATH, IDX_REG, IDX_BOLD = load_fonts()


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    idx = IDX_BOLD if bold else IDX_REG
    if idx is None:
        return ImageFont.truetype(FONT_PATH, size * SS)
    return ImageFont.truetype(FONT_PATH, size * SS, index=idx)


def width_of(draw: ImageDraw.ImageDraw, text: str, f: ImageFont.FreeTypeFont) -> float:
    return draw.textlength(text, font=f)


# --- the mark ------------------------------------------------------------

# The SOM mark as storyobjectmodel.com draws it: three bars on a 24-unit grid,
# the middle one offset. Ink for the outer bars, the site accent for the middle.
BARS = [((0, 2, 17, 4.6), FG), ((5, 9.7, 19, 4.6), ACCENT), ((0, 17.4, 17, 4.6), FG)]


def draw_mark(draw: ImageDraw.ImageDraw, x: float, y: float, size: float) -> None:
    """Draw the SOM mark with its top-left corner at (x, y), `size` wide."""
    u = size / 24.0                       # the mark is authored on a 24-unit grid
    for (bx, by, bw, bh), colour in BARS:
        draw.rectangle((x + bx * u, y + by * u, x + (bx + bw) * u, y + (by + bh) * u), fill=colour)


def draw_squiggle(draw: ImageDraw.ImageDraw, x0: float, x1: float, top: float, scale: float) -> None:
    """The hand-drawn underline from the hero: two strokes that settle.

    `top` is where the underline zone begins — below the descenders, not on the
    baseline — and `scale` is the headline size it has to hold up.
    """
    span = x1 - x0
    stroke = max(1, int(round(scale * 0.055)))
    for dx0, dx1, drop, bow, alpha in (
        (0.00, 1.00, 0.00, 1.0, 0.46),
        (0.11, 0.92, 0.085, 0.6, 0.32),
    ):
        pts = []
        steps = 40
        for i in range(steps + 1):
            t = i / steps
            px = x0 + span * (dx0 + (dx1 - dx0) * t)
            # A shallow bow so the stroke reads as drawn, not ruled.
            py = top + scale * drop - math.sin(math.pi * t) * scale * 0.022 * bow
            pts.append((px, py))
        colour = tuple(round(c + (255 - c) * (1 - alpha)) for c in ACCENT)
        draw.line(pts, fill=colour, width=stroke, joint="curve")


# --- the images ----------------------------------------------------------


def make_og(width: int, height: int, path: str, square: bool = False) -> None:
    """Draw a share card. The wide card fits the headline on two lines; the
    square one needs three, so the layout is described rather than hard-coded."""
    img = Image.new("RGB", (width * SS, height * SS), BG)
    d = ImageDraw.Draw(img)

    pad = (72 if not square else 88) * SS
    d.rectangle((0, 0, width * SS, 9 * SS), fill=ACCENT)

    # --- lockup
    mark = (58 if not square else 66) * SS
    mark_y = pad + (6 * SS)
    draw_mark(d, pad, mark_y, mark)

    f_word = font(30 if not square else 34, bold=True)
    wx = pad + mark + 16 * SS
    wy = mark_y + mark / 2
    name = "storyobjectmodel"
    d.text((wx, wy), name, font=f_word, fill=FG, anchor="lm")
    d.text((wx + width_of(d, name, f_word), wy), ".dev", font=f_word, fill=ACCENT, anchor="lm")

    # --- headline: a list of lines, each a list of (text, colour, underlined)
    if square:
        head_size, base_y = 68, 470
        lines = [
            [("One bus for", FG, False)],
            [("story context.", ACCENT, True)],
            [("Every tool on it.", FG, False)],
        ]
        sub_lines = [
            "An open standard for sharing story context",
            "between newsroom systems.",
        ]
    else:
        head_size, base_y = 74, 300
        lines = [
            [("One bus for ", FG, False), ("story context.", ACCENT, True)],
            [("Every tool on it.", FG, False)],
        ]
        sub_lines = ["An open standard for sharing story context between newsroom systems."]

    f_head = font(head_size, bold=True)
    lead = int(head_size * 1.16) * SS
    y = base_y * SS

    for line in lines:
        x = pad
        for text, colour, underlined in line:
            d.text((x, y), text, font=f_head, fill=colour, anchor="ls")
            if underlined:
                # Underline the phrase, not its full stop.
                phrase = text.rstrip(".")
                draw_squiggle(
                    d, x, x + width_of(d, phrase, f_head),
                    y + head_size * SS * 0.25, head_size * SS,
                )
            x += width_of(d, text, f_head)
        y += lead

    # --- supporting copy
    f_sub = font(27 if not square else 29)
    y += (14 if not square else 4) * SS
    for text in sub_lines:
        d.text((pad, y), text, font=f_sub, fill=FG_2, anchor="ls")
        y += int((27 if not square else 29) * 1.45) * SS

    # --- footer rule + status
    rule_y = (height - (96 if not square else 118)) * SS
    d.line((pad, rule_y, width * SS - pad, rule_y), fill=LINE, width=max(1, SS))

    f_foot = font(23 if not square else 25)
    d.text(
        (pad, rule_y + (44 if not square else 52) * SS),
        "SOM 1.0 · open and unowned · an unofficial guide",
        font=f_foot,
        fill=FG_3,
        anchor="ls",
    )

    img.resize((width, height), Image.LANCZOS).save(path, optimize=True)
    print(f"wrote {os.path.relpath(path, ROOT)} ({width}x{height})")


def render_icon(size: int) -> Image.Image:
    img = Image.new("RGB", (size * SS, size * SS), BG)
    d = ImageDraw.Draw(img)
    mark = size * SS * 0.62
    draw_mark(d, (size * SS - mark) / 2, (size * SS - mark) / 2, mark)
    return img.resize((size, size), Image.LANCZOS)


def make_icon(size: int, path: str) -> None:
    render_icon(size).save(path, optimize=True)
    print(f"wrote {os.path.relpath(path, ROOT)} ({size}x{size})")


def make_ico(path: str) -> None:
    # Drawn at 48 and downsampled by Pillow into each size the ICO carries.
    render_icon(48 * 4).save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"wrote {os.path.relpath(path, ROOT)} (16/32/48)")


if __name__ == "__main__":
    make_og(1200, 630, os.path.join(PUBLIC, "og.png"))
    make_og(1000, 1000, os.path.join(PUBLIC, "og-square.png"), square=True)
    make_icon(180, os.path.join(PUBLIC, "apple-touch-icon.png"))
    make_icon(192, os.path.join(PUBLIC, "icon-192.png"))
    make_icon(512, os.path.join(PUBLIC, "icon-512.png"))
    make_ico(os.path.join(PUBLIC, "favicon.ico"))
