import { cn } from '@ledgerhq/lumen-utils-shared';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { ChevronDown, Check, ChevronUp } from '../../Symbols';
import { Divider } from '../Divider';
import type {
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectItemTextProps,
  SelectItemProps,
  SelectSeparatorProps,
} from './types';

function Select({ ...props }: SelectProps) {
  return <SelectPrimitive.Root data-slot='select' {...props} />;
}

function SelectGroup({ ...props }: SelectGroupProps) {
  return <SelectPrimitive.Group data-slot='select-group' {...props} />;
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
  'group-data-disabled:text-disabled disabled:text-disabled',
  'max-w-[calc(100%-var(--size-56))] truncate',
);

const SelectTrigger = ({
  ref,
  className,
  labelClassName,
  label,
  ...props
}: SelectTriggerProps & {
  ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Trigger>>;
}) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot='select-trigger'
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
          'mt-16 opacity-100 transition-opacity delay-100 duration-300 group-data-placeholder:mt-0 group-data-placeholder:opacity-0',
        className,
      )}
    >
      <SelectPrimitive.Value data-slot='select-value' />
    </span>
    <SelectPrimitive.Icon asChild>
      <ChevronDown
        size={20}
        className='shrink-0 text-muted group-data-disabled:text-disabled'
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const contentStyles = cva(
  [
    'relative z-select max-h-(--radix-select-content-available-height) overflow-x-hidden overflow-y-auto',
    'rounded-sm bg-muted',
    'shadow-md',
    'data-[side=bottom]:animate-slide-in-from-top',
    'data-[side=top]:animate-slide-in-from-bottom',
    'data-[side=left]:animate-slide-in-from-right',
    'data-[side=right]:animate-slide-in-from-left',
  ],
  {
    variants: {
      position: {
        popper:
          'data-[side=bottom]:translate-y-8 data-[side=left]:-translate-x-8 data-[side=right]:translate-x-8 data-[side=top]:-translate-y-8',
        'item-aligned': '',
      },
    },
    defaultVariants: {
      position: 'popper',
    },
  },
);

const viewportStyles = cva('p-8', {
  variants: {
    position: {
      popper:
        'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)',
      'item-aligned': '',
    },
  },
  defaultVariants: {
    position: 'popper',
  },
});

const SelectContent = ({
  ref,
  className,
  children,
  position = 'popper',
  ...props
}: SelectContentProps & {
  ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Content>>;
}) => (
  <SelectPrimitive.Portal data-slot='select-portal'>
    <SelectPrimitive.Content
      ref={ref}
      data-slot='select-content'
      className={cn(contentStyles({ position }), className)}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className={viewportStyles({ position })}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = ({
  ref,
  className,
  ...props
}: SelectLabelProps & {
  ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Label>>;
}) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot='select-label'
    className={cn('mb-4 px-8 pt-8 pb-0 body-3-semi-bold text-muted', className)}
    {...props}
  />
);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const itemStyles = cn(
  'relative flex w-full cursor-pointer items-center bg-base-transparent select-none',
  'rounded-sm p-8',
  'body-2 text-base',
  'outline-hidden',
  'focus:bg-base-transparent-hover',
  'active:bg-base-transparent-pressed',
  'data-disabled:cursor-not-allowed data-disabled:text-disabled',
);

const SelectItem = ({
  ref,
  className,
  children,
  ...props
}: SelectItemProps & {
  ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Item>>;
}) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot='select-item'
    className={cn(itemStyles, className)}
    {...props}
  >
    {children}
    <span className='absolute right-8 flex size-24 items-center justify-center'>
      <SelectPrimitive.ItemIndicator>
        <Check size={24} className='text-active' />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = ({
  ref,
  className,
  ...props
}: SelectSeparatorProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => (
  <Divider ref={ref} className={cn('mx-8 my-4 w-auto', className)} {...props} />
);
SelectSeparator.displayName = 'SelectSeparator';

const SelectItemText = ({
  ref,
  className,
  ...props
}: SelectItemTextProps & {
  ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.ItemText>>;
}) => (
  <SelectPrimitive.ItemText
    ref={ref}
    data-slot='select-item-text'
    className={cn('body-2 text-muted', className)}
    {...props}
  />
);
SelectItemText.displayName = SelectPrimitive.ItemText.displayName;

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot='select-scroll-up-button'
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-muted',
        className,
      )}
      {...props}
    >
      <ChevronUp className='size-4' />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot='select-scroll-down-button'
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-muted',
        className,
      )}
      {...props}
    >
      <ChevronDown className='size-4' />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItemText,
  SelectItem,
  SelectSeparator,
};
