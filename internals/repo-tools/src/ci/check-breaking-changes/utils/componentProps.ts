import ts from 'typescript';
import {
  firstParameterType,
  literalValues,
  unionMembers,
} from './typeShapes.ts';

export type PropInfo = { optional: boolean; values: string[] | null };
export type Props = Record<string, PropInfo>;

/** A prop inherited from React or the DOM: only its presence can break. */
const inherited: PropInfo = { optional: true, values: null };

/** Whether a prop is optional, and the literal values it accepts. */
function propInfo(checker: ts.TypeChecker, prop: ts.Symbol): PropInfo {
  return {
    optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
    values: literalValues(
      checker.getNonNullableType(checker.getTypeOfSymbol(prop)),
    ),
  };
}

/** Props of one object type, detailed only for those `isOwn` accepts. */
function memberProps(
  checker: ts.TypeChecker,
  member: ts.Type,
  isOwn: (symbol: ts.Symbol) => boolean,
): Props {
  return Object.fromEntries(
    checker
      .getPropertiesOfType(member)
      .map((prop) => [
        prop.name,
        isOwn(prop) ? propInfo(checker, prop) : inherited,
      ]),
  );
}

/** Union of two value lists; `null` (any value) wins. */
function mergeValues(a: PropInfo['values'], b: PropInfo['values']) {
  return a && b ? [...new Set([...a, ...b])].sort() : null;
}

/**
 * Merges the props of union members (discriminated props): a prop is
 * optional unless every member requires it, and accepts any member's values.
 */
function mergeUnionProps(members: Props[]): Props {
  const names = new Set(members.flatMap((props) => Object.keys(props)));
  return Object.fromEntries(
    [...names].map((name) => {
      const infos = members.map((props) => props[name]);
      const present = infos.filter((info) => info !== undefined);
      const optional =
        present.length < infos.length || present.some((info) => info.optional);
      const values = present.map((info) => info.values).reduce(mergeValues);
      return [name, { optional, values }];
    }),
  );
}

/** Props of a component type, or `undefined` when it takes none. */
export function componentProps(
  checker: ts.TypeChecker,
  type: ts.Type,
  isOwn: (symbol: ts.Symbol) => boolean,
): Props | undefined {
  const propsType = firstParameterType(checker, type);
  if (propsType === undefined) return undefined;
  return mergeUnionProps(
    unionMembers(propsType).map((member) =>
      memberProps(checker, member, isOwn),
    ),
  );
}
