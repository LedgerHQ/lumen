import { cn } from '@ledgerhq/lumen-utils-shared';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
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

const MenuTrigger = ({
  ref,
  ...props
}: MenuTriggerProps & {
  ref?: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Trigger>>;
}) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    data-slot='menu-trigger'
    {...props}
  />
);
MenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

function MenuGroup({ ...props }: MenuGroupProps) {
  return <DropdownMenuPrimitive.Group data-slot='menu-group' {...props} />;
}

function MenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal {...props} />;
}

function MenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
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
}: MenuSubTriggerProps & {
  ref?: React.Ref<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>
  >;
}) => (
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
MenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const MenuSubContent = ({
  ref,
  className,
  ...props
}: MenuSubContentProps & {
  ref?: React.Ref<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>
  >;
}) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    data-slot='menu-sub-content'
    className={cn(contentStyles, className)}
    {...props}
  />
);
MenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const MenuContent = ({
  ref,
  className,
  sideOffset = 4,
  align = 'start',
  ...props
}: MenuContentProps & {
  ref?: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Content>>;
}) => (
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
MenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const MenuItem = ({
  ref,
  className,
  inset,
  ...props
}: MenuItemProps & {
  ref?: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Item>>;
}) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    data-slot='menu-item'
    className={cn(itemStyles, inset && 'pl-32', className)}
    {...props}
  />
);
MenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const MenuCheckboxItem = ({
  ref,
  className,
  children,
  checked,
  ...props
}: MenuCheckboxItemProps & {
  ref?: React.Ref<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>
  >;
}) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    data-slot='menu-checkbox-item'
    className={cn(itemStyles, className)}
    checked={checked}
    {...props}
  >
    {children}
    <span className='ml-auto flex size-24 items-center justify-center'>
      <DropdownMenuPrimitive.ItemIndicator>
        <Check size={24} className='text-active' />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
  </DropdownMenuPrimitive.CheckboxItem>
);
MenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const MenuRadioItem = ({
  ref,
  className,
  children,
  ...props
}: MenuRadioItemProps & {
  ref?: React.Ref<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>
  >;
}) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    data-slot='menu-radio-item'
    className={cn(itemStyles, className)}
    {...props}
  >
    {children}
    <span className='ml-auto flex size-24 items-center justify-center'>
      <DropdownMenuPrimitive.ItemIndicator>
        <Check size={24} className='text-active' />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
  </DropdownMenuPrimitive.RadioItem>
);
MenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const MenuLabel = ({
  ref,
  className,
  inset,
  ...props
}: MenuLabelProps & {
  ref?: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Label>>;
}) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    data-slot='menu-label'
    className={cn(labelStyles, inset && 'pl-32', className)}
    {...props}
  />
);
MenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const MenuSeparator = ({
  ref,
  className,
  ...props
}: MenuSeparatorProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => (
  <Divider ref={ref} className={cn('mx-8 my-4 w-auto', className)} {...props} />
);
MenuSeparator.displayName = 'MenuSeparator';

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
