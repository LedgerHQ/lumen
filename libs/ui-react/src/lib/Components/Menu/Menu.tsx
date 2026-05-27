import {
  cn,
  DisabledProvider,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { ComponentProps, ComponentRef, Ref } from 'react';
import { Check, ChevronRight } from '../../Symbols';
import { Divider } from '../Divider';
import type {
  MenuProps,
  MenuTriggerProps,
  MenuContentProps,
  MenuItemProps,
  MenuCheckboxItemProps,
  MenuRadioItemProps,
  MenuLabelProps,
  MenuSeparatorProps,
  MenuSubTriggerProps,
  MenuSubContentProps,
  MenuGroupProps,
  MenuRadioGroupProps,
} from './types';

const contentStyles = cn(
  'z-menu min-w-160 overflow-hidden rounded-sm bg-muted p-8',
  'shadow-sm',
  'data-[state=open]:animate-fade-in',
  'data-[state=closed]:animate-fade-out',
);

const itemStyles = cn(
  'relative flex cursor-default items-center gap-12 select-none',
  'h-44 rounded-sm px-8 outline-hidden',
  'body-2-semi-bold text-base',
  'transition-colors',
  'focus:bg-base-transparent-hover',
  'active:bg-base-transparent-pressed',
  'data-disabled:pointer-events-none data-disabled:text-disabled',
);

const labelStyles = cn('px-8 py-4 body-3-semi-bold text-muted');

const subTriggerStyles = cn(
  itemStyles,
  'data-[state=open]:bg-base-transparent-hover',
);

function Menu({ ...props }: MenuProps) {
  return <DropdownMenuPrimitive.Root data-slot='menu' {...props} />;
}

const MenuTrigger = ({ ref, ...props }: MenuTriggerProps) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    data-slot='menu-trigger'
    {...props}
  />
);

function MenuGroup({ ...props }: MenuGroupProps) {
  return <DropdownMenuPrimitive.Group data-slot='menu-group' {...props} />;
}

function MenuPortal({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal {...props} />;
}

function MenuSub({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub {...props} />;
}

function MenuRadioGroup({ ...props }: MenuRadioGroupProps) {
  return (
    <DropdownMenuPrimitive.RadioGroup data-slot='menu-radio-group' {...props} />
  );
}

const MenuSubTrigger = ({
  ref,
  className,
  inset,
  children,
  ...props
}: MenuSubTriggerProps) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    data-slot='menu-sub-trigger'
    className={cn(subTriggerStyles, inset && 'pl-32', className)}
    {...props}
  >
    {children}
    <ChevronRight size={20} className='ml-auto text-muted' />
  </DropdownMenuPrimitive.SubTrigger>
);

const MenuSubContent = ({ ref, className, ...props }: MenuSubContentProps) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    data-slot='menu-sub-content'
    className={cn(contentStyles, className)}
    {...props}
  />
);

const MenuContent = ({
  ref,
  className,
  sideOffset = 4,
  align = 'start',
  ...props
}: MenuContentProps) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      data-slot='menu-content'
      sideOffset={sideOffset}
      className={cn(contentStyles, className)}
      /**
       * Prevent propagation of the click event to the parent element
       */
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e);
      }}
      align={align}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

const MenuItem = ({
  ref,
  className,
  inset,
  disabled: disabledProp,
  ...props
}: MenuItemProps) => {
  const disabled = useDisabledContext({
    consumerName: 'MenuItem',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <DropdownMenuPrimitive.Item
        ref={ref}
        data-slot='menu-item'
        className={cn(itemStyles, inset && 'pl-32', className)}
        disabled={disabled}
        {...props}
      />
    </DisabledProvider>
  );
};

const MenuCheckboxItem = ({
  ref,
  className,
  children,
  checked,
  disabled: disabledProp,
  ...props
}: MenuCheckboxItemProps) => {
  const disabled = useDisabledContext({
    consumerName: 'MenuCheckboxItem',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        data-slot='menu-checkbox-item'
        className={cn(itemStyles, className)}
        checked={checked}
        disabled={disabled}
        {...props}
      >
        {children}
        <span className='ml-auto flex size-24 items-center justify-center'>
          <DropdownMenuPrimitive.ItemIndicator>
            <Check disabled={disabled} size={24} className='text-active' />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
      </DropdownMenuPrimitive.CheckboxItem>
    </DisabledProvider>
  );
};

const MenuRadioItem = ({
  ref,
  className,
  children,
  disabled: disabledProp,
  ...props
}: MenuRadioItemProps) => {
  const disabled = useDisabledContext({
    consumerName: 'MenuRadioItem',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <DropdownMenuPrimitive.RadioItem
        ref={ref}
        data-slot='menu-radio-item'
        disabled={disabled}
        className={cn(itemStyles, className)}
        {...props}
      >
        {children}
        <span className='ml-auto flex size-24 items-center justify-center'>
          <DropdownMenuPrimitive.ItemIndicator>
            <Check disabled={disabled} size={24} className='text-active' />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
      </DropdownMenuPrimitive.RadioItem>
    </DisabledProvider>
  );
};

const MenuLabel = ({
  ref,
  className,
  inset,
  ...props
}: MenuLabelProps & {
  ref?: Ref<ComponentRef<typeof DropdownMenuPrimitive.Label>>;
}) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    data-slot='menu-label'
    className={cn(labelStyles, inset && 'pl-32', className)}
    {...props}
  />
);

const MenuSeparator = ({ ref, className, ...props }: MenuSeparatorProps) => (
  <Divider ref={ref} className={cn('mx-8 my-4 w-auto', className)} {...props} />
);

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuLabel,
  MenuSeparator,
  MenuGroup,
  MenuPortal,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuRadioGroup,
};
