import { ReactNode } from 'react';
import { StyledPressableProps, StyledViewProps } from '../../../styles';

export type NavBarAppearance = 'compact' | 'expanded' | 'with-asset';

export type NavBarProps = {
  /**
   * Controls the appearance/layout of the NavBar.
   * - 'compact': Standard height
   * - 'expanded': Increased height
   * - 'with-asset': Special layout for displaying asset/coin info
   */
  appearance: NavBarAppearance;
} & StyledViewProps;

export type NavBarBackButtonProps = {
  /**
   * Callback function when the back button is clicked.
   */
  onPress?: () => void;
  /**
   * Accessible label for the back button.
   * @default "Go back"
   */
  accessibilityLabel?: string;
} & Omit<StyledPressableProps, 'onPress'>;

export type NavBarTitleProps = {
  /**
   * The title text to display.
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type NavBarDescriptionProps = {
  /**
   * The description text to display.
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

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
