import { ReactNode } from 'react';

export type NavBarProps = {
  /**
   * The children of the NavBar, typically NavBarBackButton, NavBarTitle, NavBarTrailing, or NavBarCoinCapsule components.
   */
  children?: ReactNode;
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   */
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className'>;

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
};

export type NavBarTitleProps = {
  /**
   * The title text to display.
   */
  children: ReactNode;
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
};

export type NavBarTrailingProps = {
  /**
   * The trailing content, typically IconButton components.
   */
  children: ReactNode;
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
  icon: ReactNode;
  /**
   * Additional custom CSS classes to apply.
   */
  className?: string;
};

/**
 * Props for the NavBarCoinCapsule component.
 */
export type NavBarCoinCapsuleProps = CoinCapsuleProps;
