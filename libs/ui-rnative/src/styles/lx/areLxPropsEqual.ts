import type {
  StyledPressableProps,
  StyledTextProps,
  StyledViewProps,
} from '../types';

type UnknownRecord = Record<string, unknown>;

/**
 * Shallow equal for all props
 */
const shallowEqual = (a: UnknownRecord, b: UnknownRecord): boolean => {
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  return keysA.every((k) => a[k] === b[k]);
};

export const areLxPropsEqual = (
  prevProps: StyledViewProps | StyledTextProps | StyledPressableProps,
  nextProps: StyledViewProps | StyledTextProps | StyledPressableProps,
): boolean => {
  const { lx: prevLx = {}, ...prevRest } = prevProps;
  const { lx: nextLx = {}, ...nextRest } = nextProps;

  return (
    shallowEqual(prevLx, nextLx) &&
    shallowEqual(
      prevRest as Record<string, unknown>,
      nextRest as Record<string, unknown>,
    )
  );
};
