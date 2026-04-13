import {
  createSafeContext,
  useDisabledContext,
  DisabledProvider,
} from '@ledgerhq/lumen-utils-shared';
import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Check, ChevronDown } from '../../Symbols';
import { useControllableState } from '../../utils/useControllableState';
import { Divider } from '../Divider';
import { Box, Pressable, Text } from '../Utility';
import type {
  OptionListContextValue,
  OptionListItemData,
  OptionListProps,
  OptionListContentProps,
  OptionListItemProps,
  OptionListItemLeadingProps,
  OptionListItemTitleProps,
  OptionListItemDescriptionProps,
  OptionListItemContentProps,
  OptionListItemContentRowProps,
  OptionListEmptyStateProps,
  OptionListTriggerProps,
  OptionListLabelProps,
} from './types';
import { useOptionListItems } from './useOptionList/useOptionListItems';

const [OptionListProvider, useOptionListContext] =
  createSafeContext<OptionListContextValue>('OptionList');

export const OptionList = ({
  items,
  value,
  defaultValue,
  onValueChange,
  disabled: disabledProp,
  children,
}: OptionListProps) => {
  const disabled = useDisabledContext({
    consumerName: 'OptionList',
    mergeWith: { disabled: disabledProp },
  });

  const [selectedValue, setSelectedValue] = useControllableState<string | null>(
    {
      prop: value,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange,
    },
  );

  const { isGrouped, groups, flatItems } = useOptionListItems({ items });

  return (
    <DisabledProvider value={{ disabled }}>
      <OptionListProvider
        value={{
          selectedValue,
          onValueChange: setSelectedValue,
          isGrouped,
          groups,
          flatItems,
        }}
      >
        {children}
      </OptionListProvider>
    </DisabledProvider>
  );
};

export const OptionListContent = ({
  renderItem,
  lx,
  style,
  ref,
  ...props
}: OptionListContentProps) => {
  const { selectedValue, isGrouped, groups, flatItems } = useOptionListContext({
    consumerName: 'OptionListContent',
    contextRequired: true,
  });

  const renderItemWithState = (item: OptionListItemData) =>
    renderItem(item, {
      selected: selectedValue === item.value,
      disabled: item.disabled ?? false,
    });

  if (isGrouped) {
    return (
      <Box lx={lx} style={style} ref={ref} {...props}>
        {groups.map((group, groupIndex) => (
          <Fragment key={group.label}>
            {groupIndex > 0 && (
              <Divider lx={{ marginVertical: 's4', marginHorizontal: 's8' }} />
            )}
            {group.label && <OptionListLabel>{group.label}</OptionListLabel>}
            {group.items.map((item) => (
              <Fragment key={item.value}>{renderItemWithState(item)}</Fragment>
            ))}
          </Fragment>
        ))}
      </Box>
    );
  }

  return (
    <Box lx={lx} style={style} ref={ref} {...props}>
      {flatItems.map((item) => (
        <Fragment key={item.value}>{renderItemWithState(item)}</Fragment>
      ))}
    </Box>
  );
};

const useItemStyles = () => {
  return useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: t.sizes.s40,
        padding: t.spacings.s8,
        gap: t.spacings.s12,
        borderRadius: t.borderRadius.md,
        backgroundColor: t.colors.bg.baseTransparent,
      },
      containerPressed: {
        backgroundColor: t.colors.bg.baseTransparentPressed,
      },
      containerDisabled: {
        opacity: 0.5,
      },
    }),
    [],
  );
};

export const OptionListItem = ({
  value,
  disabled: disabledProp = false,
  children,
  lx,
  style,
  ref,
  ...props
}: OptionListItemProps) => {
  const { selectedValue, onValueChange } = useOptionListContext({
    consumerName: 'OptionListItem',
    contextRequired: true,
  });
  const disabled = useDisabledContext({
    consumerName: 'OptionListItem',
    mergeWith: { disabled: disabledProp },
  });
  const selected = selectedValue === value;
  const styles = useItemStyles();

  return (
    <DisabledProvider value={{ disabled }}>
      <Pressable
        ref={ref}
        lx={lx}
        style={style}
        onPress={() => onValueChange(value)}
        disabled={disabled}
        accessibilityRole='radio'
        accessibilityState={{ disabled, selected }}
        {...props}
      >
        {({ pressed }) => (
          <View
            style={[
              styles.container,
              pressed && styles.containerPressed,
              disabled && styles.containerDisabled,
            ]}
          >
            {children}
            {selected && <Check size={24} color='active' />}
          </View>
        )}
      </Pressable>
    </DisabledProvider>
  );
};

