import { useStyleSheet } from '../../../styles';
import { Check } from '../../Symbols';
import { useControllableState } from '../../utils';
import { Label } from '../Label';
import { Box } from '../Utility';
import { BaseCheckboxIndicator, BaseCheckboxRoot } from './BaseCheckbox';

import { CheckboxProps } from './types';

/**
 * The checkbox follows the design system tokens and supports checked, unchecked,
 * disabled, and focus states with proper hover and active interactions.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_selection-checkbox--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_selection-checkbox--docs#dos-and-donts Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the checkbox's core appearance.
 *
 * @example
 * import { Checkbox } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic controlled checkbox
 * const [checked, setChecked] = useState(false);
 * <Checkbox
 *   label="My label"
 *   checked={checked}
 *   onCheckedChange={setChecked}
 * />
 *
 * // Uncontrolled checkbox with default state
 * <Checkbox defaultChecked={true} onCheckedChange={handleChange} />
 */
export const Checkbox = ({
  lx,
  style,
  checked: checkedProp,
  onCheckedChange: onCheckedChangeProp,
  defaultChecked = false,
  disabled = false,
  label,
  ref,
  ...props
}: CheckboxProps) => {
  const [checked, onCheckedChange] = useControllableState({
    prop: checkedProp,
    onChange: onCheckedChangeProp,
    defaultProp: defaultChecked,
  });

  const styles = useStyles({ disabled });

  return (
    <Box ref={ref} lx={lx} style={[styles.root, style]} {...props}>
      <BaseCheckboxRoot
        disabled={disabled}
        checked={checked}
        onCheckedChange={onCheckedChange}
      >
        <BaseCheckboxIndicator>
          <Check size={16} style={styles.icon} />
        </BaseCheckboxIndicator>
      </BaseCheckboxRoot>
      {label && (
        <Label disabled={disabled} onPress={() => onCheckedChange(!checked)}>
          {label}
        </Label>
      )}
    </Box>
  );
};

const useStyles = ({ disabled }: { disabled: boolean }) => {
  return useStyleSheet(
    (t) => {
      return {
        root: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: t.spacings.s8,
        },
        icon: {
          flexShrink: 0,
          color: disabled ? t.colors.text.disabled : t.colors.text.black,
        },
      };
    },
    [disabled],
  );
};

Checkbox.displayName = 'Checkbox';
