import {
  BottomSheetView as GorhomBottomSheetView,
  BottomSheetFlatList as GorhomBottomSheetFlatList,
  BottomSheetSectionList as GorhomBottomSheetSectionList,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetVirtualizedList as GorhomBottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';
import { createContext, useContext } from 'react';
import { useStyleSheet } from '../../../styles';
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
