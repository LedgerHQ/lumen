import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import {
  cn,
  DisabledProvider,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { ReactElement } from 'react';
import { Check, ChevronRight } from '../../Symbols';
import { Divider } from '../Divider';
import type {
  MenuProps,
  MenuTriggerProps,
  MenuContentProps,
  MenuItemProps,
  MenuCheckboxItemProps,
  MenuRadioItemProps,
  MenuRadioValue,
  MenuLabelProps,
  MenuSeparatorProps,
  MenuSubTriggerProps,
  MenuSubContentProps,
  MenuGroupProps,
  MenuRadioGroupProps,
  MenuSubProps,
} from './types';

const contentStyles = cva(
  [
    'min-w-160 overflow-hidden rounded-sm bg-muted p-8',
    'shadow-sm outline-none',
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
    defaultVariants: {
      side: 'bottom',
    },
  },
);

const itemStyles = cn(
  'relative flex cursor-default items-center gap-12 select-none',
  'h-44 rounded-sm px-8 outline-hidden',
  'body-2-semi-bold text-base',
  'transition-colors',
  'data-highlighted:bg-base-transparent-hover',
  'active:bg-base-transparent-pressed',
  'data-disabled:pointer-events-none data-disabled:text-disabled',
);

const labelStyles = cn('px-8 py-4 body-3-semi-bold text-muted');

const subTriggerStyles = cn(
  itemStyles,
  'data-popup-open:bg-base-transparent-hover',
);

function Menu({ ...props }: MenuProps) {
  return <MenuPrimitive.Root {...props} />;
}

const MenuTrigger = ({
  ref,
  render,
  className,
  ...props
}: MenuTriggerProps) => (
  <MenuPrimitive.Trigger
    ref={ref}
    data-slot='menu-trigger'
    render={render}
    className={cn('data-popup-open:z-menu', className)}
    {...props}
  />
);

function MenuGroup({ ...props }: MenuGroupProps) {
  return <MenuPrimitive.Group data-slot='menu-group' {...props} />;
}

function MenuSub({ ...props }: MenuSubProps) {
  return <MenuPrimitive.SubmenuRoot {...props} />;
}

function MenuRadioGroup<T extends MenuRadioValue = MenuRadioValue>({
  onValueChange,
  ...props
}: MenuRadioGroupProps<T>) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot='menu-radio-group'
      onValueChange={(value) => onValueChange?.(String(value) as T)}
      {...props}
    />
  );
}

const MenuSubTrigger = ({
  ref,
  className,
  children,
  ...props
}: MenuSubTriggerProps) => (
  <MenuPrimitive.SubmenuTrigger
    ref={ref}
    data-slot='menu-sub-trigger'
    className={cn(subTriggerStyles, className)}
    {...props}
  >
    {children}
    <ChevronRight size={20} className='ml-auto text-muted' />
  </MenuPrimitive.SubmenuTrigger>
);

const MenuSubContent = ({ className, children }: MenuSubContentProps) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner className='z-menu' side='right' sideOffset={4}>
      <MenuPrimitive.Popup
        data-slot='menu-sub-content'
        className={cn(contentStyles({ side: 'right' }), className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </MenuPrimitive.Popup>
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
);

const MenuContent = ({
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset,
  sticky = true,
  className,
  children,
}: MenuContentProps) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner
      className='z-menu'
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      sticky={sticky}
    >
      <MenuPrimitive.Popup
        data-slot='menu-content'
        className={cn(contentStyles({ side }), className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </MenuPrimitive.Popup>
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
);

const MenuItem = ({
  ref,
  className,
  disabled: disabledProp,
  onClick,
  label,
  closeOnClick = true,
  ...props
}: MenuItemProps) => {
  const disabled = useDisabledContext({
    consumerName: 'MenuItem',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <MenuPrimitive.Item
        ref={ref}
        data-slot='menu-item'
        label={label}
        disabled={disabled}
        closeOnClick={closeOnClick}
        className={cn(itemStyles, className)}
        onClick={onClick}
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
  defaultChecked,
  onCheckedChange,
  disabled: disabledProp,
  label,
  closeOnClick,
  ...props
}: MenuCheckboxItemProps) => {
  const disabled = useDisabledContext({
    consumerName: 'MenuCheckboxItem',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <MenuPrimitive.CheckboxItem
        ref={ref}
        data-slot='menu-checkbox-item'
        label={label}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        closeOnClick={closeOnClick ?? false}
        className={cn(itemStyles, className)}
        onCheckedChange={onCheckedChange}
        {...props}
      >
        {children}
        <span className='ml-auto flex size-24 items-center justify-center'>
          <MenuPrimitive.CheckboxItemIndicator>
            <Check disabled={disabled} size={24} className='text-active' />
          </MenuPrimitive.CheckboxItemIndicator>
        </span>
      </MenuPrimitive.CheckboxItem>
    </DisabledProvider>
  );
};

const MenuRadioItem = <T extends MenuRadioValue = MenuRadioValue>({
  ref,
  className,
  children,
  disabled: disabledProp,
  ...props
}: MenuRadioItemProps<T>) => {
  const disabled = useDisabledContext({
    consumerName: 'MenuRadioItem',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <MenuPrimitive.RadioItem
        ref={ref}
        data-slot='menu-radio-item'
        disabled={disabled}
        className={cn(itemStyles, className)}
        {...props}
      >
        {children}
        <span className='ml-auto flex size-24 items-center justify-center'>
          <MenuPrimitive.RadioItemIndicator>
            <Check disabled={disabled} size={24} className='text-active' />
          </MenuPrimitive.RadioItemIndicator>
        </span>
      </MenuPrimitive.RadioItem>
    </DisabledProvider>
  );
};

const MenuLabel = ({ ref, className, ...props }: MenuLabelProps) => (
  <MenuPrimitive.GroupLabel
    ref={ref}
    data-slot='menu-label'
    className={cn(labelStyles, className)}
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
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuRadioGroup,
};

export function createMenuRadioGroup<T extends MenuRadioValue = never>(): {
  MenuRadioGroup: (props: MenuRadioGroupProps<T>) => ReactElement;
  MenuRadioItem: (props: MenuRadioItemProps<T>) => ReactElement;
} {
  return { MenuRadioGroup, MenuRadioItem };
}
