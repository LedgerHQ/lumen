import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useStyleSheet } from '../../../styles';
import { Text } from '../Utility';
import type { LabelProps } from './types';

const useStyles = ({ disabled }: { disabled: boolean }) => {
  return useStyleSheet(
    (t) => ({
      label: {
        color: disabled ? t.colors.text.disabled : t.colors.text.base,
        ...t.typographies.body2,
      },
    }),
    [disabled],
  );
};

/**
 * A label that should be used to describe a form field.
 *
 * Either choices fields like checkbox, switch or radio.
 * Or text fields like input, textarea, select, etc.
 */
export const Label = ({
  style,
  lx = {},
  disabled: disabledProp = false,
  children,
  onPress,
  onLongPress,
  ref,
  ...props
}: LabelProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Label',
    mergeWith: { disabled: disabledProp },
  });
  const styles = useStyles({ disabled: !!disabled });

  return (
    <Text
      lx={lx}
      ref={ref}
      style={[styles.label, style]}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      onLongPress={disabled ? undefined : onLongPress}
      {...props}
    >
      {children}
    </Text>
  );
};
