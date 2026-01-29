import React, { useState, useEffect, useCallback, useId } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { ChevronDown } from '../../Symbols';
import { useControllableState, extractTextFromChildren } from '../../utils';
import { SlotPressable } from '../Slot';
import { Box, Pressable, Text } from '../Utility';
import { useSelectActions } from './GlobalSelectContext';
import { SelectContextProvider, useSelectSafeContext } from './SelectContext';
import type {
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectItemProps,
  SelectItemTextProps,
  SelectSeparatorProps,
  SelectContentItem,
} from './types';

/**
 * The root component that manages a select's state.
 *
 * This component coordinates between the trigger, content, and items.
 * It works with GlobalSelectProvider to display options in a bottom sheet.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-select-overview--docs Storybook}
 *
 * @example
 * import { Select, SelectTrigger, SelectContent, SelectItem, SelectItemText } from '@ledgerhq/lumen-ui-rnative';
 *
 * function App() {
 *   const [value, setValue] = useState('option1');
 *   return (
 *     <Select value={value} onValueChange={setValue}>
 *       <SelectTrigger label="Choose option">
 *         <SelectValue />
 *       </SelectTrigger>
 *       <SelectContent>
 *         <SelectItem value="option1">
 *           <SelectItemText>Option 1</SelectItemText>
 *         </SelectItem>
 *         <SelectItem value="option2">
 *           <SelectItemText>Option 2</SelectItemText>
 *         </SelectItem>
 *       </SelectContent>
 *     </Select>
 *   );
 * }
 */
export const Select = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled = false,
}: SelectProps) => {
  const selectId = useId();

  const [internalOpen, setInternalOpen] = useControllableState({
    prop: controlledOpen,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const [internalValue, setInternalValue] = useControllableState<
    SelectProps['value']
  >({
    prop: controlledValue,
    defaultProp: defaultValue ?? undefined,
    onChange: (value: SelectProps['value']) => {
      if (value !== undefined) {
        onValueChange?.(value);
      }
    },
  });

  const [items, setItems] = useState<SelectContentItem[]>([]);

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!disabled) {
        setInternalOpen?.(newOpen);
      }
    },
    [setInternalOpen, disabled],
  );

  const handleValueChange = useCallback(
    (newValue: string) => {
      setInternalValue?.(newValue);
    },
    [setInternalValue],
  );

  return (
    <SelectContextProvider
      selectId={selectId}
      open={internalOpen ?? false}
      setOpen={setOpen}
      value={internalValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      items={items}
      setItems={setItems}
    >
      {children}
    </SelectContextProvider>
  );
};
Select.displayName = 'Select';

export const SelectTrigger = ({
  children,
  lx,
  style,
  label,
  asChild = false,
  disabled: triggerDisabled,
  ...props
}: SelectTriggerProps) => {
  const {
    selectId,
    setOpen,
    items,
    value,
    disabled: contextDisabled,
    label: contextLabel,
    onValueChange,
  } = useSelectSafeContext({
    consumerName: 'SelectTrigger',
    contextRequired: true,
  });

  const { showSelect } = useSelectActions();
  const disabled = triggerDisabled ?? contextDisabled;
  const finalLabel = label ?? contextLabel;

  const handlePress = useCallback((): void => {
    if (!disabled && items.length > 0) {
      setOpen(true);
      showSelect({
        id: selectId,
        items,
        selectedValue: value,
        onSelectValue: onValueChange,
        setOpen,
        label: finalLabel,
      });
    }
  }, [
    disabled,
    items,
    selectId,
    value,
    setOpen,
    showSelect,
    finalLabel,
    onValueChange,
  ]);

  const hasValue = value !== undefined && value !== '';
  const styles = useTriggerStyles({
    disabled: !!disabled,
    hasValue,
    hasLabel: !!finalLabel,
  });

  const Comp = asChild ? SlotPressable : Pressable;

  return (
    <Comp
      lx={lx}
      style={[styles.trigger, style]}
      disabled={disabled}
      onPress={handlePress}
      {...props}
    >
      {finalLabel && (
        <Text style={styles.label} numberOfLines={1}>
          {finalLabel}
        </Text>
      )}
      <View style={styles.contentWrapper}>{children}</View>
      <ChevronDown size={20} style={styles.chevron} />
    </Comp>
  );
};

const useTriggerStyles = ({
  disabled,
  hasValue,
  hasLabel,
}: {
  disabled: boolean;
  hasValue: boolean;
  hasLabel: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      return {
        trigger: StyleSheet.flatten([
          {
            position: 'relative',
            width: t.sizes.full,
            height: t.sizes.s48,
            backgroundColor: t.colors.bg.muted,
            borderRadius: t.borderRadius.sm,
            paddingHorizontal: t.spacings.s16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          disabled && {
            opacity: 0.5,
          },
        ]),
        label: StyleSheet.flatten([
          t.typographies.body2,
          {
            position: 'absolute',
            left: t.spacings.s16,
            color: t.colors.text.muted,
            width: '100%',
          },
          hasValue
            ? {
                top: t.spacings.s6,
                ...t.typographies.body4,
              }
            : {
                top: t.spacings.s14,
                ...t.typographies.body2,
              },
          disabled && {
            color: t.colors.text.disabled,
          },
        ]),
        contentWrapper: StyleSheet.flatten([
          {
            flex: 1,
          },
          hasLabel &&
            hasValue && {
              paddingTop: t.spacings.s16,
              paddingBottom: t.spacings.s2,
            },
          hasLabel &&
            !hasValue && {
              paddingVertical: 0,
            },
        ]),
        chevron: StyleSheet.flatten([
          {
            flexShrink: 0,
            color: t.colors.text.muted,
            marginLeft: t.spacings.s8,
          },
          disabled && {
            color: t.colors.text.disabled,
          },
        ]),
      };
    },
    [disabled, hasValue, hasLabel],
  );
};

