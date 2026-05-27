import type { ReactNode } from 'react';
import type { StyledPressableProps, StyledTextProps } from '../../../styles';

/**
 * Props for the MediaBanner root component.
 */
export type MediaBannerProps = {
  /**
   * URL of the background image displayed on the right side.
   */
  imageUrl: string;
  /**
   * Optional close action callback.
   */
  onClose?: () => void;
  /**
   * Optional accessibility label for the close button.
   */
  closeAccessibilityLabel?: string;
  /**
   * The banner content (MediaBannerTitle, MediaBannerDescription).
   */
  children: ReactNode;
} & Omit<StyledPressableProps, 'children'>;

/**
 * Props for the MediaBannerTitle component.
 */
export type MediaBannerTitleProps = {
  /**
   * The title text content.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the MediaBannerDescription component.
 */
export type MediaBannerDescriptionProps = {
  /**
   * The description text content.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;
