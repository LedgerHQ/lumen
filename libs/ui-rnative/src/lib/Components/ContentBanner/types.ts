import React from 'react';
import { StyledTextProps, StyledViewProps } from '../../../styles';

/**
 * Props for the ContentBanner root component
 */
export type ContentBannerProps = {
  /**
   * The content of the content banner (ContentBannerContent, ContentBannerTitle, ContentBannerDescription, or any leading element)
   */
  children: React.ReactNode;
  /**
   * Optional close action.
   */
  onClose?: () => void;
  /**
   * Optional accessibility label for the close button.
   */
  closeAccessibilityLabel?: string;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the ContentBannerContent component
 */
export type ContentBannerContentProps = {
  /**
   * The content (ContentBannerTitle, ContentBannerDescription)
   */
  children: React.ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the ContentBannerTitle component
 */
export type ContentBannerTitleProps = {
  /**
   * The title text or custom content
   */
  children: React.ReactNode;
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the ContentBannerDescription component
 */
export type ContentBannerDescriptionProps = {
  /**
   * The description text or custom content
   */
  children: React.ReactNode;
} & Omit<StyledTextProps, 'children'>;
