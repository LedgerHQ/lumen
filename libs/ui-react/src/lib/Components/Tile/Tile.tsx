import {
  cn,
  DisabledProvider,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useCallback } from 'react';
import { InteractiveIcon } from '../InteractiveIcon';
import {
  TileContentProps,
  TileDescriptionProps,
  TileProps,
  TileSecondaryActionProps,
  TileTitleProps,
  TileTrailingContentProps,
} from './types';

const tileVariants = {
  root: cva([
    'group relative flex flex-col items-center rounded-md text-base transition-colors focus-visible:outline-2 focus-visible:outline-focus',
  ]),
  inner: cva(
    [
      'flex w-full flex-1 flex-col items-center gap-8 px-8 py-12',
      'rounded-md focus-visible:outline-2 focus-visible:outline-focus',
    ],
    {
      variants: {
        appearance: {
          'no-background':
            'bg-base-transparent hover:not-disabled:bg-base-transparent-hover active:not-disabled:bg-base-transparent-pressed',
          card: 'bg-surface hover:not-disabled:bg-surface-hover active:not-disabled:bg-surface-pressed',
        },
        disabled: {
          true: 'cursor-default',
          false: 'cursor-pointer',
        },
        centered: {
          true: 'h-full justify-center',
          false: '',
        },
      },
      defaultVariants: {
        appearance: 'no-background',
        disabled: false,
        centered: false,
      },
    },
  ),
};

/**
 * A flexible tile component that uses a composite pattern for maximum customization.
 * Displays content in a vertical layout with support for spots, text, and custom content.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-Tile-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/components-Tile-implementation--docs#dos-and-donts Guidelines}
 *
 * @example
 * import {
 *   Tile,
 *   TileContent,
 *   TileTitle,
 *   TileSecondaryAction,
 *   Tag
 * } from '@ledgerhq/lumen-ui-react';
 * import { Spot } from '@ledgerhq/lumen-ui-react';
 * import { Bitcoin, MoreVertical } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Tile appearance="card">
 *   <TileSecondaryAction icon={MoreVertical} onClick={() => console.log('More')} />
 *   <Spot appearance="icon" icon={Bitcoin} />
 *   <TileContent>
 *     <TileTitle>Bitcoin</TileTitle>
 *   </TileContent>
 *   <div>Custom content</div>
 * </Tile>
 */
export const Tile = ({
  ref,
  className,
  onClick,
  secondaryAction,
  appearance = 'no-background',
  disabled: disabledProp = false,
  centered = false,
  children,
  style,
  ...props
}: TileProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Tile',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <div
        ref={ref}
        style={style}
        className={tileVariants.root({
          className,
        })}
      >
        <button
          {...props}
          onClick={onClick}
          disabled={disabled}
          className={tileVariants.inner({
            appearance,
            disabled,
            centered,
          })}
        >
          <DisabledProvider value={{ disabled }}>{children}</DisabledProvider>
        </button>
        {secondaryAction}
      </div>
    </DisabledProvider>
  );
};

/**
 * A container for grouping TileTitle and TileDescription with consistent spacing.
 * Use this to wrap text content within a Tile.
 */
export const TileContent = ({
  children,
  className,
  ...props
}: TileContentProps) => {
  return (
    <div
      className={cn('flex w-full flex-col items-center text-center', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * The primary text label for a Tile. Automatically inherits the disabled state from the parent Tile.
 * Text will truncate with ellipsis if it exceeds the available width.
 */
export const TileTitle = ({
  children,
  className,
  ...props
}: TileTitleProps) => {
  const disabled = useDisabledContext({
    consumerName: 'TileTitle',
    contextRequired: true,
  });
  return (
    <div
      className={cn(
        'w-full truncate body-2-semi-bold',
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
 * The secondary text label for a Tile. Automatically inherits the disabled state from the parent Tile.
 * Text will truncate with ellipsis if it exceeds the available width.
 */
export const TileDescription = ({
  children,
  className,
  ...props
}: TileDescriptionProps) => {
  const disabled = useDisabledContext({
    consumerName: 'TileDescription',
    contextRequired: true,
  });
  return (
    <div
      className={cn(
        'w-full truncate body-3',
        disabled ? 'text-disabled' : 'text-muted',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * A container for trailing content inside TileContent.
 * Use this to wrap Tags, labels, or other supplementary information after title and description.
 * Multiple items inside will have 8px spacing between them.
 *
 * @example
 * <Tile>
 *   <Spot appearance="icon" icon={Settings} />
 *   <TileContent>
 *     <TileTitle>My Title</TileTitle>
 *     <TileDescription>Description</TileDescription>
 *     <TileTrailingContent>
 *       <Tag label="Active" />
 *     </TileTrailingContent>
 *   </TileContent>
 * </Tile>
 */
export const TileTrailingContent = ({
  children,
  className,
  ...props
}: TileTrailingContentProps) => {
  return (
    <div
      className={cn('mt-4 flex w-full flex-col items-center gap-8', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * A self-contained secondary action button for a Tile. Renders an InteractiveIcon that appears
 * in the top-right corner and is visible on hover/focus. Automatically hidden when the parent Tile is disabled.
 *
 * @example
 * import { MoreVertical } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Tile>
 *   <TileSecondaryAction
 *     icon={MoreVertical}
 *     onClick={(e) => console.log('Secondary action clicked')}
 *   />
 *   <TileContent>
 *     <TileTitle>My Title</TileTitle>
 *   </TileContent>
 * </Tile>
 */
export const TileSecondaryAction = ({
  ref,
  onClick,
  icon,
  className,
  'aria-label': ariaLabel,
  ...props
}: TileSecondaryActionProps) => {
  const disabled = useDisabledContext({
    consumerName: 'TileSecondaryAction',
    contextRequired: true,
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClick?.(e);
    },
    [onClick],
  );

  if (disabled) {
    return null;
  }

  return (
    <InteractiveIcon
      className={cn(
        'absolute top-8 right-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100',
        className,
      )}
      data-secondary-button-container
      iconType='stroked'
      icon={icon}
      size={24}
      onClick={handleClick}
      aria-label={ariaLabel}
      ref={ref}
      {...props}
    />
  );
};
