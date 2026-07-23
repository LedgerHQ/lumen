import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import { useBottomSheetContext } from './BottomSheet';
import { useIsInsideScrollableView } from './Scrollables';
import type { BottomSheetContentProps } from './types';

const useStyles = (hasFooter: boolean, isInsideScrollableView: boolean) =>
  useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          flex: 1,
          paddingBottom: hasFooter ? 0 : t.spacings.s16,
        },
        !isInsideScrollableView && {
          paddingHorizontal: t.spacings.s16,
        },
      ]),
    }),
    [hasFooter],
  );

export const BottomSheetContent = ({
  children,
  style,
  lx,
  ...props
}: BottomSheetContentProps) => {
  const ctx = useBottomSheetContext({
    consumerName: 'BottomSheetContent',
    contextRequired: false,
  });
  const styles = useStyles(
    ctx?.hasFooter ?? false,
    useIsInsideScrollableView(),
  );

  return (
    <Box {...props} lx={lx} style={[styles.container, style]}>
      {children}
    </Box>
  );
};
