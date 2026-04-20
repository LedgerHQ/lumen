import type { DependencyList } from 'react';
import { useMemo, useRef } from 'react';
import type {
  LumenStyleSheet,
  LumenStyleSheetExtended,
  LumenStyleSheetTheme,
} from '../types';
import { useTheme } from './useTheme';

export const useStyleSheet = <S extends LumenStyleSheet>(
  styleCreator: LumenStyleSheetExtended<S>,
  deps: DependencyList,
): S => {
  const { theme } = useTheme();
  const styleCreatorRef = useRef(styleCreator);
  styleCreatorRef.current = styleCreator;

  return useMemo(() => {
    const isFunction = typeof styleCreatorRef.current === 'function';
    const styles = isFunction
      ? (styleCreatorRef.current as (theme: LumenStyleSheetTheme) => S)(theme)
      : styleCreatorRef.current;

    return styles as S;
  }, [theme, ...deps]);
};
