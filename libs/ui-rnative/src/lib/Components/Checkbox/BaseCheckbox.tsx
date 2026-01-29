import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { useCallback } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  View,
  StyleSheet,
} from 'react-native';
import { useStyleSheet } from '../../../styles';
import {
  ForceMountable,
  SlottablePressableProps,
  SlottableViewProps,
} from '../../types';
import { SlotPressable, SlotView } from '../Slot';
import { CheckboxProps } from './types';

const ROOT_COMPONENT_NAME = 'BaseCheckbox';
const TRIGGER_COMPONENT_NAME = 'BaseCheckboxTrigger';
const INDICATOR_COMPONENT_NAME = 'BaseCheckboxIndicator';

type BaseCheckboxRootProps = SlottablePressableProps & {
  checked?: CheckboxProps['checked'];
  onCheckedChange?: CheckboxProps['onCheckedChange'];
  disabled?: CheckboxProps['disabled'];
  nativeID?: CheckboxProps['nativeID'];
};

const [BaseCheckboxProvider, useBaseCheckboxContext] =
  createSafeContext<BaseCheckboxRootProps>(ROOT_COMPONENT_NAME);

const BaseCheckboxRoot = ({
  disabled = false,
  checked,
  onCheckedChange,
  nativeID,
  ref,
  ...props
}: BaseCheckboxRootProps) => {
  return (
    <BaseCheckboxProvider
      value={{
        disabled,
        checked,
        onCheckedChange,
        nativeID,
      }}
    >
      <BaseCheckboxTrigger ref={ref} {...props} />
    </BaseCheckboxProvider>
  );
};
BaseCheckboxRoot.displayName = ROOT_COMPONENT_NAME;

const BaseCheckboxTrigger = ({
  asChild,
  onPress: onPressProp,
  ref,
  ...props
}: SlottablePressableProps) => {
  const { disabled, checked, onCheckedChange, nativeID } =
    useBaseCheckboxContext({
      consumerName: TRIGGER_COMPONENT_NAME,
      contextRequired: true,
    });

  const styles = useStyles({ checked: !!checked, disabled: !!disabled });

  const onPress = useCallback(
    (ev: GestureResponderEvent) => {
      if (disabled) return;
      const newValue = !checked;
      onCheckedChange?.(newValue);
      onPressProp?.(ev);
    },
    [disabled, checked, onCheckedChange, onPressProp],
  );

  const Component = asChild ? SlotPressable : Pressable;
  return (
    <Component
      ref={ref}
      nativeID={nativeID}
      aria-disabled={disabled}
      role='checkbox'
      aria-checked={checked}
      onPress={onPress}
      style={styles.trigger}
      accessibilityState={{
        checked,
        disabled,
      }}
      disabled={disabled}
      {...props}
    />
  );
};
BaseCheckboxTrigger.displayName = TRIGGER_COMPONENT_NAME;

type BaseCheckboxIndicatorProps = ForceMountable & SlottableViewProps;
const BaseCheckboxIndicator = ({
  asChild,
  forceMount,
  ref,
  ...props
}: BaseCheckboxIndicatorProps) => {
  const { checked, disabled } = useBaseCheckboxContext({
    consumerName: INDICATOR_COMPONENT_NAME,
    contextRequired: true,
  });

  const styles = useStyles({ checked: !!checked, disabled: !!disabled });

  if (!forceMount) {
    if (!checked) {
      return null;
    }
  }

  const Component = asChild ? SlotView : View;

  return (
    <Component
      ref={ref}
      style={styles.indicator}
      aria-disabled={disabled}
      aria-hidden={!(forceMount || checked)}
      role={'presentation'}
      {...props}
    />
  );
};

const useStyles = ({
  checked,
  disabled,
}: {
  checked: boolean;
  disabled: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      return {
        trigger: StyleSheet.flatten([
          {
            width: t.sizes.s20,
            height: t.sizes.s20,
            flexShrink: 0,
            borderRadius: t.borderRadius.xs,
          },
          !checked && {
            borderWidth: t.borderWidth.s1,
          },
          checked &&
            !disabled && {
              backgroundColor: t.colors.bg.active,
              color: t.colors.text.onAccent,
            },
          !checked &&
            !disabled && {
              borderColor: t.colors.border.muted,
              backgroundColor: t.colors.bg.base,
            },
          checked &&
            disabled && {
              backgroundColor: t.colors.bg.disabled,
              color: t.colors.text.disabled,
            },
          !checked &&
            disabled && {
              borderColor: t.colors.border.disabled,
              backgroundColor: t.colors.bg.base,
            },
        ]),
        indicator: {
          flex: 1,
          width: t.sizes.full,
          height: t.sizes.full,
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    },
    [checked, disabled],
  );
};

BaseCheckboxIndicator.displayName = INDICATOR_COMPONENT_NAME;

export { BaseCheckboxIndicator, BaseCheckboxRoot, type BaseCheckboxRootProps };
