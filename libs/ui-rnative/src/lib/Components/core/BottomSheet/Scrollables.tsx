import {
  BottomSheetView as GorhomBottomSheetView,
  BottomSheetFlatList as GorhomBottomSheetFlatList,
  BottomSheetSectionList as GorhomBottomSheetSectionList,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetVirtualizedList as GorhomBottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';
import { createContext, useContext } from 'react';
import type { DefaultSectionT } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { useBottomSheetContext } from './BottomSheet';
import type {
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

export const BottomSheetScrollView = ({
  children,
  style,
  ref,
  ...props
}: BottomSheetScrollViewProps) => {
  const styles = useScrollableStyles();

  return (
    <GorhomBottomSheetScrollView
      ref={ref}
      style={[styles.container, style]}
      {...props}
    >
      {children}
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
