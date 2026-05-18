import type { ReactNode } from 'react';
import type { StyledTextProps, StyledViewProps } from '../../../styles';

export type DescriptionItemSize = 'sm' | 'md';

/**
 * Props for the DescriptionItem root component
 */
export type DescriptionItemProps = {
  /**
   * The content of the description item (DescriptionItemLeading, DescriptionItemTrailing).
   */
  children: ReactNode;
  /**
   * The size of the description item.
   * @default 'md'
   */
  size?: DescriptionItemSize;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the DescriptionItemLeading component
 */
export type DescriptionItemLeadingProps = {
  /**
   * The leading content (DescriptionItemLabel + optional info icon sibling).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the DescriptionItemLabel component
 */
export type DescriptionItemLabelProps = {
  /**
   * The label text or custom content.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the DescriptionItemTrailing component
 */
export type DescriptionItemTrailingProps = {
  /**
   * The trailing content (DescriptionItemValue, Tag, Link, etc.).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the DescriptionItemValue component
 */
export type DescriptionItemValueProps = {
  /**
   * The value text or custom content.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;
