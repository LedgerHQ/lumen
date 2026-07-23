import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import { useBottomSheetContext } from './BottomSheet';
import { useIsInsideScrollableView } from './Scrollables';
import type { BottomSheetFooterProps } from './types';

const useStyles = (insideScrollableView: boolean) =>
  useStyleSheet(
    (t) => ({
      root: StyleSheet.flatten([
        {
          paddingTop: t.spacings.s12,
          paddingBottom: t.spacings.s16,
          backgroundColor: t.colors.bg.canvasSheet,
          gap: t.spacings.s8,
        },
        !insideScrollableView && { paddingHorizontal: t.spacings.s16 },
      ]),
    }),
    [insideScrollableView],
  );

export const BottomSheetFooter = ({
  children,
  style,
  lx,
}: BottomSheetFooterProps) => {
  const insideScrollableView = useIsInsideScrollableView();
  const styles = useStyles(insideScrollableView);
  const { setHasFooter } = useBottomSheetContext({
    consumerName: 'BottomSheetFooter',
    contextRequired: true,
  });

  useEffect(() => {
    setHasFooter(true);
    return () => setHasFooter(false);
  }, [setHasFooter]);

  return (
    <Box style={[styles.root, style]} lx={lx}>
      {children}
    </Box>
  );
};
