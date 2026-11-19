import {
  BottomSheetView as GorhomBottomSheetView,
  BottomSheetFlatList as GorhomBottomSheetFlatList,
  BottomSheetSectionList as GorhomBottomSheetSectionList,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetVirtualizedList as GorhomBottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useStyleSheet } from '../../../../styles';
import { useBottomSheetContext } from './BottomSheet';
import { BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetScrollViewContext } from './BottomSheetScrollViewContext';
import type {
  BottomSheetHeaderProps,
  BottomSheetViewProps,
  BottomSheetFlatListProps,
  BottomSheetSectionListProps,
  BottomSheetScrollViewProps,
  BottomSheetVirtualizedListProps,
} from './types';

const BottomSheetScrollableViewContext = createContext(false);
export const useIsInsideScrollableView = () =>
  useContext(BottomSheetScrollableViewContext);

const useHasFooter = () => {
  const ctx = useBottomSheetContext({
    consumerName: 'BottomSheetScrollable',
    contextRequired: false,
  });
  return ctx?.hasFooter ?? false;
};

const useScrollableStyles = () => {
  const hasFooter = useHasFooter();
  return useStyleSheet(
    (t) => ({
      container: {
        flex: 1,
        paddingHorizontal: t.spacings.s16,
        paddingBottom: hasFooter ? 0 : t.spacings.s16,
      },
    }),
    [hasFooter],
  );
};

export const BottomSheetView = ({
  children,
  style,
  ...props
}: BottomSheetViewProps) => {
  const styles = useScrollableStyles();

  return (
    <GorhomBottomSheetView style={[styles.container, style]} {...props}>
      <BottomSheetScrollableViewContext.Provider value={true}>
        {children}
      </BottomSheetScrollableViewContext.Provider>
    </GorhomBottomSheetView>
  );
};

export const BottomSheetFlatList = ({
  children,
  style,
  ref,
  ...props
}: BottomSheetFlatListProps) => {
  const styles = useScrollableStyles();

  return (
    <GorhomBottomSheetFlatList
      ref={ref}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </GorhomBottomSheetFlatList>
  );
};

export const BottomSheetSectionList = ({
  children,
  style,
  ref,
  ...props
}: BottomSheetSectionListProps) => {
  const styles = useScrollableStyles();

  return (
    <GorhomBottomSheetSectionList
      ref={ref}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </GorhomBottomSheetSectionList>
  );
};

/**
 * Indices (as seen by ScrollView, which flattens children with Children.toArray)
 * of the BottomSheetHeader children that should stay pinned while scrolling.
 */
const getStickyHeaderIndices = (children: ReactNode): number[] =>
  Children.toArray(children).flatMap((child, index) =>
    isValidElement<BottomSheetHeaderProps>(child) &&
    child.type === BottomSheetHeader &&
    child.props.sticky !== false
      ? [index]
      : [],
  );

export const BottomSheetScrollView = ({
  children,
  style,
  ref,
  stickyHeaderIndices,
  ...props
}: BottomSheetScrollViewProps) => {
  const styles = useScrollableStyles();

  const mergedStickyHeaderIndices = useMemo(() => {
    const indices = new Set([
      ...getStickyHeaderIndices(children),
      ...(stickyHeaderIndices ?? []),
    ]);
    return indices.size > 0
      ? [...indices].sort((a, b) => a - b)
      : stickyHeaderIndices;
  }, [children, stickyHeaderIndices]);

  // The provider wraps the scroll view rather than its children so they stay direct children for stickyHeaderIndices.
  return (
    <BottomSheetScrollViewContext.Provider value={true}>
      <GorhomBottomSheetScrollView
        ref={ref}
        style={[styles.container, style]}
        stickyHeaderIndices={mergedStickyHeaderIndices}
        {...props}
      >
        {children}
      </GorhomBottomSheetScrollView>
    </BottomSheetScrollViewContext.Provider>
  );
};

export const BottomSheetVirtualizedList = ({
  children,
  style,
  ref,
  ...props
}: BottomSheetVirtualizedListProps) => {
  const styles = useScrollableStyles();

  return (
    <GorhomBottomSheetVirtualizedList
      ref={ref}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </GorhomBottomSheetVirtualizedList>
  );
};
