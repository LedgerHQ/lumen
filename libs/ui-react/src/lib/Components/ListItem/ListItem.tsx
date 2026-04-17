import {
  cn,
  createSafeContext,
  DisabledProvider,
  getButtonA11yProps,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import {
  ListItemProps,
  ListItemContentProps,
  ListItemLeadingProps,
  ListItemContentRowProps,
  ListItemTitleProps,
  ListItemDescriptionProps,
  ListItemTrailingProps,
} from './types';

const [ListItemTrailingProvider, useListItemTrailingContext] =
  createSafeContext<{ isInTrailing: boolean }>('ListItemTrailing', {
    isInTrailing: false,
  });

const listItemVariants = cva(
  [
    'flex w-full items-center gap-16 px-8',
    'rounded-md bg-base-transparent text-base transition-colors',
  ],
  {
    variants: {
      density: {
        compact: 'h-40',
        expanded: 'h-64',
      },
      interactive: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'cursor-default bg-base-transparent text-disabled',
        false: '',
      },
    },
    compoundVariants: [
      {
        interactive: true,
        disabled: false,
        className:
          'cursor-pointer hover:bg-base-transparent-hover focus-visible:outline-2 focus-visible:outline-focus active:bg-base-transparent-pressed',
      },
    ],
  },
);

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
 *     <Spot size={48} appearance="icon" icon={Wallet} />
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
export const ListItem = ({ onClick, ref, ...props }: ListItemProps) => {
  const {
    children,
    className,
    disabled: disabledProp = false,
    density = 'expanded',
    ...buttonProps
  } = props;
  const disabled = useDisabledContext({
    consumerName: 'ListItem',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <div
        ref={ref}
        {...getButtonA11yProps({ onClick, disabled })}
        className={cn(
          listItemVariants({
            density,
            interactive: !!onClick,
            disabled,
          }),
          className,
        )}
        {...buttonProps}
      >
        {children}
      </div>
    </DisabledProvider>
  );
};

/**
 * Container for the leading (left) part of the list item.
 * Contains the visual element (Spot, Avatar, Icon) and the content (title + description).
 */
export const ListItemLeading = ({
  ref,
  children,
  className,
  ...props
}: ListItemLeadingProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-1 items-center gap-12', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Container for the text content (title and description) within the leading area.
 */
export const ListItemContent = ({
  ref,
  children,
  className,
  ...props
}: ListItemContentProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-1 flex-col gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Horizontal row container within ListItemContent to place a title or description
 * alongside additional inline content (e.g. Tag) while preserving text truncation.
 */
export const ListItemContentRow = ({
  ref,
  children,
  className,
  ...props
}: ListItemContentRowProps) => {
  const { isInTrailing } = useListItemTrailingContext({
    consumerName: 'ListItemContentRow',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 items-center gap-8',
        isInTrailing && 'justify-end',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * The main title of the list item.
 */
export const ListItemTitle = ({
  ref,
  children,
  className,
  ...props
}: ListItemTitleProps) => {
  const disabled = useDisabledContext({
    consumerName: 'ListItemTitle',
    contextRequired: true,
  });
  const { isInTrailing } = useListItemTrailingContext({
    consumerName: 'ListItemTitle',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'min-w-0 flex-1 truncate body-2-semi-bold',
        isInTrailing ? 'justify-end text-end' : 'justify-start text-start',
        disabled && 'text-disabled',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Optional description text below the title.
 * Automatically applies disabled styling when the parent ListItem is disabled.
 */
export const ListItemDescription = ({
  ref,
  children,
  className,
  ...props
}: ListItemDescriptionProps) => {
  const disabled = useDisabledContext({
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
        'min-w-0 flex-1 items-center truncate body-3 text-muted',
        isInTrailing ? 'justify-end text-end' : 'justify-start text-start',
        disabled && 'text-disabled',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Container for the trailing (right) content of the list item.
 * Used for icons, switches, values, tags, chevrons, etc.
 */
export const ListItemTrailing = ({
  ref,
  children,
  className,
  ...props
}: ListItemTrailingProps) => {
  const disabled = useDisabledContext({
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
        {...props}
      >
        {children}
      </div>
    </ListItemTrailingProvider>
  );
};
