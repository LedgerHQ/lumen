import type { ReactNode } from 'react';
import { StyledPressableProps, StyledTextProps } from '../../../styles';

/**
 * Props for the MediaCard root component
 */
export type MediaCardProps = {
  /**
   * The source URL for the background image.
   */
  imageUrl: string;
  /**
   * Callback fired when the card is pressed.
   */
  onPress?: () => void;
  /**
   * Callback fired when the close button is pressed.
   */
  onClose?: () => void;
  /**
   * Optional accessibility label for the close button.
   */
  closeAccessibilityLabel?: string;
  /**
   * The card content — typically a `MediaCardTitle` and optional
   * leading content such as tags or icons.
   */
  children: ReactNode;
} & Omit<StyledPressableProps, 'children' | 'onPress'>;

/**
 * Props for the MediaCardTitle component
 */
export type MediaCardTitleProps = {
  /**
   * The title text or custom content.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;
