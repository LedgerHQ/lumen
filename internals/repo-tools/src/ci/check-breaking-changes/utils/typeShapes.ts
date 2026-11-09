import ts from 'typescript';

const maxPathDepth = 8;

/** The members of a union, or the type itself. */
export function unionMembers(type: ts.Type): ts.Type[] {
  return type.isUnion() ? type.types : [type];
}

/** A string or number literal's value, as a string. */
function literalValue(type: ts.Type): string | undefined {
  return type.isStringLiteral() || type.isNumberLiteral()
    ? String(type.value)
    : undefined;
}

/**
 * The string and number literals a type accepts, or `null` when it also
 * accepts anything wider. Boolean literals are left out.
 */
export function literalValues(type: ts.Type): string[] | null {
  const members = unionMembers(type).filter(
    (member) => !(member.flags & ts.TypeFlags.BooleanLiteral),
  );
  const values = members.map(literalValue);
  if (values.length === 0 || values.includes(undefined)) return null;
  return (values as string[]).sort();
}

/** The type of a function's first parameter, if it takes one. */
export function firstParameterType(
  checker: ts.TypeChecker,
  type: ts.Type,
): ts.Type | undefined {
  const signature = type
    .getCallSignatures()
    .find((candidate) => candidate.parameters.length > 0);
  return signature && checker.getTypeOfSymbol(signature.parameters[0]);
}

/** An object type that isn't callable. */
export function isPlainObject(type: ts.Type): boolean {
  return (
    (type.flags & ts.TypeFlags.Object) !== 0 &&
    type.getCallSignatures().length === 0
  );
}

/** Where path walking stops: primitives would expand into their methods (`toFixed`). */
function isLeaf(
  checker: ts.TypeChecker,
  type: ts.Type,
  depth: number,
): boolean {
  return (
    depth >= maxPathDepth ||
    !isPlainObject(type) ||
    checker.isArrayLikeType(type) ||
    checker.getPropertiesOfType(type).length === 0
  );
}

/** Leaf paths under `prefix`, walking properties recursively. */
function leafPaths(
  checker: ts.TypeChecker,
  type: ts.Type,
  prefix: string,
  depth: number,
): string[] {
  if (isLeaf(checker, type, depth)) return prefix === '' ? [] : [prefix];
  return checker
    .getPropertiesOfType(type)
    .flatMap((property) =>
      leafPaths(
        checker,
        checker.getTypeOfSymbol(property),
        prefix === '' ? property.name : `${prefix}.${property.name}`,
        depth + 1,
      ),
    );
}

/** Dotted paths to every leaf of an object type (`dark.bg.error`), sorted. */
export function objectPaths(checker: ts.TypeChecker, type: ts.Type): string[] {
  return leafPaths(checker, type, '', 0).sort();
}
