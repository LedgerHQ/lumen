import { BottomSheetBackdrop as GorhomBottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useStyleSheet } from '../../../styles';
import { BottomSheetProps } from './types';

type BackDropProps = React.ComponentProps<typeof GorhomBottomSheetBackdrop> & {
  backdropPressBehavior?: BottomSheetProps['backdropPressBehavior'];
  onPress?: () => void;
};

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      backdrop: {
        backgroundColor: t.colors.bg.canvasOverlay,
      },
    }),
    [],
  );
};

export const CustomBackdrop = ({
  backdropPressBehavior,
  onPress,
  ...props
}: BackDropProps) => {
  const styles = useStyles();

  return (
    <GorhomBottomSheetBackdrop
      {...props}
      style={styles.backdrop}
      opacity={1}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior={backdropPressBehavior}
      onPress={() => {
        onPress?.();
      }}
    />
  );
};
CustomBackdrop.displayName = 'CustomBackdrop';
