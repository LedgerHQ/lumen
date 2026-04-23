import { Combobox } from '@base-ui/react/combobox';
import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useLayoutEffect } from 'react';
import { useControllableState } from '../../../utils/useControllableState';
import { ChevronDown, Check } from '../../Symbols';
import { Divider } from '../Divider';
import { SearchInput } from '../SearchInput';
import { SelectProvider, useSelectContext } from './SelectContext';
import type {
  MetaShape,
  SelectItemGroup,
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectListProps,
  SelectSearchProps,
  SelectLabelProps,
  SelectItemTextProps,
  SelectItemProps,
  SelectItemContentProps,
  SelectItemDescriptionProps,
  SelectSeparatorProps,
  SelectEmptyStateProps,
} from './types';
import { useSelectItems } from './useSelectItems';
import { resolveValue } from './utils';

function Select<TMeta extends MetaShape = MetaShape>({
  value,
  defaultValue,
  onValueChange,
  disabled: disabledProp,
  items,
  filter,
  filteredItems,
  searchValue: searchValueProp,
  defaultSearchValue,
  onSearchValueChange,
  open,
  defaultOpen,
  onOpenChange,
  name,
  required,
  children,
}: Readonly<SelectProps<TMeta>>) {
  const disabled = useDisabledContext({
    consumerName: 'Select',
    mergeWith: { disabled: disabledProp },
  });

  const [selectedValue, setSelectedValue] = useControllableState<string | null>(
    {
      prop: value,
      defaultProp: defaultValue ?? null,
      onChange: (next) => {
        onValueChange?.(next);
      },
    },
  );

  const {
    isGrouped,
    groupedItems,
    filteredItemsForRoot,
    resolvedSearchValue,
    searchMounted,
    registerSearch,
    handleSearchValueChange,
  } = useSelectItems({
    items,
    filter,
    filteredItems,
    searchValue: searchValueProp,
    defaultSearchValue,
    onSearchValueChange,
  });

  return (
    <Combobox.Root
      data-slot='select'
      filter={null}
      items={groupedItems ?? items}
      filteredItems={filteredItemsForRoot}
      inputValue={resolvedSearchValue}
      onInputValueChange={handleSearchValueChange}
      value={selectedValue}
      onValueChange={(val) => setSelectedValue(resolveValue(val))}
      isItemEqualToValue={(a, b) => resolveValue(a) === resolveValue(b)}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      name={name}
      required={required}
      disabled={disabled}
    >
      <SelectProvider
        value={{ selectedValue, registerSearch, isGrouped, searchMounted }}
      >
        {children}
      </SelectProvider>
    </Combobox.Root>
  );
}

const triggerStyles = cn(
  'group relative flex h-48 w-full cursor-pointer items-center justify-between gap-8',
  'rounded-sm bg-muted px-16',
  'body-2 text-base',
  'hover:bg-muted-hover',
  'transition-colors duration-200 focus:ring-2 focus:ring-active focus:outline-hidden',
  'disabled:cursor-not-allowed disabled:text-disabled',
);

const labelStyles = cn(
  'pointer-events-none absolute left-16 origin-left text-muted transition-all duration-300',
  'top-10 -translate-y-4 body-4',
  'group-data-placeholder:top-14 group-data-placeholder:translate-y-0 group-data-placeholder:body-2',
  'group-data-disabled:text-disabled',
  'max-w-[calc(100%-var(--size-56))] truncate',
);

const SelectInputTrigger = ({
  ref,
  className,
  labelClassName,
  label,
  ...props
}: Omit<SelectTriggerProps, 'render'>) => {
  const { selectedValue } = useSelectContext({
    consumerName: 'SelectInputTrigger',
    contextRequired: true,
  });
  const hasValue = selectedValue != null && selectedValue !== '';

  return (
    <Combobox.Trigger
      ref={ref}
      data-slot='select-trigger'
      data-placeholder={!hasValue ? '' : undefined}
      className={cn(triggerStyles, className)}
      {...props}
    >
      {label && (
        <label className={cn(labelStyles, labelClassName)}>{label}</label>
      )}
      <span
        className={cn(
          'flex-1 truncate text-left',
          label &&
            'mt-16 opacity-100 transition-opacity delay-100 duration-300',
          label && !hasValue && 'mt-0 opacity-0',
        )}
      >
        <Combobox.Value />
      </span>
      <ChevronDown
        size={20}
        className='text-muted group-data-disabled:text-disabled'
      />
    </Combobox.Trigger>
  );
};

const SelectTrigger = ({ render, disabled, ...props }: SelectTriggerProps) => {
  const { selectedValue } = useSelectContext({
    consumerName: 'SelectTrigger',
    contextRequired: true,
  });
  const selectedContent = <Combobox.Value />;

  if (render) {
    return (
      <Combobox.Trigger
        disabled={disabled}
        ref={props.ref}
        data-slot='select-trigger'
        render={render({ selectedValue, selectedContent })}
      />
    );
  }

  return <SelectInputTrigger {...props} disabled={disabled} />;
};

const contentStyles = cva(
  [
    'group/select-content relative flex max-h-(--available-height) w-(--anchor-width) flex-col overflow-hidden',
    'rounded-sm bg-surface',
    'shadow-md',
  ],
  {
    variants: {
      side: {
        top: [
          'data-open:animate-slide-in-from-top',
          'data-closed:animate-slide-out-to-top',
        ],
        bottom: [
          'data-open:animate-slide-in-from-bottom',
          'data-closed:animate-slide-out-to-bottom',
        ],
        left: [
          'data-open:animate-slide-in-from-left',
          'data-closed:animate-slide-out-to-left',
        ],
        right: [
          'data-open:animate-slide-in-from-right',
          'data-closed:animate-slide-out-to-right',
        ],
      },
    },
  },
);

