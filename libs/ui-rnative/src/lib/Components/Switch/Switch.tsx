import { useControllableState } from '../../utils';
import { Pressable } from '../Utility';
import { BaseSwitchThumb, BaseSwitchRoot } from './BaseSwitch';

import { SwitchProps } from './types';

/**
 * The switch follows the design system tokens and supports checked, unchecked,
 * disabled, and focus states with proper active interactions.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_selection-switch--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_selection-switch--docs#dos-and-donts Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the switch's core appearance.
 *
 * @example
 * import { Switch } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic controlled switch
 * const [checked, setChecked] = useState(false);
 * <Switch
 *   checked={checked}
 *   onCheckedChange={setChecked}
 * />
 *
 * // Uncontrolled switch with default state
 * <Switch defaultChecked={true} onCheckedChange={handleChange} />
 */
export const Switch = ({
  lx,
  style,
  checked: checkedProp,
  onCheckedChange: onCheckedChangeProp,
  defaultChecked = false,
  disabled,
  size = 'md',
  ref,
  ...props
}: SwitchProps) => {
  const [checked, onCheckedChange] = useControllableState({
    prop: checkedProp,
    onChange: onCheckedChangeProp,
    defaultProp: defaultChecked,
  });

  return (
    <Pressable ref={ref} lx={lx} style={style} {...props}>
      <BaseSwitchRoot
        disabled={disabled}
        checked={checked}
        onCheckedChange={onCheckedChange}
        size={size}
      >
        <BaseSwitchThumb />
      </BaseSwitchRoot>
    </Pressable>
  );
};

Switch.displayName = 'Switch';
