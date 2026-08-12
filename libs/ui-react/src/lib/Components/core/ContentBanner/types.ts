import type { ComponentPropsWithRef, ReactNode } from 'react';

/**
 * Props for the ContentBanner root component
 */
export type ContentBannerProps = {
  /**
   * The content of the content banner (ContentBannerContent, ContentBannerTitle, ContentBannerDescription, or any leading element)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
  /**
   * Optional close action.
   */
  onClose?: () => void;
  /**
   * Optional aria label for the close button.
   */
  closeAriaLabel?: string;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

/**
 * Props for the ContentBannerContent component
 */
export type ContentBannerContentProps = {
  /**
   * The content (ContentBannerTitle, ContentBannerDescription)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

/**
 * Props for the ContentBannerTitle component
 */
export type ContentBannerTitleProps = {
  /**
   * The title text or custom content
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

/**
 * Props for the ContentBannerDescription component
 */
export type ContentBannerDescriptionProps = {
  /**
   * The description text or custom content
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;
