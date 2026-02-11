import React from 'react';

export type NavBarProps = {
  /**
   * The children of the NavBar, typically NavBarBackButton, NavBarTitle, NavBarTrailing, or NavBarCoinCapsule components.
   */
  children?: React.ReactNode;
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   */
  className?: string;
} & Omit<React.ComponentPropsWithRef<'nav'>, 'children' | 'className'>;

export type NavBarBackButtonProps = {
  /**
   * Callback function when the back button is clicked.
   */
  onClick?: () => void;
  /**
   * Accessible label for the back button.
   * @default "Go back"
   */
  'aria-label'?: string;
  /**
   * Additional custom CSS classes to apply.
   */
  className?: string;
} & React.ComponentPropsWithRef<'button'>;

export type NavBarTitleProps = {
  /**
   * The title text to display.
   */
  children: React.ReactNode;
  /**
   * The HTML element to render as.
   * Use this to control heading semantics and avoid multiple h1s on a page.
   * @default 'h1'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
  /**
   * Additional custom CSS classes to apply.
   */
  className?: string;
} & React.ComponentPropsWithRef<'h1'>;

export type NavBarTrailingProps = {
  /**
   * The trailing content, typically IconButton components.
   */
  children: React.ReactNode;
  /**
   * Additional custom CSS classes to apply.
   */
  className?: string;
};

/**
 * @internal
 * Props for the internal CoinCapsule component.
 */
export type CoinCapsuleProps = {
  /**
   * The cryptocurrency ticker symbol to display (e.g., "BTC", "ETH").
   */
  ticker: string;
  /**
   * The icon element to display (typically a crypto coin icon).
   */
  icon: React.ReactNode;
  /**
   * Additional custom CSS classes to apply.
   */
  className?: string;
} & React.ComponentPropsWithRef<'div'>;

/**
 * Props for the NavBarCoinCapsule component.
 */
export type NavBarCoinCapsuleProps = CoinCapsuleProps;