const SelectContent = ({
  ref,
  className,
  children,
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  initialFocus = true,
  ...props
}: SelectContentProps) => (
  <Combobox.Portal data-slot='select-portal'>
    <Combobox.Positioner
      data-slot='select-positioner'
      className='pointer-events-auto z-select'
      side={side}
      sideOffset={sideOffset}
      align={align}
    >
      <Combobox.Popup
        ref={ref}
        data-slot='select-content'
        initialFocus={initialFocus}
        className={cn(contentStyles({ side }), className)}
        {...props}
      >
        {children}
      </Combobox.Popup>
    </Combobox.Positioner>
  </Combobox.Portal>
);

const SelectList = <TMeta extends MetaShape = MetaShape>({
  ref,
  className,
  renderItem,
  ...props
}: SelectListProps<TMeta>) => {
  const { isGrouped } = useSelectContext({
    consumerName: 'SelectList',
    contextRequired: true,
  });

  return (
    <Combobox.List
      ref={ref}
      data-slot='select-list'
      className={cn(
        'min-h-0 min-w-(--anchor-width) flex-1 overflow-y-auto p-8 group-data-empty/select-content:p-0 focus:ring-0 focus:outline-hidden',
        className,
      )}
      {...props}
    >
      {isGrouped
        ? (group: SelectItemGroup<TMeta>, groupIndex: number) => (
            <Combobox.Group
              key={group.label}
              items={group.items}
              data-slot='select-group'
            >
              {groupIndex > 0 && <SelectSeparator />}
              {group.label && <SelectLabel>{group.label}</SelectLabel>}
              <Combobox.Collection>{renderItem}</Combobox.Collection>
            </Combobox.Group>
          )
        : renderItem}
    </Combobox.List>
  );
};

const SelectLabel = ({ ref, className, ...props }: SelectLabelProps) => (
  <Combobox.GroupLabel
    ref={ref}
    data-slot='select-label'
    className={cn('mb-4 px-8 pt-8 pb-0 body-3-semi-bold text-muted', className)}
    {...props}
  />
);

const itemStyles = cn(
  'group/item flex w-full min-w-0 cursor-pointer items-center gap-12 bg-base-transparent select-none',
  'rounded-sm p-8',
  'body-2 text-base',
  'outline-hidden',
  'data-highlighted:bg-base-transparent-hover',
  'active:bg-base-transparent-pressed',
  'data-disabled:cursor-not-allowed data-disabled:text-disabled',
);

const SelectItem = ({
  ref,
  className,
  children,
  ...props
}: SelectItemProps) => (
  <Combobox.Item
    ref={ref}
    data-slot='select-item'
    className={cn(itemStyles, className)}
    {...props}
  >
    {children}
    <Combobox.ItemIndicator className='ml-auto flex shrink-0 items-center justify-center'>
      <Check size={24} className='shrink-0 text-active' />
    </Combobox.ItemIndicator>
  </Combobox.Item>
);

const SelectSeparator = ({
  ref,
  className,
  ...props
}: SelectSeparatorProps) => (
  <Divider ref={ref} className={cn('mx-8 my-4 w-auto', className)} {...props} />
);

const SelectItemText = ({ ref, className, ...props }: SelectItemTextProps) => (
  <span
    ref={ref}
    data-slot='select-item-text'
    className={cn('truncate body-2', className)}
    {...props}
  />
);

const SelectItemContent = ({
  ref,
  className,
  children,
  ...props
}: SelectItemContentProps) => (
  <div
    ref={ref}
    data-slot='select-item-content'
    className={cn('flex min-w-0 flex-1 flex-col gap-4', className)}
    {...props}
  >
    {children}
  </div>
);

const SelectItemDescription = ({
  ref,
  className,
  children,
  ...props
}: SelectItemDescriptionProps) => (
  <div
    ref={ref}
    data-slot='select-item-description'
    className={cn(
      'truncate body-3 text-muted',
      'group-data-disabled/item:text-disabled',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

const SelectSearch = ({
  className,
  placeholder = 'Search',
  errorMessage,
  'aria-invalid': ariaInvalid,
  suffix,
  onClear,
  hideClearButton,
}: SelectSearchProps) => {
  const { registerSearch } = useSelectContext({
    consumerName: 'SelectSearch',
    contextRequired: true,
  });

  useLayoutEffect(() => registerSearch(), [registerSearch]);

  return (
    <Combobox.Input
      render={(comboboxProps) => (
        <SearchInput
          {...comboboxProps}
          aria-invalid={ariaInvalid}
          errorMessage={errorMessage}
          suffix={suffix}
          onClear={onClear}
          hideClearButton={hideClearButton}
          placeholder={placeholder}
          containerClassName='rounded-b-none ring-inset'
          className={cn(className, 'rounded-b-none ring-inset')}
        />
      )}
    />
  );
};

const SelectEmptyState = ({
  ref,
  className,
  title,
  description,
  ...props
}: SelectEmptyStateProps) => (
  <Combobox.Empty
    ref={ref}
    data-slot='select-empty-state'
    className={cn(
      'hidden w-full flex-col items-center gap-8 py-24',
      'group-data-empty/select-content:flex',
      className,
    )}
    {...props}
  >
    <span className='heading-4-semi-bold text-base'>{title}</span>
    {description && <span className='body-2 text-muted'>{description}</span>}
  </Combobox.Empty>
);

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectSearch,
  SelectList,
  SelectItemText,
  SelectItemContent,
  SelectItemDescription,
  SelectItem,
  SelectSeparator,
  SelectEmptyState,
};
