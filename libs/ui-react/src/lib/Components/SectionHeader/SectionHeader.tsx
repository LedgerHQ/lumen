import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type {
  SectionHeaderLeadingProps,
  SectionHeaderProps,
  SectionHeaderTitleProps,
} from './types';

const sectionHeaderVariants = cva('inline-flex items-center gap-4', {
  variants: {
    appearance: {
      'no-background': '',
      card: 'rounded bg-surface px-8 py-1',
    },
  },
  defaultVariants: {
    appearance: 'no-background',
  },
});

/**
 * Leading slot for the SectionHeader. Use for optional icons or other leading content.
 *
 * @example
 * <SectionHeaderLeading>
 *   <Settings size={16} />
 * </SectionHeaderLeading>
 */
export const SectionHeaderLeading = ({
  children,
  className,
  ...props
}: SectionHeaderLeadingProps) => {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center', className)}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * Title component for the SectionHeader. Displays the muted label text.
 *
 * @example
 * <SectionHeaderTitle>Label</SectionHeaderTitle>
 */
export const SectionHeaderTitle = ({
  children,
  className,
  ...props
}: SectionHeaderTitleProps) => {
  return (
    <span className={cn('body-2-semi-bold text-muted', className)} {...props}>
      {children}
    </span>
  );
};

/**
 * A compact section label used to title grouped content areas.
 * Uses a composable API where you explicitly nest sub-components to define the layout.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-sectionheader--docs Guidelines}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the section header's core appearance (colors, padding, etc).
 *
 * @example
 * <SectionHeader>
 *   <SectionHeaderTitle>Label</SectionHeaderTitle>
 * </SectionHeader>
 */
export const SectionHeader = ({
  appearance = 'no-background',
  className,
  children,
  ...props
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(sectionHeaderVariants({ appearance }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
