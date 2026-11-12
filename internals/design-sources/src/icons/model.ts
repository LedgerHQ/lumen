import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const ICONS_DIR = path.resolve(import.meta.dirname, '../../icons');

/** Written by the Figma export next to the SVGs: what was exported, and when. */
export type IconManifest = { lastModified: string; componentIds: string[] };

export type IconSource = {
  /** File name without `.svg`, as named in Figma. */
  name: string;
  svg: string;
};

export type IconModel = {
  icons: IconSource[];
  manifest: IconManifest;
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
/** Black becomes `currentColor`; `none` and white (clip-path masks) are structural. */
const ALLOWED_COLORS = new Set([
  'none',
  'black',
  '#000',
  '#000000',
  'white',
  '#fff',
  '#ffffff',
]);

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
    const colors = [...svg.matchAll(/(?:fill|stroke)="([^"]+)"/g)]
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
  const manifest = JSON.parse(
    readFileSync(path.join(dir, 'icons.json'), 'utf8'),
  ) as IconManifest;

  const { errors, warnings } = validateIcons(icons);
  if (errors.length) throw new IconValidationError(errors);
  return { icons, manifest, warnings };
};
