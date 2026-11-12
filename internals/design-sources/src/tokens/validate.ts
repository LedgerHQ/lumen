import { DTCG_TYPES, type DtcgType, referenceOf } from './dtcg.js';
import { flattenTokens, type SourceFile, type Token } from './load.js';

export type ValidationReport = { errors: string[]; warnings: string[] };

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isDimension = (value: unknown): boolean =>
  typeof value === 'object' &&
  value !== null &&
  isNumber((value as { value: unknown }).value) &&
  ['px', '%'].includes((value as { unit: string }).unit);

const isUnit = (value: unknown): boolean =>
  isNumber(value) && value >= 0 && value <= 1;

/** A DTCG 2025.10 sRGB color, with the 6-digit hex fallback the outputs read. */
const isColor = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) return false;
  const { colorSpace, components, alpha, hex } = value as Record<
    string,
    unknown
  >;
  return (
    colorSpace === 'srgb' &&
    Array.isArray(components) &&
    components.length === 3 &&
    components.every(isUnit) &&
    (alpha === undefined || isUnit(alpha)) &&
    typeof hex === 'string' &&
    /^#[0-9a-f]{6}$/.test(hex)
  );
};

/** Colors nested in composite values (shadow layers, gradient stops). */
const nestedColors = (type: DtcgType, value: unknown): unknown[] => {
  if (type === 'shadow') {
    return (Array.isArray(value) ? value : [value]).map(
      (layer) => (layer as { color?: unknown })?.color,
    );
  }
  if (type === 'gradient' && Array.isArray(value)) {
    return value.map((stop) => (stop as { color?: unknown })?.color);
  }
  return [];
};

const isShadowLayer = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) return false;
  const layer = value as Record<string, unknown>;
  return (
    (isColor(layer.color) || referenceOf(layer.color) !== null) &&
    ['offsetX', 'offsetY', 'blur', 'spread'].every((key) =>
      isDimension(layer[key]),
    )
  );
};

const VALUE_CHECKS: Record<DtcgType, (value: unknown) => boolean> = {
  color: isColor,
  dimension: isDimension,
  number: isNumber,
  duration: (value) =>
    typeof value === 'object' &&
    value !== null &&
    isNumber((value as { value: unknown }).value) &&
    (value as { unit: string }).unit === 'ms',
  cubicBezier: (value) =>
    Array.isArray(value) && value.length === 4 && value.every(isNumber),
  fontFamily: (value) => typeof value === 'string' && value.length > 0,
  fontWeight: (value) =>
    (isNumber(value) && value >= 1 && value <= 1000) ||
    typeof value === 'string',
  shadow: (value) =>
    Array.isArray(value) ? value.every(isShadowLayer) : isShadowLayer(value),
  gradient: (value) =>
    Array.isArray(value) &&
    value.every(
      (stop) =>
        (isColor(stop?.color) || referenceOf(stop?.color) !== null) &&
        isNumber(stop?.position),
    ),
};

/** A path segment designers agreed on: lowercase kebab, digits, and `%` for opacity steps. */
const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*%?$/;

/**
 * Checks what the outputs rely on, naming the file and token path of every
 * problem: known types, values that match them, references that resolve to a
 * token of the same type in the same or an earlier collection, no cycles, one
 * collection per token, and the same tokens with the same types in every mode
 * of a collection. Naming issues are warnings until designers confirm the rules.
 */
