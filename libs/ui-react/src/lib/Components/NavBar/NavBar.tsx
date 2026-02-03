import { cn } from '@ledgerhq/lumen-utils-shared';
import React from 'react';
import { useCommonTranslation } from '../../../i18n';
import { ArrowLeft } from '../../Symbols';
import { IconButton } from '../IconButton';
import { CoinCapsule } from './CoinCapsule';
import {
  NavBarBackButtonProps,
  NavBarCoinCapsuleProps,
  NavBarProps,
  NavBarTitleProps,
  NavBarTrailingProps,
} from './types';

/**
 * A coin capsule component for displaying cryptocurrency information within the NavBar.
 * Shows an icon and ticker symbol in a pill-shaped container.
 *
 * @example
 * import { NavBar, NavBarBackButton, NavBarCoinCapsule, NavBarTrailing } from '@ledgerhq/lumen-ui-react';
 * import { CryptoIcon } from '@ledgerhq/crypto-icons';
 *
 * <NavBarCoinCapsule ticker="BTC" icon={<CryptoIcon ledgerId="bitcoin" ticker="BTC" size="24px" />} />
 */
export const NavBarCoinCapsule = React.forwardRef<
  HTMLDivElement,
  NavBarCoinCapsuleProps
>(({ ticker, icon, className }, ref) => (
  <div className='flex flex-1 items-center' data-slot='navbar-coin-capsule'>
    <CoinCapsule ref={ref} ticker={ticker} icon={icon} className={className} />
  </div>
));
NavBarCoinCapsule.displayName = 'NavBarCoinCapsule';

/**
 * Back button component for the NavBar. Displays an arrow left icon button.
 *
 * @example
 * <NavBarBackButton onClick={() => navigate(-1)} />
 */
export const NavBarBackButton = React.forwardRef<
  HTMLButtonElement,
  NavBarBackButtonProps
>(({ onClick, 'aria-label': ariaLabel, className }, ref) => {
  const { t } = useCommonTranslation();

  return (
    <IconButton
      ref={ref}
      appearance='no-background'
      size='sm'
      icon={ArrowLeft}
      onClick={onClick}
      className={cn('shrink-0', className)}
      aria-label={ariaLabel ?? t('components.navBar.goBackAriaLabel')}
      data-slot='navbar-back-button'
    />
  );
});
NavBarBackButton.displayName = 'NavBarBackButton';

/**
 * Title component for the NavBar. Displays the navigation title text.
 * Use the `as` prop to control heading semantics and avoid multiple h1s on a page.
 *
 * @example
 * <NavBarTitle>Page Title</NavBarTitle>
 *
 * @example
 * // With custom heading level
 * <NavBarTitle as="h2">Page Title</NavBarTitle>
 */
export const NavBarTitle = React.forwardRef<HTMLElement, NavBarTitleProps>(
  ({ children, className, as: Component = 'h1' }, ref) => {
    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={cn(
          'min-w-0 flex-1 truncate heading-4-semi-bold text-base',
          className,
        )}
        data-slot='navbar-title'
      >
        {children}
      </Component>
    );
  },
);
NavBarTitle.displayName = 'NavBarTitle';

/**
 * Trailing container for the NavBar. Used to place elements on the right side of the navbar.
 *
 * @example
 * <NavBarTrailing>
 *   <IconButton icon={Settings} aria-label="Settings" />
 * </NavBarTrailing>
 */
export const NavBarTrailing = React.forwardRef<
  HTMLDivElement,
  NavBarTrailingProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('ml-auto flex shrink-0 items-center gap-4', className)}
      data-slot='navbar-trailing'
      {...props}
    >
      {children}
    </div>
  );
});
NavBarTrailing.displayName = 'NavBarTrailing';

/**
 * A navigation bar component for displaying page headers with optional back button, title, and trailing elements.
 * Uses a composable compound component API where you explicitly nest sub-components to define the layout.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/navigation-navbar-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/navigation-navbar-implementation--docs#dos-and-donts Guidelines}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the navbar's core appearance (colors, padding, etc).
 *
 * @example
 * // Basic NavBar with title
 * import { NavBar, NavBarBackButton, NavBarTitle, NavBarTrailing } from '@ledgerhq/lumen-ui-react';
 *
 * <NavBar>
 *   <NavBarBackButton onClick={() => navigate(-1)} />
 *   <NavBarTitle>Page Title</NavBarTitle>
 *   <NavBarTrailing>
 *     <IconButton icon={Settings} aria-label="Settings" />
 *   </NavBarTrailing>
 * </NavBar>
 *
 * @example
 * // NavBar with NavBarCoinCapsule for crypto assets
 * import { CryptoIcon } from '@ledgerhq/crypto-icons';
 *
 * <NavBar>
 *   <NavBarBackButton onClick={handleBack} />
 *   <NavBarCoinCapsule ticker="BTC" icon={<CryptoIcon ledgerId="bitcoin" ticker="BTC" size="24px" />} />
 *   <NavBarTrailing>
 *     <IconButton icon={MoreHorizontal} aria-label="More options" />
 *   </NavBarTrailing>
 * </NavBar>
 */
export const NavBar = React.forwardRef<HTMLElement, NavBarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn('flex items-center gap-4', className)}
        data-slot='navbar'
        {...props}
      >
        {children}
      </nav>
    );
  },
);
NavBar.displayName = 'NavBar';
