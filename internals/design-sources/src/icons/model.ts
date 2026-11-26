import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * The SVGs ship byte for byte as Figma exports them, so the published folder
 * is their source: a copy here would only be committed twice.
 */
export const ICONS_DIR = path.resolve(
  import.meta.dirname,
  '../../../../libs/design-core/symbols/icons',
);

export type IconSource = {
  /** File name without `.svg`, as named in Figma. */
  name: string;
  svg: string;
};

export type IconModel = {
  icons: IconSource[];
  warnings: string[];
};

export class IconValidationError extends Error {
  readonly errors: string[];

  constructor(errors: string[]) {
    super(`Invalid icon sources:\n- ${errors.join('\n- ')}`);
    this.errors = errors;
  }
}

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** Black becomes `currentColor`; `currentColor` and `none` follow it already. */
const ALLOWED_COLORS = new Set([
  'none',
  'currentcolor',
  'black',
  '#000',
  '#000000',
]);
/**
 * Masks and clip paths paint in white to cut shapes: what they hold is
 * structure, not a color the icon shows, so it isn't checked.
 */
const MASKS = /<(mask|clipPath)\b[\s\S]*?<\/\1>/g;

/**
 * Checks what the generated components rely on. A file that isn't an SVG
 * fails; names and colors that only render oddly are warnings for designers.
 */
export const validateIcons = (
  icons: IconSource[],
): { errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const { name, svg } of icons) {
    if (!/^\s*<svg[\s>]/.test(svg)) {
      errors.push(`${name}.svg: not an <svg> document`);
      continue;
    }
    if (!/viewBox="[^"]+"/.test(svg)) {
      errors.push(`${name}.svg: no viewBox, so it can't scale`);
    }
    if (!NAME.test(name)) {
      warnings.push(`${name}.svg: name is not lowercase kebab-case`);
    }
    const colors = [
      ...svg.replace(MASKS, '').matchAll(/(?:fill|stroke)="([^"]+)"/g),
    ]
      .map(([, color]) => color)
      .filter((color) => !ALLOWED_COLORS.has(color.toLowerCase()));
    if (colors.length) {
      warnings.push(
        `${name}.svg: hard-coded color ${[...new Set(colors)].join(', ')} won't follow currentColor`,
      );
    }
  }
  return { errors, warnings };
};

/** Loads and validates every icon; throws with every error listed. */
export const createIconModel = (dir: string = ICONS_DIR): IconModel => {
  const icons = readdirSync(dir)
    .filter((file) => file.endsWith('.svg'))
    .sort()
    .map((file) => ({
      name: file.slice(0, -'.svg'.length),
      svg: readFileSync(path.join(dir, file), 'utf8'),
    }));

  const { errors, warnings } = validateIcons(icons);
  if (errors.length) throw new IconValidationError(errors);
  return { icons, warnings };
};