export const validateSources = (sources: SourceFile[]): ValidationReport => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const tokensByFile = new Map(
    sources.map((source) => [source, flattenTokens(source)]),
  );

  const byId = new Map<string, Token[]>();
  for (const tokens of tokensByFile.values()) {
    for (const token of tokens) {
      byId.set(token.id, [...(byId.get(token.id) ?? []), token]);
    }
  }

  const where = (token: Token): string => `${token.source.file}: ${token.id}`;

  // Modes of one collection share their ids; two collections never do. When a
  // Figma export starts defining a token a code file already holds, the later
  // file would otherwise win without anyone noticing.
  const owner = ({ source }: Token): string =>
    `${source.origin}/${source.collection}`;
  for (const [id, tokens] of byId) {
    const files = [
      ...new Set(
        tokens
          .filter((token) => owner(token) !== owner(tokens[0]))
          .map(({ source }) => source.file),
      ),
    ];
    if (files.length) {
      errors.push(
        `${tokens[0].source.file}: ${id}: also defined in ${files.join(', ')}; a token belongs to one collection`,
      );
    }
  }

  // References point to the same collection or an earlier one (primitives ←
  // theme ← brand…; code files come last), so a single selection of modes can
  // always resolve them.
  const checkReference = (
    token: Token,
    reference: string,
    typeProblem: (target: Token) => string | null,
  ): void => {
    const targets = byId.get(reference);
    if (!targets) {
      errors.push(`${where(token)}: references missing token {${reference}}`);
      return;
    }
    const problem = typeProblem(targets[0]);
    if (problem) {
      errors.push(`${where(token)}: ${problem}`);
    } else if (
      targets.some(({ source }) => source.order > token.source.order)
    ) {
      errors.push(
        `${where(token)}: {${reference}} is in ${targets[0].source.file}, a later collection; references point to the same or an earlier one`,
      );
    }
  };

  for (const tokens of tokensByFile.values()) {
    for (const token of tokens) {
      if (!DTCG_TYPES.has(token.$type)) {
        errors.push(`${where(token)}: unknown $type "${token.$type}"`);
        continue;
      }

      const reference = referenceOf(token.$value);
      if (reference) {
        checkReference(token, reference, (target) =>
          target.$type === token.$type
            ? null
            : `is a ${token.$type} but {${reference}} is a ${target.$type}`,
        );
      } else if (!VALUE_CHECKS[token.$type](token.$value)) {
        errors.push(
          `${where(token)}: ${JSON.stringify(token.$value)} is not a valid ${token.$type}`,
        );
      }

      for (const color of nestedColors(token.$type, token.$value)) {
        const nested = referenceOf(color);
        if (!nested) continue;
        checkReference(token, nested, (target) =>
          target.$type === 'color'
            ? null
            : `{${nested}} is a ${target.$type}, not a color`,
        );
      }

      const badSegments = token.path.filter(
        (segment) => !SEGMENT.test(segment),
      );
      if (badSegments.length) {
        warnings.push(
          `${where(token)}: segment ${badSegments.map((s) => `"${s}"`).join(', ')} is not lowercase kebab-case`,
        );
      }
    }
  }

  // A cycle in the union of every mode is reported even if no single mode
  // would loop; within one collection, the order rule above can't prevent it.
  const edges = new Map<string, Set<string>>();
  for (const [id, tokens] of byId) {
    edges.set(
      id,
      new Set(
        tokens
          .map((token) => referenceOf(token.$value))
          .filter((r): r is string => r !== null),
      ),
    );
  }
  const state = new Map<string, 'visiting' | 'done'>();
  const visit = (id: string, trail: string[]): void => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') {
      errors.push(
        `reference cycle: ${[...trail.slice(trail.indexOf(id)), id].join(' → ')}`,
      );
      return;
    }
    state.set(id, 'visiting');
    for (const next of edges.get(id) ?? []) visit(next, [...trail, id]);
    state.set(id, 'done');
  };
  for (const id of edges.keys()) visit(id, []);

  // Keyed by origin too: a Figma collection and a code file may share a name.
  const byCollection = new Map<string, SourceFile[]>();
  for (const source of sources) {
    const key = `${source.origin}/${source.collection}`;
    byCollection.set(key, [...(byCollection.get(key) ?? []), source]);
  }
  for (const [collection, files] of byCollection) {
    if (files.length < 2) continue;
    if (files.some((file) => file.mode === null)) {
      errors.push(
        `${collection}: mixes a file without a mode and files with modes`,
      );
    }
    const idSets = files.map(
      (file) => new Set(tokensByFile.get(file)?.map((t) => t.id)),
    );
    const all = new Set(idSets.flatMap((ids) => [...ids]));
    files.forEach((file, index) => {
      const missing = [...all].filter((id) => !idSets[index].has(id));
      if (missing.length) {
        errors.push(
          `${file.file}: mode "${file.mode}" lacks ${missing.length} token(s) its siblings define: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ', …' : ''}`,
        );
      }
    });

    // Outputs pick a token's shape once per collection, so a token can't be a
    // color in one mode and a number in another.
    const typeIn = new Map<string, Token>();
    for (const file of files) {
      for (const token of tokensByFile.get(file) ?? []) {
        const first = typeIn.get(token.id);
        if (!first) typeIn.set(token.id, token);
        else if (first.$type !== token.$type) {
          errors.push(
            `${where(token)}: is a ${token.$type} here but a ${first.$type} in ${first.source.file}`,
          );
        }
      }
    }
  }

  return { errors, warnings };
};
