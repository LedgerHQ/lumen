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
   * Custom classname.
   */
  className?: string;
  /**
   * The banner content (MediaBannerTitle, MediaBannerDescription).
   */
  children: ReactNode;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

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
