import React from 'react';
import {
  StyledPressableProps,
  StyledTextProps,
  StyledViewProps,
} from '../../../styles';

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
  onPress: () => void;
  /**
   * Callback fired when the close button is pressed.
   */
  onClose: () => void;
  /**
   * The content of the card (MediaCardLeadingContent, MediaCardTrailingContent).
   */
  children: React.ReactNode;
} & Omit<StyledPressableProps, 'children' | 'onPress'>;

/**
 * Props for the MediaCardLeadingContent component
 */
export type MediaCardLeadingContentProps = {
  /**
   * The leading content (tags, badges, icons).
   */
  children: React.ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the MediaCardTrailingContent component
 */
export type MediaCardTrailingContentProps = {
  /**
   * The trailing content (MediaCardTitle, MediaCardDescription).
   */
  children: React.ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the MediaCardTitle component
 */
export type MediaCardTitleProps = {
  /**
   * The title text or custom content.
   */
  children: React.ReactNode;
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the MediaCardDescription component
 */
export type MediaCardDescriptionProps = {
  /**
   * The description text or custom content.
   */
  children: React.ReactNode;
} & Omit<StyledTextProps, 'children'>;
