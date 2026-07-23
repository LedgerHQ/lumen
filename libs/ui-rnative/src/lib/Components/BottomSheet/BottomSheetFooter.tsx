import { useEffect } from 'react';
import { View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { useBottomSheetContext } from './BottomSheet';
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
}: BottomSheetFooterProps) => {
  const styles = useStyles();
  const { setHasFooter } = useBottomSheetContext({
    consumerName: 'BottomSheetFooter',
    contextRequired: true,
  });

  useEffect(() => {
    setHasFooter(true);
    return () => setHasFooter(false);
  }, [setHasFooter]);

  return <View style={[styles.root, style]}>{children}</View>;
};
