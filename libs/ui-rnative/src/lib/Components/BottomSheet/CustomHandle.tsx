import type { BottomSheetVariables } from '@gorhom/bottom-sheet/lib/typescript/types';
import type { ComponentRef, Ref } from 'react';
import { View } from 'react-native';
import { useStyleSheet } from '../../../styles';

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      container: {
        height: t.spacings.s16,
        width: t.sizes.s80,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'transparent',
      },
      handle: {
        height: t.spacings.s4,
        width: t.sizes.s36,
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedTransparent,
      },
    }),
    [],
  );
};

export const CustomHandle = ({
  ref,
  ...props
}: BottomSheetVariables & { ref?: Ref<ComponentRef<typeof View>> }) => {
  const styles = useStyles();

  return (
    <View
      {...props}
      ref={ref}
      style={styles.container}
      testID='bottom-sheet-handle'
    >
      <View style={styles.handle} />
    </View>
  );
};

export const HiddenHandle = ({
  ref,
  ...props
}: BottomSheetVariables & { ref?: Ref<ComponentRef<typeof View>> }) => {
  const styles = useStyles();

  return (
    <View
      {...props}
      ref={ref}
      style={styles.container}
      testID='bottom-sheet-handle-hidden'
    />
  );
};
