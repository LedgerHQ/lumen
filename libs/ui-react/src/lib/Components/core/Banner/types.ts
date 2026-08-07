import type { ComponentPropsWithRef, HTMLAttributes, ReactNode } from 'react';

export type BannerProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The type of banner which affects color and icon.
   * @default info
   */
  appearance?: 'info' | 'success' | 'warning' | 'error';
  /**
   * The main title of the banner.
   */
  title?: ReactNode;
  /**
   * Optional descriptive text.
   */
  description?: ReactNode;
  /**
   * Optional primary action.
   *
   */
  primaryAction?: ReactNode;
  /**
   * Optional secondary action.
   */
  secondaryAction?: ReactNode;
  /**
   * Optional close action.
   */
  onClose?: () => void;
  /**
   * Optional aria label for the close button.
   */
  closeAriaLabel?: string;
} & ComponentPropsWithRef<'div'>;
