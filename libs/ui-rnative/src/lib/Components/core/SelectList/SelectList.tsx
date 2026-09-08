import {
  createSafeContext,
  useDisabledContext,
  DisabledProvider,
} from '@ledgerhq/lumen-utils-shared';
import { Fragment, type ReactElement, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { useControllableState } from '../../../utils/useControllableState';
import { Box, Pressable, Text } from '../../primitives';
import { Check, ChevronDown } from '../../symbols';
import { Divider } from '../Divider';
import { SearchInput } from '../SearchInput';
import type {
  MetaShape,
  SelectListContextValue,
  SelectListItemData,
  SelectListProps,
  SelectListContentProps,
  SelectListItemProps,
  SelectListItemLeadingProps,
  SelectListItemTextProps,
  SelectListItemDescriptionProps,
  SelectListItemContentProps,
  SelectListItemContentRowProps,
  SelectListEmptyStateProps,
  SelectListSearchProps,
  SelectListTriggerProps,
  SelectListLabelProps,
  SelectListValue,
} from './types';
import { useSelectListItems } from './useSelectList/useSelectListItems';

const [SelectListProvider, useSelectListContext] =
  createSafeContext<SelectListContextValue>('SelectList');

export const SelectList = <
  T extends SelectListValue = SelectListValue,
  TMeta extends MetaShape = MetaShape,
>({
  items,
  value,
  defaultValue,
  onValueChange,
  disabled: disabledProp,
  filter,
  filteredItems,
  searchValue,
  defaultSearchValue,
  onSearchValueChange,
  children,
}: SelectListProps<T, TMeta>) => {
  const disabled = useDisabledContext({
    consumerName: 'SelectList',
    mergeWith: { disabled: disabledProp },
  });

  const [selectedValue, setSelectedValue] = useControllableState<string | null>(
    {
      prop: value,
      defaultProp: defaultValue ?? null,
      onChange: (next: string | null) => onValueChange?.(next as T | null),
    },
  );

  const {
    isGrouped,
    groups,
    flatItems,
    resolvedSearchValue,
    handleSearchValueChange,
  } = useSelectListItems<T, TMeta>({
    items,
    filter,
    filteredItems,
    searchValue,
    defaultSearchValue,
    onSearchValueChange,
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <SelectListProvider
        value={{
          selectedValue,
          onValueChange: setSelectedValue,
          isGrouped,
          groups,
          flatItems,
          resolvedSearchValue,
          handleSearchValueChange,
        }}
      >
        {children}
      </SelectListProvider>
    </DisabledProvider>
  );
};

export const SelectListContent = <
  T extends SelectListValue = SelectListValue,
  TMeta extends MetaShape = MetaShape,
>({
  renderItem,
  lx,
  style,
  ref,
  ...props
}: SelectListContentProps<T, TMeta>) => {
  const { selectedValue, isGrouped, groups, flatItems } = useSelectListContext({
    consumerName: 'SelectListContent',
    contextRequired: true,
  });

  const renderItemWithState = (item: SelectListItemData) =>
    renderItem(
      item as SelectListItemData<T, TMeta>,
      selectedValue === item.value,
    );

  if (isGrouped) {
    return (
      <Box lx={lx} style={style} ref={ref} {...props}>
        {groups.map((group, groupIndex) => (
          <Fragment key={group.label}>
            {groupIndex > 0 && (
              <Divider lx={{ marginVertical: 's4', marginHorizontal: 's8' }} />
            )}
            {group.label && <SelectListLabel>{group.label}</SelectListLabel>}
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

const useItemStyles = ({
  disabled,
  pressed,
}: {
  disabled: boolean;
  pressed: boolean;
}) => {
  return useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: t.sizes.s40,
        padding: t.spacings.s8,
        gap: t.spacings.s12,
        borderRadius: t.borderRadius.md,
        backgroundColor: pressed
          ? t.colors.bg.baseTransparentPressed
          : t.colors.bg.baseTransparent,
        opacity: disabled ? 0.5 : 1,
      },
    }),
    [disabled, pressed],
  );
};

export const SelectListItem = <T extends SelectListValue = SelectListValue>({
  value,
  disabled: disabledProp = false,
  children,
  lx,
  style,
  ref,
  ...props
}: SelectListItemProps<T>) => {
  const { selectedValue, onValueChange } = useSelectListContext({
    consumerName: 'SelectListItem',
    contextRequired: true,
  });
  const disabled = useDisabledContext({
    consumerName: 'SelectListItem',
    mergeWith: { disabled: disabledProp },
  });
  const selected = selectedValue === value;

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
          <SelectListItemInner pressed={pressed} selected={selected}>
            {children}
          </SelectListItemInner>
        )}
      </Pressable>
    </DisabledProvider>
  );
};

const SelectListItemInner = ({
  pressed,
  selected,
  children,
}: {
  pressed: boolean;
  selected: boolean;
  children: ReactNode;
}) => {
  const disabled = useDisabledContext({
    consumerName: 'SelectListItemInner',
    contextRequired: false,
  });
  const styles = useItemStyles({ disabled, pressed });

  return (
    <View style={styles.container}>
      {children}
      {selected && <Check size={24} color='active' />}
    </View>
  );
};

export const SelectListItemText = ({
  children,
  lx,
  style,
  ref,
  ...props
}: SelectListItemTextProps) => {
  const disabled = useDisabledContext({
    consumerName: 'SelectListItemText',
    contextRequired: false,
  });

  const styles = useStyleSheet(
    (t) => ({
      text: StyleSheet.flatten([
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
      style={StyleSheet.flatten([styles.text, style])}
      numberOfLines={1}
      {...props}
    >
      {children}
    </Text>
  );
};

export const SelectListItemDescription = ({
  children,
  lx,
  style,
  ref,
  ...props
}: SelectListItemDescriptionProps) => {
  const disabled = useDisabledContext({
    consumerName: 'SelectListItemDescription',
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

export const SelectListItemContent = ({
  children,
  lx,
  style,
  ref,
  ...props
}: SelectListItemContentProps) => {
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

export const SelectListItemContentRow = ({
  children,
  lx,
  style,
  ref,
  ...props
}: SelectListItemContentRowProps) => {
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

export const SelectListItemLeading = ({
  children,
  lx,
  style,
  ref,
  ...props
}: SelectListItemLeadingProps) => {
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

const SelectListLabel = ({ children }: SelectListLabelProps) => (
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

export const SelectListSearch = ({ ref, ...props }: SelectListSearchProps) => {
  const { resolvedSearchValue, handleSearchValueChange } = useSelectListContext(
    {
      consumerName: 'SelectListSearch',
      contextRequired: true,
    },
  );

  return (
    <SearchInput
      ref={ref}
      value={resolvedSearchValue}
      onChangeText={handleSearchValueChange}
      lx={{ paddingBottom: 's8' }}
      {...props}
    />
  );
};

export const SelectListEmptyState = ({
  title,
  description,
  lx,
  style,
  ref,
  ...props
}: SelectListEmptyStateProps) => {
  const { isGrouped, groups, flatItems } = useSelectListContext({
    consumerName: 'SelectListEmptyState',
    contextRequired: true,
  });
  const visibleCount = isGrouped
    ? groups.reduce((acc, g) => acc + g.items.length, 0)
    : flatItems.length;

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

  if (visibleCount > 0) {
    return null;
  }

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

export const SelectListTrigger = ({
  label,
  onPress,
  disabled: disabledProp,
  children,
  lx,
  style,
  ref,
  ...props
}: SelectListTriggerProps) => {
  const disabled = useDisabledContext({
    consumerName: 'SelectListTrigger',
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

export function createSelectList<
  T extends SelectListValue = never,
  TMeta extends MetaShape = MetaShape,
>(): {
  SelectList: (props: SelectListProps<T, TMeta>) => ReactElement;
  SelectListContent: (props: SelectListContentProps<T, TMeta>) => ReactElement;
  SelectListItem: (props: SelectListItemProps<T>) => ReactElement;
  SelectListItemText: (props: SelectListItemTextProps) => ReactElement;
  SelectListItemDescription: (
    props: SelectListItemDescriptionProps,
  ) => ReactElement;
  SelectListItemContent: (props: SelectListItemContentProps) => ReactElement;
  SelectListItemContentRow: (
    props: SelectListItemContentRowProps,
  ) => ReactElement;
  SelectListItemLeading: (props: SelectListItemLeadingProps) => ReactElement;
  SelectListSearch: (props: SelectListSearchProps) => ReactElement;
  SelectListEmptyState: (
    props: SelectListEmptyStateProps,
  ) => ReactElement | null;
  SelectListTrigger: (props: SelectListTriggerProps) => ReactElement;
} {
  return {
    SelectList,
    SelectListContent,
    SelectListItem,
    SelectListItemText,
    SelectListItemDescription,
    SelectListItemContent,
    SelectListItemContentRow,
    SelectListItemLeading,
    SelectListSearch,
    SelectListEmptyState,
    SelectListTrigger,
  };
}
