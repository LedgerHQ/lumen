import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { ChevronRight } from '../../Symbols';
import { CardButtonProps } from './types';

const buttonVariants = cva(
  'inline-flex h-fit w-full cursor-pointer items-center gap-12 rounded-sm p-12 transition-colors focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-default disabled:text-disabled',
  {
    variants: {
      appearance: {
        base: 'bg-surface text-base hover:bg-surface-hover active:bg-surface-pressed disabled:bg-disabled',
        outline:
          'bg-base-transparent text-base outline-dashed outline-1 outline-muted-subtle hover:bg-base-transparent-hover hover:outline-muted-subtle-hover focus-visible:outline-hidden focus-visible:outline-offset-0 active:bg-base-transparent-pressed active:outline-muted-subtle-pressed disabled:bg-base-transparent disabled:outline-disabled',
      },
    },
    defaultVariants: {
      appearance: 'base',
    },
  },
);

/**
 * A customizable card button component that displays an optional icon, a required title, an optional description, and an optional chevron arrow.
 *
 * It supports different appearances. takes full width by default. The chevron can be hidden if needed.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/action-cardbutton--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/action-cardbutton--docs#dos-and-donts Guidelines}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the card button's core appearance (colors, padding, etc). Use the `appearance` prop instead.
 *
 * @example
 * // Basic card button
 * import { CardButton } from '@ledgerhq/lumen-ui-react';
 *
 * <CardButton title="Click Me" onClick={() => console.log('Clicked!')} />
 *
 * // Card button with icon and description
 * import { CardButton } from '@ledgerhq/lumen-ui-react';
 * import { Info } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CardButton
 *   icon={Info}
 *   title="Information"
 *   description="Additional details here"
 *   appearance="outline"
 * />
 */
export const CardButton = ({
  ref,
  className,
  appearance,
  icon,
  title,
  description,
  hideChevron,
  ...props
}: CardButtonProps) => {
  const IconComponent = icon;

  return (
    <button
      ref={ref}
      className={cn(
        className,
        buttonVariants({
          appearance,
        }),
      )}
      disabled={props.disabled}
      {...props}
    >
      {IconComponent && <IconComponent size={24} className='shrink-0' />}
      <div className='flex min-w-0 flex-1 flex-col gap-4 text-left'>
        <div className='min-w-0 truncate body-2-semi-bold'>{title}</div>
        {description && (
          <div className='line-clamp-2 min-w-0 body-3 text-muted'>
            {description}
          </div>
        )}
      </div>
      {!hideChevron && <ChevronRight size={24} className='shrink-0' />}
    </button>
  );
};
CardButton.displayName = 'CardButton';
