import {
  BottomSheetView as GorhomBottomSheetView,
  BottomSheetFlatList as GorhomBottomSheetFlatList,
  BottomSheetSectionList as GorhomBottomSheetSectionList,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetVirtualizedList as GorhomBottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';
import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { useBottomSheetContext } from './BottomSheet';
import type {
  BottomSheetViewProps,
  BottomSheetFlatListProps,
  BottomSheetSectionListProps,
  BottomSheetScrollViewProps,
  BottomSheetVirtualizedListProps,
} from './types';

const useHasFooter = () => {
  const ctx = useBottomSheetContext({
    consumerName: 'BottomSheetScrollable',
    contextRequired: false,
  });
  return ctx?.hasFooter ?? false;
};

const useScrollableStyles = (hasFooter: boolean) => {
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
  const styles = useScrollableStyles(useHasFooter());

  return (
    <GorhomBottomSheetView style={[styles.container, style]} {...props}>
      {children}
    </GorhomBottomSheetView>
  );
};

export const BottomSheetContent = ({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) => {
  const styles = useScrollableStyles(useHasFooter());
  return <View style={[styles.container, style]}>{children}</View>;
};

export const BottomSheetFlatList = ({
  children,
  style,
  ref,
  ...props
}: BottomSheetFlatListProps) => {
  const styles = useScrollableStyles(useHasFooter());

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
  const styles = useScrollableStyles(useHasFooter());

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
  const styles = useScrollableStyles(useHasFooter());

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
  const styles = useScrollableStyles(useHasFooter());

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
