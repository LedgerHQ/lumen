import { type HslValue } from './hexToHsl';

export function hslToHex(hsl: HslValue): string {
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
