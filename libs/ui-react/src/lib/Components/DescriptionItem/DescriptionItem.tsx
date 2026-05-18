import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';

import type {
  DescriptionItemLabelProps,
  DescriptionItemLeadingProps,
  DescriptionItemProps,
  DescriptionItemSize,
  DescriptionItemTrailingProps,
  DescriptionItemValueProps,
} from './types';

type DescriptionItemSizeContextValue = {
  size: DescriptionItemSize;
};

const [DescriptionItemSizeProvider, useDescriptionItemSizeContext] =
  createSafeContext<DescriptionItemSizeContextValue>('DescriptionItemSize', {
    size: 'md',
  });

/**
 * A compound component for displaying a key-value description row.
 * Composed with DescriptionItemLeading / DescriptionItemLabel (key side)
 * and DescriptionItemTrailing / DescriptionItemValue (value side).
 *
 * Inherits size from a parent DescriptionList when available.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-descriptionitem--docs Storybook}
 *
 * @example
 * <DescriptionItem size="md">
 *   <DescriptionItemLeading>
 *     <DescriptionItemLabel>Fees</DescriptionItemLabel>
 *   </DescriptionItemLeading>
 *   <DescriptionItemTrailing>
 *     <DescriptionItemValue>0.001 BTC</DescriptionItemValue>
 *   </DescriptionItemTrailing>
 * </DescriptionItem>
 */
export const DescriptionItem = ({
  ref,
  children,
  className,
  size = 'md',
  ...props
}: DescriptionItemProps) => {
  return (
    <DescriptionItemSizeProvider value={{ size }}>
      <div
        ref={ref}
        className={cn('flex w-full items-start gap-12', className)}
        {...props}
      >
        {children}
      </div>
    </DescriptionItemSizeProvider>
  );
};

/**
 * Layout container for the leading (left) side of the description item.
 * Contains DescriptionItemLabel and an optional info icon sibling.
 */
export const DescriptionItemLeading = ({
  ref,
  children,
  className,
  ...props
}: DescriptionItemLeadingProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-1 items-center gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Typography-bearing label for the leading side.
 * Reads size from DescriptionItemSizeContext to apply the correct typography.
 * Use this instead of a raw string so that size is always applied correctly,
 * even when children is a custom ReactNode.
 */
export const DescriptionItemLabel = ({
  ref,
  children,
  className,
  ...props
}: DescriptionItemLabelProps) => {
  const { size } = useDescriptionItemSizeContext({
    consumerName: 'DescriptionItemLabel',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'line-clamp-2 min-w-0 wrap-break-word text-ellipsis text-muted',
        size === 'md' ? 'body-2' : 'body-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Layout container for the trailing (right) side of the description item.
 * Accepts DescriptionItemValue, Tag, Link, CryptoIcon, or any custom content.
 */
export const DescriptionItemTrailing = ({
  ref,
  children,
  className,
  ...props
}: DescriptionItemTrailingProps) => {
  return (
    <div
      ref={ref}
      className={cn('flex max-w-4/5 shrink-0 items-center gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Typography-bearing value for the trailing side.
 * Reads size from DescriptionItemSizeContext to apply the correct typography.
 * Use this for plain text values. For Tag, Link, or other components,
 * place them directly in DescriptionItemTrailing with an explicit size prop.
 */
export const DescriptionItemValue = ({
  ref,
  children,
  className,
  ...props
}: DescriptionItemValueProps) => {
  const { size } = useDescriptionItemSizeContext({
    consumerName: 'DescriptionItemValue',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'min-w-0 truncate text-base',
        size === 'md' ? 'body-2-semi-bold' : 'body-3-semi-bold',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
