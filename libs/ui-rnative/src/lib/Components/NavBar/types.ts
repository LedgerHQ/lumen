import { ReactElement, ReactNode } from 'react';
import { StyledViewProps } from '../../../styles';
import { IconButtonProps } from '../IconButton';

export type NavBarAppearance = 'compact' | 'expanded';

export type NavBarProps = {
  /**
   * Controls the appearance/layout of the NavBar.
   * - 'compact': Content displayed vertically, centered with standard spacing
   * - 'expanded': Content displayed vertically, left-aligned with increased spacing
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

export type NavBarContentProps = {
  /**
   * The content to display in the NavBar.
   * Should contain NavBarTitle, NavBarDescription, NavBarCoinCapsule, or other React nodes.
   * Content is always displayed vertically (column layout).
   * Compact mode centers content, expanded mode left-aligns with more spacing.
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

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
