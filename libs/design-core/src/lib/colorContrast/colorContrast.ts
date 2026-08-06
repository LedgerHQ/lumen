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

  const r = parseInt(rHex, 16) / 255;
  const g = parseInt(gHex, 16) / 255;
  const b = parseInt(bHex, 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    // it's achromatic
    return { h: 0, s: 0, l };
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

export function resolveColorContrast(
  color: string,
  bgColor?: string,
  threshold = 20,
): string {
  // TODO: we might want to default this to bg-surface or similar bg
  if (!bgColor) {
    return color;
  }

  const fg = hexToHsl(color);
  const bg = hexToHsl(bgColor);

  const delta = Math.abs(fg.l - bg.l);

  // compare lightness values of bg and fg
  if (delta >= threshold) {
    return color; // already distinct enough
  }

  const needed = threshold - delta;
  fg.l =
    bg.l < 50
      ? Math.max(0, fg.l - needed) // darken
      : Math.min(100, fg.l + needed); // lighten

  return hslToHex(fg);
}
