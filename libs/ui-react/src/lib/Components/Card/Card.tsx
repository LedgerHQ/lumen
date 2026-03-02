import {
  cn,
  createSafeContext,
  DisabledProvider,
  getButtonA11yProps,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { ChevronDown, ChevronUp } from '../../Symbols';
import {
  CardContentAlignContextValue,
  CardContentDescriptionProps,
  CardContentProps,
  CardContentRowProps,
  CardContentTitleProps,
  CardContextValue,
  CardFooterActionsProps,
  CardFooterProps,
  CardHeaderProps,
  CardLeadingProps,
  CardProps,
  CardTrailingProps,
} from './types';

const [CardProvider, useCardContext] = createSafeContext<CardContextValue>(
  'Card',
  {},
);

const [CardContentAlignProvider, useCardContentAlignContext] =
  createSafeContext<CardContentAlignContextValue>('CardContentAlign', {
    align: 'left',
  });

const cardVariants = cva(
  'flex w-full flex-col overflow-clip rounded-lg bg-surface text-base transition-colors',
  {
    variants: {
      interactive: {
        true: 'cursor-pointer hover:bg-surface-hover active:bg-surface-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        false: '',
      },
      outlined: {
        true: 'border-2 border-active',
        false: '',
      },
      disabled: {
        true: 'cursor-default',
        false: '',
      },
    },
    compoundVariants: [
      {
        interactive: true,
        disabled: true,
        className: 'cursor-default hover:bg-surface active:bg-surface',
      },
    ],
    defaultVariants: {
      interactive: false,
      outlined: false,
      disabled: false,
    },
  },
);

/**
 * A flexible card component that uses a composite pattern for maximum customization.
 *
 * - `type="interactive"` (default): whole card is clickable with hover/pressed states.
 * - `type="expandable"`: only CardHeader is clickable, toggles footer visibility.
 * - `type="info"`: data-display only, no built-in click handling.
 *
 * @example
 * <Card onClick={handleClick}>
 *   <CardHeader>
 *     <CardLeading>
 *       <CryptoIcon ledgerId="bitcoin" ticker="BTC" size="40px" />
 *       <CardContent>
 *         <CardContentTitle>Bitcoin</CardContentTitle>
 *         <CardContentDescription>BTC</CardContentDescription>
 *       </CardContent>
 *     </CardLeading>
 *   </CardHeader>
 * </Card>
 */
export const Card = ({
  ref,
  className,
  type = 'interactive',
  expanded,
  outlined = false,
  disabled = false,
  onClick,
  children,
  ...props
}: CardProps) => {
  const isInteractive = type === 'interactive';
  const isExpandable = type === 'expandable';

  return (
    <CardProvider
      value={{
        type,
        expanded,
        onHeaderClick: isExpandable ? onClick : undefined,
      }}
    >
      <DisabledProvider value={{ disabled }}>
        <div
          ref={ref}
          {...(isInteractive && getButtonA11yProps({ onClick, disabled }))}
          className={cn(
            cardVariants({ interactive: isInteractive, outlined, disabled }),
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </DisabledProvider>
    </CardProvider>
  );
};
Card.displayName = 'Card';

/**
 * Header row container for the card. Lays out CardLeading and CardTrailing horizontally.
 * When the card `type` is `"expandable"`, the header becomes the click target with hover/pressed states.
 */
export const CardHeader = ({
  ref,
  children,
  className,
  ...props
}: CardHeaderProps) => {
  const disabled = useDisabledContext({
    consumerName: 'CardHeader',
  });
  const { type, expanded, onHeaderClick } = useCardContext({
    consumerName: 'CardHeader',
    contextRequired: false,
  });

  const isExpandable = type === 'expandable';
  const isClickable = isExpandable && !disabled && !!onHeaderClick;

  return (
    <div
      ref={ref}
      aria-expanded={isExpandable ? expanded : undefined}
      {...(isExpandable &&
        getButtonA11yProps({ onClick: onHeaderClick, disabled }))}
      className={cn(
        'flex items-center gap-12 p-12',
        isClickable &&
          'cursor-pointer -outline-offset-6 transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-focus active:bg-surface-pressed',
        className,
      )}
      {...props}
    >
      {children}
      {isExpandable && expanded && (
        <ChevronUp className='text-muted' size={20} />
      )}
      {isExpandable && !expanded && (
        <ChevronDown className='text-muted' size={20} />
      )}
    </div>
  );
};
CardHeader.displayName = 'CardHeader';

/**
 * Leading section container. Wraps icon + CardContent.
 * Reusable inside both CardHeader and CardFooter.
 */
export const CardLeading = ({
  ref,
  children,
  className,
  ...props
}: CardLeadingProps) => {
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
CardLeading.displayName = 'CardLeading';

/**
 * Flex column wrapper for CardContentTitle and CardContentDescription.
 * Supports right alignment via the `align` prop for trailing value displays.
 */
export const CardContent = ({
  ref,
  children,
  className,
  ...props
}: CardContentProps) => {
  const { align } = useCardContentAlignContext({
    consumerName: 'CardContent',
    contextRequired: false,
  });
  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-4',
        align === 'right' && 'items-end text-end',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
CardContent.displayName = 'CardContent';

/**
 * Horizontal row wrapper for placing a CardContentTitle or CardContentDescription
 * alongside additional inline content (e.g. Tag) while preserving text truncation.
 */
export const CardContentRow = ({
  ref,
  children,
  className,
  ...props
}: CardContentRowProps) => {
  const { align } = useCardContentAlignContext({
    consumerName: 'CardContentRow',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 items-center gap-8',
        align === 'right' && 'justify-end',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
CardContentRow.displayName = 'CardContentRow';

/**
 * Primary text of the card. Inherits the disabled state from the parent Card via context.
 */
export const CardContentTitle = ({
  ref,
  children,
  className,
  ...props
}: CardContentTitleProps) => {
  const disabled = useDisabledContext({
    consumerName: 'CardContentTitle',
  });

  return (
    <div
      ref={ref}
      className={cn(
        'truncate body-2-semi-bold',
        disabled && 'text-disabled',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
CardContentTitle.displayName = 'CardContentTitle';

/**
 * Secondary text of the card. Inherits the disabled state from the parent Card via context.
 */
export const CardContentDescription = ({
  ref,
  children,
  className,
  ...props
}: CardContentDescriptionProps) => {
  const disabled = useDisabledContext({
    consumerName: 'CardContentDescription',
  });

  return (
    <div
      ref={ref}
      className={cn(
        'truncate body-3',
        disabled ? 'text-disabled' : 'text-muted',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
CardContentDescription.displayName = 'CardContentDescription';

/**
 * Trailing content container in the header. Used for Button, Tag, or right-aligned CardContent.
 * Inherits the disabled state from the parent Card via context.
 */
export const CardTrailing = ({
  ref,
  children,
  className,
  ...props
}: CardTrailingProps) => {
  const disabled = useDisabledContext({
    consumerName: 'CardTrailing',
  });

  return (
    <CardContentAlignProvider value={{ align: 'right' }}>
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
    </CardContentAlignProvider>
  );
};
CardTrailing.displayName = 'CardTrailing';

/**
 * Footer container for the card. When the card `type` is `"expandable"`,
 * the footer collapses with a 300ms transition when `expanded === false`.
 * When `expanded` is `undefined`, the footer is always visible.
 */
export const CardFooter = ({
  ref,
  children,
  className,
  ...props
}: CardFooterProps) => {
  const disabled = useDisabledContext({
    consumerName: 'CardFooter',
  });

  const { expanded } = useCardContext({
    consumerName: 'CardFooter',
    contextRequired: false,
  });

  return (
    <div
      className={cn(
        'grid flex-1 bg-muted-transparent transition-[grid-template-rows] duration-300',
        expanded === false ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
      )}
    >
      <div className='overflow-hidden'>
        <div
          ref={ref}
          className={cn(
            'flex w-full flex-col gap-8 px-12 py-10',
            disabled && 'text-disabled',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
CardFooter.displayName = 'CardFooter';

/**
 * Horizontal row container for action buttons inside CardFooter.
 */
export const CardFooterActions = ({
  ref,
  children,
  className,
  ...props
}: CardFooterActionsProps) => (
  <div
    ref={ref}
    className={cn('flex flex-row justify-end gap-10', className)}
    {...props}
  >
    {children}
  </div>
);
CardFooterActions.displayName = 'CardFooterActions';