SelectTrigger.displayName = 'SelectTrigger';

/**
 * Displays the current selected value
 */
export const SelectValue = () => {
  const { value, items } = useSelectSafeContext({
    consumerName: 'SelectValue',
    contextRequired: true,
  });

  const styles = useStyleSheet(
    (t) => ({
      text: StyleSheet.flatten([
        t.typographies.body2,
        {
          color: t.colors.text.base,
          textAlign: 'left',
        },
      ]),
    }),
    [],
  );

  const selectedItem = items.find(
    (item) => item.type === 'item' && item.value === value,
  );

  if (!selectedItem || selectedItem.type !== 'item') {
    return null;
  }

  return (
    <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>
      {selectedItem.label}
    </Text>
  );
};
SelectValue.displayName = 'SelectValue';

/**
 * Container for select items. This component collects all items
 * and makes them available to the bottom sheet.
 */
export const SelectContent = ({ children }: SelectContentProps) => {
  const { setItems } = useSelectSafeContext({
    consumerName: 'SelectContent',
    contextRequired: true,
  });

  useEffect(() => {
    const items: SelectContentItem[] = [];

    const extractItems = (child: React.ReactNode): void => {
      React.Children.forEach(child, (element) => {
        if (!React.isValidElement(element)) return;

        if (element.type === SelectItem) {
          const props = element.props as SelectItemProps;
          const textValue =
            props.textValue ??
            extractTextFromChildren(props.children, SelectItemText);
          items.push({
            type: 'item',
            value: props.value,
            label: textValue,
            disabled: props.disabled,
          });
        } else if (element.type === SelectGroup) {
          const groupElement = element as React.ReactElement<{
            children?: React.ReactNode;
          }>;
          extractItems(groupElement.props.children);
        } else if (element.type === SelectLabel) {
          const labelElement = element as React.ReactElement<{
            children?: React.ReactNode;
          }>;
          const labelText = extractTextFromChildren(
            labelElement.props.children,
            SelectItemText,
          );
          items.push({
            type: 'group-label',
            label: labelText,
          });
        } else if (element.type === SelectSeparator) {
          items.push({
            type: 'separator',
          });
        } else if (
          React.isValidElement<{ children?: React.ReactNode }>(element) &&
          element.props.children
        ) {
          extractItems(element.props.children);
        }
      });
    };

    extractItems(children);
    setItems(items);
  }, [children, setItems]);

  return null;
};
SelectContent.displayName = 'SelectContent';

export const SelectGroup = ({
  children,
  lx,
  style,
  ...props
}: SelectGroupProps) => {
  const styles = useStyleSheet(
    (t) => ({
      group: {
        width: t.sizes.full,
        gap: t.spacings.s4,
      },
    }),
    [],
  );

  return (
    <Box lx={lx} style={[styles.group, style]} {...props}>
      {children}
    </Box>
  );
};
SelectGroup.displayName = 'SelectGroup';

export const SelectLabel = ({
  children,
  lx,
  style,
  ...props
}: SelectLabelProps) => {
  const styles = useStyleSheet(
    (t) => ({
      label: StyleSheet.flatten([
        t.typographies.body3SemiBold,
        {
          paddingHorizontal: t.spacings.s8,
          paddingBottom: 0,
          paddingTop: t.spacings.s8,
          color: t.colors.text.muted,
          marginBottom: t.spacings.s4,
        },
      ]),
    }),
    [],
  );

  return (
    <Text lx={lx} style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
};
SelectLabel.displayName = 'SelectLabel';

/**
 * Individual select item. Note: The actual rendering happens in GlobalSelectBottomSheet.
 * This component is used to declare the structure and collect item data.
 */
export const SelectItem = (_props: SelectItemProps) => {
  // This component doesn't render anything - it's used for structure
  // The actual items are rendered in GlobalSelectBottomSheet
  return null;
};
SelectItem.displayName = 'SelectItem';

export const SelectItemText = ({
  children,
  lx,
  style,
  ...props
}: SelectItemTextProps) => {
  const styles = useStyleSheet(
    (t) => ({
      text: StyleSheet.flatten([
        t.typographies.body2,
        {
          color: t.colors.text.base,
        },
      ]),
    }),
    [],
  );

  return (
    <Text lx={lx} style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};
SelectItemText.displayName = 'SelectItemText';

export const SelectSeparator = (_props: SelectSeparatorProps) => {
  // This component doesn't render anything - it's used for structure
  // The actual separators are rendered in GlobalSelectBottomSheet
  return null;
};
SelectSeparator.displayName = 'SelectSeparator';
