import type { ComponentPropsWithRef, ReactNode } from 'react';

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
   * Optional aria label for the close button.
   */
  closeAriaLabel?: string;
  /**
   * Custom classname.
   */
  className?: string;
  /**
   * The banner content (MediaBannerTitle, MediaBannerDescription).
   */
  children: ReactNode;
  /**
   * When `true`, shows a muted appearance on the banner.
   * @default false
   */
  disabled?: boolean;
} & Omit<ComponentPropsWithRef<'button'>, 'children'>;

/**
 * Props for the MediaBannerTitle component.
 */
export type MediaBannerTitleProps = {
  /**
   * The title text content.
   */
  children: ReactNode;
  /**
   * Custom classname.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

/**
 * Props for the MediaBannerDescription component.
 */
export type MediaBannerDescriptionProps = {
  /**
   * The description text content.
   */
  children: ReactNode;
  /**
   * Custom classname.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;
