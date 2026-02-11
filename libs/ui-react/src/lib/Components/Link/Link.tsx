import { cn } from '@ledgerhq/lumen-utils-shared';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';
import { ExternalLink } from '../../Symbols';
import { IconSize } from '../Icon/types';
import { LinkProps } from './types';

const linkVariants = cva(
  'inline-flex w-fit max-w-full items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus',
  {
    variants: {
      appearance: {
        base: 'text-base hover:text-base-hover active:text-base-pressed',
        accent:
          'text-interactive hover:text-interactive-hover active:text-interactive-pressed',
        inherit: '',
      },
      size: {
        sm: 'gap-4 body-2-semi-bold',
        md: 'gap-8 body-1-semi-bold',
        inherit: '',
      },
      underline: {
        true: 'underline underline-offset-2',
        false: '',
      },
    },
    defaultVariants: {
      appearance: 'inherit',
      size: 'inherit',
      underline: true,
    },
  },
);

/**
 * A customizable link component that supports base and accent color appearances, optional underline, sizes, icons, and external link handling.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-link-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/components-link-implementation--docs#dos-and-donts Guidelines}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the link's core appearance (colors, padding, etc). Use the `appearance` and `underline` props instead.
 *
 * @example
 * import { Link } from '@ledgerhq/lumen-ui-react';
 *
 * // Default link with underline and inherited appearance and size
 * <Link href="/page">
 *   Go to Page
 * </Link>
 *
 * // Accent link with icon
 * import { ArrowRight } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Link appearance="accent" size="sm" href="https://example.com" isExternal icon={ArrowRight}>
 *   External Site
 * </Link>
 *
 * // Link with inherited styles
 * <Link appearance="inherit" size="inherit" href="/page">
 *   Inherit Styles
 * </Link>
 *
 * // Link as a router link (asChild pattern)
 * import { Link as RouterLink } from 'react-router-dom';
 *
 * <Link asChild>
 *   <RouterLink to="/dashboard">Dashboard</RouterLink>
 * </Link>
 *
 * // Note: When using asChild, the child element is responsible for its own content.
 * // Icons and other Link props like 'icon' are ignored when asChild is true - handle these in the child if needed.
 */
export const Link = ({
  ref,
  className,
  children,
  appearance,
  size = 'inherit',
  underline = true,
  icon,
  isExternal = false,
  asChild = false,
  ...props
}: LinkProps) => {
  const iconSizeMap: { [key: string]: IconSize } = {
    sm: 16,
    md: 20,
  };

  const calculatedIconSize = size ? iconSizeMap[size] : 20;
  const IconComponent = icon;

  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      className={cn(
        className,
        linkVariants({
          appearance,
          size,
          underline,
        }),
      )}
      target={isExternal && !asChild ? '_blank' : undefined}
      rel={isExternal && !asChild ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {IconComponent && (
            <IconComponent size={calculatedIconSize} className='shrink-0' />
          )}
          <span className='min-w-0 truncate'>{children}</span>
          {isExternal && (
            <>
              <ExternalLink
                size={calculatedIconSize}
                className='shrink-0'
                aria-hidden='true'
              />
              <span className='sr-only'>(opens in a new tab)</span>
            </>
          )}
        </>
      )}
    </Comp>
  );
};
Link.displayName = 'Link';
