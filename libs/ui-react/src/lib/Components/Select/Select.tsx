import { Combobox } from '@base-ui/react/combobox';
import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useLayoutEffect } from 'react';
import { useControllableState } from '../../../utils/useControllableState';
import { ChevronDown, Check } from '../../Symbols';
import { Divider } from '../Divider';
import { SearchInput } from '../SearchInput';
import { TriggerButton } from '../TriggerButton';
import { SelectProvider, useSelectContext } from './SelectContext';
import type {
  SelectItemGroup,
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectListProps,
  SelectSearchProps,
  SelectLabelProps,
  SelectItemTextProps,
  SelectItemProps,
  SelectSeparatorProps,
  SelectEmptyStateProps,
  SelectTriggerButtonProps,
} from './types';
import { useSelectItems } from './useSelectItems';

function Select({
  value,
  defaultValue,
  onValueChange,
  disabled: disabledProp,
  items,
  filter,
  filteredItems,
  inputValue: inputValueProp,
  defaultInputValue,
  onInputValueChange,
  open,
  defaultOpen,
  onOpenChange,
  name,
  required,
  children,
}: SelectProps) {
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
    resolvedInputValue,
    registerSearch,
    handleInputValueChange,
  } = useSelectItems({
    items,
    filter,
    filteredItems,
    inputValue: inputValueProp,
    defaultInputValue,
    onInputValueChange,
  });

  return (
    <Combobox.Root
      data-slot='select'
      filter={null}
      items={groupedItems ?? items}
      filteredItems={filteredItemsForRoot}
      inputValue={resolvedInputValue}
      onInputValueChange={handleInputValueChange}
      value={selectedValue}
      onValueChange={setSelectedValue}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      name={name}
      required={required}
      disabled={disabled}
    >
      <SelectProvider value={{ selectedValue, registerSearch, isGrouped }}>
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
  'transition-colors duration-200 focus:ring-2 focus:ring-focus focus:outline-hidden',
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
SelectTrigger.displayName = 'SelectTrigger';

const contentStyles = cn(
  'group/select-content relative z-select max-h-(--available-height) overflow-x-hidden overflow-y-auto',
  'rounded-sm bg-muted',
  'shadow-md',
  'data-[side=bottom]:animate-slide-in-from-top',
  'data-[side=top]:animate-slide-in-from-bottom',
  'data-[side=left]:animate-slide-in-from-right',
  'data-[side=right]:animate-slide-in-from-left',
);

const SelectContent = ({
  ref,
  className,
  children,
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  ...props
}: SelectContentProps) => (
  <Combobox.Portal data-slot='select-portal'>
    <Combobox.Positioner
      data-slot='select-positioner'
      side={side}
      sideOffset={sideOffset}
      align={align}
    >
      <Combobox.Popup
        ref={ref}
        data-slot='select-content'
        className={cn(contentStyles, className)}
        {...props}
      >
        {children}
      </Combobox.Popup>
    </Combobox.Positioner>
  </Combobox.Portal>
);
SelectContent.displayName = 'SelectContent';

const SelectList = ({
  ref,
  className,
  renderItem,
  ...props
}: SelectListProps) => {
  const { isGrouped } = useSelectContext({
    consumerName: 'SelectList',
    contextRequired: true,
  });

  if (isGrouped) {
    return (
      <Combobox.List
        ref={ref}
        data-slot='select-list'
        className={cn('min-w-(--anchor-width) p-8', className)}
        {...props}
      >
        {(group: SelectItemGroup, groupIndex: number) => (
          <Combobox.Group
            key={group.value}
            items={group.items}
            data-slot='select-group'
          >
            {groupIndex > 0 && <SelectSeparator />}
            <SelectLabel>{group.value}</SelectLabel>
            <Combobox.Collection>{renderItem}</Combobox.Collection>
          </Combobox.Group>
        )}
      </Combobox.List>
    );
  }

  return (
    <Combobox.List
      ref={ref}
      data-slot='select-list'
      className={cn('min-w-(--anchor-width) p-8', className)}
      {...props}
    >
      {renderItem}
    </Combobox.List>
  );
};
SelectList.displayName = 'SelectList';

const SelectLabel = ({ ref, className, ...props }: SelectLabelProps) => (
  <Combobox.GroupLabel
    ref={ref}
    data-slot='select-label'
    className={cn('mb-4 px-8 pt-8 pb-0 body-3-semi-bold text-muted', className)}
    {...props}
  />
);
SelectLabel.displayName = 'SelectLabel';

const itemStyles = cn(
  'relative flex w-full cursor-pointer items-center bg-base-transparent select-none',
  'rounded-sm p-8',
  'body-2 text-base',
  'outline-hidden',
  'truncate',
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
    <Combobox.ItemIndicator className='absolute right-8 flex size-24 items-center justify-center'>
      <Check size={24} className='ms-8 shrink-0 text-active' />
    </Combobox.ItemIndicator>
  </Combobox.Item>
);
SelectItem.displayName = 'SelectItem';

const SelectSeparator = ({
  ref,
  className,
  ...props
}: SelectSeparatorProps) => (
  <Divider ref={ref} className={cn('mx-8 my-4 w-auto', className)} {...props} />
);
SelectSeparator.displayName = 'SelectSeparator';

const SelectItemText = ({ ref, className, ...props }: SelectItemTextProps) => (
  <span
    ref={ref}
    data-slot='select-item-text'
    className={cn('truncate body-2', className)}
    {...props}
  />
);
SelectItemText.displayName = 'SelectItemText';

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
SelectSearch.displayName = 'SelectSearch';

const SelectEmptyState = ({
  ref,
  className,
  children,
  ...props
}: SelectEmptyStateProps) => (
  <Combobox.Empty
    ref={ref}
    data-slot='select-empty-state'
    className={cn(
      'hidden w-full justify-center p-16 body-2 text-muted',
      'group-data-empty/select-content:flex',
      className,
    )}
    {...props}
  >
    {children}
  </Combobox.Empty>
);
SelectEmptyState.displayName = 'SelectEmptyState';

const SelectTriggerButton = ({
  selectedValue,
  selectedContent,
  label,
  ...props
}: SelectTriggerButtonProps) => (
  <TriggerButton {...props}>
    {selectedValue ? selectedContent : label}
  </TriggerButton>
);

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectSearch,
  SelectList,
  SelectItemText,
  SelectItem,
  SelectSeparator,
  SelectEmptyState,
  SelectTriggerButton,
};
