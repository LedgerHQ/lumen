import { BottomSheetVariables } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { Ref } from 'react';
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
        backgroundColor: t.colors.bg.canvasSheet,
      },
      handle: {
        height: t.spacings.s4,
        width: t.sizes.s36,
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedPressed,
      },
    }),
    [],
  );
};

export const CustomHandle = ({
  ref,
  ...props
}: BottomSheetVariables & { ref?: Ref<React.ElementRef<typeof View>> }) => {
  const styles = useStyles();

  return (
    <View {...props} ref={ref} style={styles.container}>
      <View style={styles.handle} />
    </View>
  );
};
CustomHandle.displayName = 'CustomHandle';
