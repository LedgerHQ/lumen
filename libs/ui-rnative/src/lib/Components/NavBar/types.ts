import { ReactElement, ReactNode } from 'react';
import { StyledViewProps } from '../../../styles';
import { IconButtonProps } from '../IconButton';

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
   * Accessible label for the back button.
   * @default Translated "Go back" from i18n
   */
  accessibilityLabel?: string;
} & Omit<
  IconButtonProps,
  'appearance' | 'size' | 'icon' | 'accessibilityLabel'
>;

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
  icon: ReactElement;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the NavBarCoinCapsule component.
 */
export type NavBarCoinCapsuleProps = CoinCapsuleProps;
