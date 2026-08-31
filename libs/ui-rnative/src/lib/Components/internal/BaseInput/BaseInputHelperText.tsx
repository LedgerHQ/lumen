import type { TextStyle, ViewStyle } from 'react-native';
import { Text, View } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { CheckmarkCircleFill } from '../../symbols/icons/CheckmarkCircleFill';
import { DeleteCircleFill } from '../../symbols/icons/DeleteCircleFill';
import { InformationFill } from '../../symbols/icons/InformationFill';
import type { BaseInputHelperTextProps, BaseInputProps } from './types';

const useHelperTextStyles = ({
  status,
}: {
  status: BaseInputProps['status'];
}): { helperContainer: ViewStyle; helperText: TextStyle } => {
  return useStyleSheet(
    (t) => ({
      helperContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: t.spacings.s2,
      },
      helperText: {
        ...t.typographies.body3,
        flex: 1,
        color: {
          error: t.colors.text.error,
          success: t.colors.text.success,
          default: t.colors.text.muted,
        }[status ?? 'default'],
      },
    }),
    [status],
  );
};

/**
 * Hint, error or success copy rendered below the control inside `BaseInput`.
 *
 * @internal
 */
export const BaseInputHelperText = ({
  helperText,
  status,
}: BaseInputHelperTextProps) => {
  const styles = useHelperTextStyles({ status });

  return (
    <View style={styles.helperContainer}>
      {!status && <InformationFill size={16} color='muted' />}
      {status === 'error' && <DeleteCircleFill size={16} color='error' />}
      {status === 'success' && (
        <CheckmarkCircleFill size={16} color='success' />
      )}
      <Text style={styles.helperText}>{helperText}</Text>
    </View>
  );
};
