import { hexToHsl } from './hexToHsl';
import { hslToHex } from './hslToHex';

const HEX_COLOR_RE = /^#[a-f\d]{6}$/i;

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
