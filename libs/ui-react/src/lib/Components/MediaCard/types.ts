import type { ComponentPropsWithRef, ReactNode } from 'react';

export type MediaCardProps = {
  /**
   * The source URL for the background image.
   */
  imageUrl: string;
  /**
   * The text content displayed at the bottom of the card.
   * Supports rich text via inline elements (e.g. styled spans).
   */
  text: ReactNode;
  /**
   * Optional content displayed above the text, such as tags or icons.
   */
  leadingContent?: ReactNode;
  /**
   * Callback fired when the card is pressed.
   */
  onClick: () => void;
  /**
   * Callback fired when the close button is pressed.
   */
  onClose: () => void;
  /**
   * Additional CSS classes for the card.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;
