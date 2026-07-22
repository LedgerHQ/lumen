import {
  BottomSheetFooter as GorhomBottomSheetFooter,
} from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import type { BottomSheetFooterProps } from './types';

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      root: {
        paddingHorizontal: t.spacings.s16,
        paddingTop: t.spacings.s12,
        paddingBottom: t.spacings.s16,
        backgroundColor: t.colors.bg.canvasSheet,
        gap: t.spacings.s8,
      },
    }),
    [],
  );

export const BottomSheetFooter = ({
  children,
  style,
  ...props
}: BottomSheetFooterProps) => {
  const styles = useStyles();
  return (
    <GorhomBottomSheetFooter
      {...props}
      style={StyleSheet.flatten([styles.root, style])}
    >
      {children}
    </GorhomBottomSheetFooter>
  );
};
