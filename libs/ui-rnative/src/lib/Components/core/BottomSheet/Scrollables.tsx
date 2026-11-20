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
  type ReactElement,
  type ReactNode,
} from 'react';
import type { DefaultSectionT } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { useBottomSheetContext } from './BottomSheet';
import { BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetStickyHeaderProvider } from './BottomSheetStickyHeaderContext';
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

export const BottomSheetFlatList = <T,>({
  children,
  style,
  ref,
  ...props
}: BottomSheetFlatListProps<T>) => {
  const styles = useScrollableStyles();

  return (
    <GorhomBottomSheetFlatList<T>
      ref={ref}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </GorhomBottomSheetFlatList>
  );
};

export const BottomSheetSectionList = <ItemT, SectionT = DefaultSectionT>({
  children,
  style,
  ref,
  ...props
}: BottomSheetSectionListProps<ItemT, SectionT>) => {
  const styles = useScrollableStyles();

  return (
    <GorhomBottomSheetSectionList<ItemT, SectionT>
      ref={ref}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </GorhomBottomSheetSectionList>
  );
};

const isStickyHeader = (child: ReactNode): child is ReactElement =>
  isValidElement<BottomSheetHeaderProps>(child) &&
  child.type === BottomSheetHeader &&
  child.props.sticky !== false;

/**
 * Pins the direct BottomSheetHeader children. Each one gets its own provider so only
 * pinned headers turn opaque; wrapping one element per child keeps the indices that
 * ScrollView computes with Children.toArray.
 */
const pinStickyHeaders = (
  children: ReactNode,
): { children: ReactNode[]; indices: number[] } => {
  const indices: number[] = [];
  const mapped = Children.toArray(children).map((child, index) => {
    if (!isStickyHeader(child)) {
      return child;
    }
    indices.push(index);
    return (
      <BottomSheetStickyHeaderProvider
        key={child.key}
        value={{ isSticky: true }}
      >
        {child}
      </BottomSheetStickyHeaderProvider>
    );
  });
  return { children: mapped, indices };
};

export const BottomSheetScrollView = ({
  children,
  style,
  ref,
  stickyHeaderIndices,
  ...props
}: BottomSheetScrollViewProps) => {
  const styles = useScrollableStyles();

  const pinned = useMemo(() => {
    // An animated SharedValue can't be merged with, so the consumer keeps full control.
    if (stickyHeaderIndices && !Array.isArray(stickyHeaderIndices)) {
      return { children, stickyHeaderIndices };
    }
    const { children: pinnedChildren, indices } = pinStickyHeaders(children);
    const merged = new Set([...indices, ...(stickyHeaderIndices ?? [])]);
    return {
      children: pinnedChildren,
      stickyHeaderIndices:
        merged.size > 0
          ? [...merged].sort((a, b) => a - b)
          : stickyHeaderIndices,
    };
  }, [children, stickyHeaderIndices]);

  return (
    <GorhomBottomSheetScrollView
      ref={ref}
      style={[styles.container, style]}
      stickyHeaderIndices={pinned.stickyHeaderIndices}
      {...props}
    >
      {pinned.children}
    </GorhomBottomSheetScrollView>
  );
};

export const BottomSheetVirtualizedList = <T,>({
  children,
  style,
  ref,
  ...props
}: BottomSheetVirtualizedListProps<T>) => {
  const styles = useScrollableStyles();

  return (
    <GorhomBottomSheetVirtualizedList<T>
      ref={ref}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </GorhomBottomSheetVirtualizedList>
  );
};
