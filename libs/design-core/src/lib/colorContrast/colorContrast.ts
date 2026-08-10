type HslValue = {
  h: number;
  s: number;
  l: number;
};

function hexToHsl(hex: string): HslValue {
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result === null) {
    throw new Error('could not parse hex color');
  }

  const [, rHex, gHex, bHex] = result;

  const r = Number.parseInt(rHex, 16) / 255;
  const g = Number.parseInt(gHex, 16) / 255;
  const b = Number.parseInt(bHex, 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    // it's achromatic
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  if (max === r) {
    h = (g - b) / d + (g < b ? 6 : 0);
  } else if (max === g) {
    h = (b - r) / d + 2;
  } else if (max === b) {
    h = (r - g) / d + 4;
  }
  h /= 6;

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
}

function hslToHex(hsl: HslValue): string {
  const { h, s, l } = hsl;

  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // prefix hex with '0' if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Nudges a foreground color's HSL lightness away from a background color so
 * the two are at least `threshold` lightness units apart.
 *
 * If the colors are already sufficiently distinct the original `color` string
 * is returned unchanged.
 *
 * When an adjustment is needed, the fg is pushed in the direction it already
 * sits relative to the bg, i.e., a lighter fg is lightened further, a darker fg is
 * darkened further.
 *
 * Both `color` and `bgColor` must be 6-digit hex strings (e.g. `#aabbcc`).
 * CSS variables and `rgb()` values are not supported.
 *
 * @param color - The foreground hex color to adjust.
 * @param bgColor - The background hex color to contrast against.
 * @param threshold - Minimum lightness delta to enforce. Defaults to `20`.
 */
const HEX_COLOR_RE = /^#[a-f\d]{6}$/i;

export function getContrastSafeColor(
  color: string,
  bgColor: string,
  threshold = 20,
): string {
  if (!HEX_COLOR_RE.test(color) || !HEX_COLOR_RE.test(bgColor)) {
    return color;
  }

  const fg = hexToHsl(color);
  const bg = hexToHsl(bgColor);

  const delta = Math.abs(fg.l - bg.l);

  // compare lightness values of bg and fg
  if (delta >= threshold) {
    return color; // already distinct enough
  }

  // push fg away from bg from where it already sits
  const needed = threshold - delta;
  fg.l =
    fg.l >= bg.l ? Math.min(100, fg.l + needed) : Math.max(0, fg.l - needed);

  return hslToHex(fg);
}
