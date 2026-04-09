import {
  BottomSheetView as GorhomBottomSheetView,
  BottomSheetFlatList as GorhomBottomSheetFlatList,
  BottomSheetSectionList as GorhomBottomSheetSectionList,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetVirtualizedList as GorhomBottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';
import { ViewStyle } from 'react-native';
import { useStyleSheet } from '../../../styles';
import {
  BottomSheetViewProps,
  BottomSheetFlatListProps,
  BottomSheetSectionListProps,
  BottomSheetScrollViewProps,
  BottomSheetVirtualizedListProps,
} from './types';

const useScrollableStyles = () => {
  return useStyleSheet(
    (t) => ({
      container: {
        flex: 1,
        paddingHorizontal: t.spacings.s16,
        paddingBottom: t.spacings.s16,
      },
    }),
    [],
  );
};

export const BottomSheetView = ({
  children,
  style,
  ...props
}: BottomSheetViewProps) => {
  const styles = useScrollableStyles();

  return (
    <GorhomBottomSheetView
      style={[styles.container as ViewStyle, style]}
      {...props}
    >
      {children}
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
      style={[styles.container as ViewStyle, style]}
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
      style={[styles.container as ViewStyle, style]}
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
      style={[styles.container as ViewStyle, style]}
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
      style={[styles.container as ViewStyle, style]}
      {...props}
    >
      {children}
    </GorhomBottomSheetVirtualizedList>
  );
};
