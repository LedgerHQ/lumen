import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import { useBottomSheetContext } from './BottomSheet';
import { useIsInsideScrollableView } from './Scrollables';
import type { BottomSheetContentProps } from './types';

const useStyles = (hasFooter: boolean) =>
  useStyleSheet(
    (t) => ({
      container: {
        flex: 1,
        paddingHorizontal: t.spacings.s16,
        paddingBottom: hasFooter ? 0 : t.spacings.s16,
      },
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
  const styles = useStyles(ctx?.hasFooter ?? false);
  const insideScrollableView = useIsInsideScrollableView();

  return (
    <Box
      {...props}
      lx={lx}
      style={[
        styles.container,
        insideScrollableView && { paddingHorizontal: 0 },
        style,
      ]}
    >
      {children}
    </Box>
  );
};
