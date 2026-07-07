import {
  cn,
  createSafeContext,
  type Priority,
} from '@ledgerhq/lumen-utils-shared';

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

const [DescriptionItemPriorityProvider, useDescriptionItemPriorityContext] =
  createSafeContext<{ priority?: Priority }>('DescriptionItemPriority', {
    priority: undefined,
  });

/**
 * A compound component for displaying a key-value description row.
 * Composed with DescriptionItemLeading / DescriptionItemLabel (key side)
 * and DescriptionItemTrailing / DescriptionItemValue (value side).
 *
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-descriptionitem--docs Storybook}
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
  priority = 'end',
  ...props
}: DescriptionItemProps) => {
  return (
    <DescriptionItemSizeProvider value={{ size }}>
      <DescriptionItemPriorityProvider value={{ priority }}>
        <div
          ref={ref}
          className={cn(
            'flex w-full items-start gap-12 overflow-hidden',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </DescriptionItemPriorityProvider>
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
  const { priority } = useDescriptionItemPriorityContext({
    consumerName: 'DescriptionItemLeading',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 grow items-center gap-4',
        priority === 'end' ? 'shrink' : 'shrink-0',
        className,
      )}
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
        'line-clamp-1 min-w-0 wrap-break-word text-ellipsis text-muted',
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
  const { priority } = useDescriptionItemPriorityContext({
    consumerName: 'DescriptionItemTrailing',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex max-w-4/5 items-center gap-4',
        priority === 'start' ? 'min-w-0 shrink' : 'shrink-0',
        className,
      )}
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