export const OptionListItemTitle = ({
  children,
  lx,
  style,
  ref,
  ...props
}: OptionListItemTitleProps) => {
  const disabled = useDisabledContext({
    consumerName: 'OptionListItemTitle',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      title: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          color: disabled ? t.colors.text.disabled : t.colors.text.base,
        },
      ]),
    }),
    [disabled],
  );

  return (
    <Text
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.title, style])}
      numberOfLines={1}
      {...props}
    >
      {children}
    </Text>
  );
};

export const OptionListItemDescription = ({
  children,
  lx,
  style,
  ref,
  ...props
}: OptionListItemDescriptionProps) => {
  const disabled = useDisabledContext({
    consumerName: 'OptionListItemDescription',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      description: StyleSheet.flatten([
        t.typographies.body3,
        {
          color: disabled ? t.colors.text.disabled : t.colors.text.muted,
        },
      ]),
    }),
    [disabled],
  );

  return (
    <Text
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.description, style])}
      numberOfLines={1}
      {...props}
    >
      {children}
    </Text>
  );
};

export const OptionListItemContent = ({
  children,
  lx,
  style,
  ref,
  ...props
}: OptionListItemContentProps) => {
  const styles = useStyleSheet(
    (t) => ({
      content: {
        flex: 1,
        minWidth: 0,
        gap: t.spacings.s4,
      },
    }),
    [],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.content, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

export const OptionListItemContentRow = ({
  children,
  lx,
  style,
  ref,
  ...props
}: OptionListItemContentRowProps) => {
  const styles = useStyleSheet(
    (t) => ({
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
        gap: t.spacings.s8,
      },
    }),
    [],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.row, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

export const OptionListItemLeading = ({
  children,
  lx,
  style,
  ref,
  ...props
}: OptionListItemLeadingProps) => {
  const styles = useStyleSheet(
    () => ({
      leading: {
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
      },
    }),
    [],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.leading, style])}
      {...props}
    >
      {children}
    </Box>
  );
};

const OptionListLabel = ({ children }: OptionListLabelProps) => (
  <Text
    lx={{
      color: 'muted',
      paddingHorizontal: 's8',
      paddingTop: 's8',
      marginBottom: 's4',
    }}
  >
    {children}
  </Text>
);

export const OptionListEmptyState = ({
  title,
  description,
  lx,
  style,
  ref,
  ...props
}: OptionListEmptyStateProps) => {
  const { flatItems } = useOptionListContext({
    consumerName: 'OptionListEmptyState',
    contextRequired: true,
  });

  const styles = useStyleSheet(
    (t) => ({
      container: {
        width: '100%',
        alignItems: 'center',
        gap: t.spacings.s8,
        paddingVertical: t.spacings.s24,
      },
      title: StyleSheet.flatten([
        t.typographies.heading4SemiBold,
        { color: t.colors.text.base },
      ]),
      description: StyleSheet.flatten([
        t.typographies.body2,
        { color: t.colors.text.muted },
      ]),
    }),
    [],
  );

  if (flatItems.length > 0) return null;

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.container, style])}
      {...props}
    >
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </Box>
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
}) =>
  useStyleSheet(
    (t) => ({
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
        disabled && { opacity: 0.5 },
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
          ? { top: t.spacings.s6, ...t.typographies.body4 }
          : { top: t.spacings.s14, ...t.typographies.body2 },
        disabled && { color: t.colors.text.disabled },
      ]),
      contentWrapper: StyleSheet.flatten([
        { flex: 1 },
        hasLabel &&
          hasValue && {
            paddingTop: t.spacings.s16,
            paddingBottom: t.spacings.s2,
          },
        hasLabel && !hasValue && { paddingVertical: 0 },
      ]),
      chevron: StyleSheet.flatten([
        {
          flexShrink: 0,
          color: t.colors.text.muted,
          marginLeft: t.spacings.s8,
        },
        disabled && { color: t.colors.text.disabled },
      ]),
    }),
    [disabled, hasValue, hasLabel],
  );

export const OptionListTrigger = ({
  label,
  onPress,
  disabled: disabledProp,
  children,
  lx,
  style,
  ref,
  ...props
}: OptionListTriggerProps) => {
  const disabled = useDisabledContext({
    consumerName: 'OptionListTrigger',
    mergeWith: { disabled: disabledProp },
  });

  const hasValue = children != null && children !== false;
  const styles = useTriggerStyles({
    disabled,
    hasValue,
    hasLabel: !!label,
  });

  return (
    <Pressable
      ref={ref}
      lx={lx}
      style={[styles.trigger, style]}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole='button'
      {...props}
    >
      {label && (
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      )}
      <View style={styles.contentWrapper}>{children}</View>
      <ChevronDown size={20} style={styles.chevron} />
    </Pressable>
  );
};
