import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import React from 'react';
import { Spot } from '../Spot/Spot';
import {
  ListItemContextValue,
  ListItemContentProps,
  ListItemDescriptionProps,
  ListItemIconProps,
  ListItemLeadingProps,
  ListItemProps,
  ListItemSpotProps,
  ListItemTitleProps,
  ListItemTrailingProps,
  ListItemTruncateProps,
} from './types';

const [ListItemProvider, useListItemContext] =
  createSafeContext<ListItemContextValue>('ListItem', {});

const [ListItemTrailingProvider, useListItemTrailingContext] =
  createSafeContext<{ isInTrailing: boolean }>('ListItemTrailing', {
    isInTrailing: false,
  });

/**
 * A flexible list item component that provides a composable structure for displaying
 * interactive list items with leading content, title, description, and trailing content.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-listitem--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-listitem--docs#dos-and-donts Guidelines}
 *
 * @example
 *
 * <ListItem onClick={() => console.log('Clicked!')}>
 *   <ListItemLeading>
 *     <ListItemSpot appearance="icon" icon={Wallet} />
 *     <ListItemContent>
 *       <ListItemTitle>Balance</ListItemTitle>
 *       <ListItemDescription>Optional description</ListItemDescription>
 *     </ListItemContent>
 *   </ListItemLeading>
 *   <ListItemTrailing>
 *     <ChevronRight size={24} />
 *   </ListItemTrailing>
 * </ListItem>
 */
export const ListItem = ({
  ref,
  ...props
}: ListItemProps) => {
  const { children, className, disabled, ...buttonProps } = props;

  return (
    <ListItemProvider value={{ disabled }}>
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={cn(
          'flex h-64 w-full cursor-pointer items-center gap-16 rounded-md bg-base-transparent px-8 py-12 text-base transition-colors',
          'hover:bg-base-transparent-hover focus-visible:outline-2 focus-visible:outline-focus active:bg-base-transparent-pressed',
          'disabled:cursor-default disabled:bg-base-transparent disabled:text-disabled',
          className,
        )}
        {...buttonProps}
      >
        {children}
      </button>
    </ListItemProvider>
  );
};

ListItem.displayName = 'ListItem';

/**
 * Container for the leading (left) part of the list item.
 * Contains the visual element (ListItemSpot, Avatar, Icon) and the content (title + description).
 */
export const ListItemLeading = ({
  ref,
  children,
  className,
}: ListItemLeadingProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-1 items-center gap-12', className)}
    >
      {children}
    </div>
  );
};

ListItemLeading.displayName = 'ListItemLeading';

/**
 * Container for the text content (title and description) within the leading area.
 */
export const ListItemContent = ({
  ref,
  children,
  className,
}: ListItemContentProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-1 flex-col gap-4', className)}
    >
      {children}
    </div>
  );
};

ListItemContent.displayName = 'ListItemContent';

/**
 * The main title of the list item.
 */
export const ListItemTitle = ({
  ref,
  children,
  className,
}: ListItemTitleProps) => {
  const { isInTrailing } = useListItemTrailingContext({
    consumerName: 'ListItemTitle',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'w-full truncate body-2-semi-bold',
        isInTrailing ? 'justify-end text-end' : 'justify-start text-start',
        className,
      )}
    >
      {children}
    </div>
  );
};

ListItemTitle.displayName = 'ListItemTitle';

/**
 * Optional description text below the title. Can include inline elements like Tag.
 * Automatically applies disabled styling when the parent ListItem is disabled.
 */
export const ListItemDescription = ({
  ref,
  children,
  className,
}: ListItemDescriptionProps) => {
  const { disabled } = useListItemContext({
    consumerName: 'ListItemDescription',
    contextRequired: true,
  });
  const { isInTrailing } = useListItemTrailingContext({
    consumerName: 'ListItemDescription',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'w-full items-center truncate body-3 text-muted',
        isInTrailing ? 'justify-end text-end' : 'justify-start text-start',
        disabled && 'text-disabled',
        className,
      )}
    >
      {children}
    </div>
  );
};

ListItemDescription.displayName = 'ListItemDescription';

/**
 * Container for the trailing (right) content of the list item.
 * Used for icons, switches, values, tags, chevrons, etc.
 */
export const ListItemTrailing = ({
  ref,
  children,
  className,
}: ListItemTrailingProps) => {
  const { disabled } = useListItemContext({
    consumerName: 'ListItemTrailing',
    contextRequired: true,
  });

  return (
    <ListItemTrailingProvider value={{ isInTrailing: true }}>
      <div
        ref={ref}
        className={cn(
          'flex shrink-0 items-center',
          disabled && 'text-disabled',
          className,
        )}
      >
        {children}
      </div>
    </ListItemTrailingProvider>
  );
};

ListItemTrailing.displayName = 'ListItemTrailing';

/**
 * Spot adapter for ListItem. Automatically inherits disabled state from parent ListItem.
 */
export const ListItemSpot = (props: ListItemSpotProps) => {
  const { disabled } = useListItemContext({
    consumerName: 'ListItemSpot',
    contextRequired: true,
  });

  return <Spot {...props} size={48} disabled={disabled} />;
};

ListItemSpot.displayName = 'ListItemSpot';

/**
 * Icon adapter for ListItem. Automatically applies disabled styling from parent ListItem.
 * Fixed at size 24 for consistent list item appearance.
 */
export const ListItemIcon = ({
  ref,
  icon: Icon,
  className,
  ...props
}: ListItemIconProps) => {
  const { disabled } = useListItemContext({
    consumerName: 'ListItemIcon',
    contextRequired: true,
  });

  return (
    <div
      ref={ref}
      className={cn('shrink-0', disabled && 'text-disabled', className)}
      {...props}
    >
      <Icon size={24} />
    </div>
  );
};

ListItemIcon.displayName = 'ListItemIcon';

export const ListItemTruncate = ({
  children,
  className,
}: ListItemTruncateProps) => {
  return <div className={cn('min-w-0 truncate', className)}>{children}</div>;
};

ListItemTruncate.displayName = 'ListItemTruncate';
