import { cn } from '@ledgerhq/lumen-utils-shared';
import { ChevronRight, Information } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import {
  SubheaderActionProps,
  SubheaderCountProps,
  SubheaderDescriptionProps,
  SubheaderInfoProps,
  SubheaderProps,
  SubheaderRowProps,
  SubheaderShowMoreProps,
  SubheaderTitleProps,
} from './types';

/**
 * Title component for the Subheader. Displays the main heading.
 * Use the `as` prop to control heading semantics and avoid multiple h2s on a page.
 *
 * @example
 * <SubheaderTitle>Section Title</SubheaderTitle>
 *
 * @example
 * // With custom heading level
 * <SubheaderTitle as="h3">Section Title</SubheaderTitle>
 */
export const SubheaderTitle = ({
  children,
  as: Component = 'h2',
  className,
  ...props
}: SubheaderTitleProps) => {
  return (
    <Component
      className={cn(
        'min-w-0 truncate heading-4-semi-bold text-base',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Row component for the Subheader. Layout container to horizontally align title, count, hint, and action.
 * Can optionally be interactive with an onClick handler.
 */
export const SubheaderRow = ({
  children,
  onClick,
  className,
  ...props
}: SubheaderRowProps) => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={cn(
        'flex items-center gap-4',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Count component for the Subheader. Displays a formatted number.
 */
export const SubheaderCount = ({
  value,
  format,
  className,
  ...props
}: SubheaderCountProps) => {
  const formatted = format ? format(value) : `(${value})`;
  return (
    <span
      className={cn('shrink-0 pl-2 body-2 text-muted', className)}
      {...props}
    >
      {formatted}
    </span>
  );
};

/**
 * Info component for the Subheader. Displays an information icon that can be wrapped in a Tooltip.
 */
export const SubheaderInfo = ({
  ref,
  iconType = 'stroked',
  className,
  ...props
}: SubheaderInfoProps) => {
  return (
    <span className='flex shrink-0 items-center'>
      <InteractiveIcon
        ref={ref}
        iconType={iconType}
        className={className}
        aria-label='More information'
        {...props}
      >
        <Information size={16} />
      </InteractiveIcon>
    </span>
  );
};
SubheaderInfo.displayName = 'SubheaderInfo';

/**
 * ShowMore component for the Subheader. Displays a static chevron right icon to indicate expandable content.
 * Position this after SubheaderCount and before other elements.
 */
export const SubheaderShowMore = ({
  className,
  ...props
}: SubheaderShowMoreProps) => {
  return (
    <InteractiveIcon className='-ml-2' iconType='stroked' {...props}>
      <ChevronRight size={20} />
    </InteractiveIcon>
  );
};

/**
 * Description component for the Subheader. Displays descriptive text below the title row.
 */
export const SubheaderDescription = ({
  children,
  className,
  ...props
}: SubheaderDescriptionProps) => {
  return (
    <p className={cn('body-3 text-muted', className)} {...props}>
      {children}
    </p>
  );
};

/**
 * Action component for the Subheader. Displays an interactive text button.
 * Automatically positions itself at the end of the row using ml-auto.
 */
export const SubheaderAction = ({
  children,
  onClick,
  className,
  ...props
}: SubheaderActionProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'ml-auto shrink-0 cursor-pointer pl-8 body-2 text-interactive',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * A subheader component for displaying section titles with optional count, hints, descriptions, and action elements.
 * Uses a composable API where you explicitly nest sub-components to define the layout.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/misc-subheader-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/misc-subheader-implementation--docs#dos-and-donts Guidelines}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the subheader's core appearance (colors, padding, etc).
 *
 * @example
 * // Simple subheader without row
 * <Subheader>
 *   <SubheaderTitle>Section Title</SubheaderTitle>
 *   <SubheaderDescription>Description text</SubheaderDescription>
 * </Subheader>
 *
 * @example
 * // Subheader with row for horizontal layout
 * <Subheader>
 *   <SubheaderRow>
 *     <SubheaderTitle>Section Title</SubheaderTitle>
 *     <SubheaderCount value={30} />
 *     <Tooltip>
 *       <TooltipTrigger>
 *         <SubheaderInfo />
 *       </TooltipTrigger>
 *       <TooltipContent>Additional information</TooltipContent>
 *     </Tooltip>
 *   </SubheaderRow>
 *   <SubheaderDescription>Description text</SubheaderDescription>
 * </Subheader>
 *
 * @example
 * // Interactive row with action
 * <Subheader>
 *   <SubheaderRow onClick={handleClick}>
 *     <SubheaderTitle>Accounts</SubheaderTitle>
 *     <SubheaderCount value={12} />
 *   </SubheaderRow>
 * </Subheader>
 */
export const Subheader = ({
  className,
  children,
  ...props
}: SubheaderProps) => {
  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      {children}
    </div>
  );
};
