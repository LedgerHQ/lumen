import type { ReactNode } from 'react';
import type { StyledTextProps, StyledViewProps } from '../../../styles';

export type DescriptionItemSize = 'sm' | 'md';

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

export type DescriptionItemLeadingProps = {
  /**
   * The leading content (DescriptionItemLabel + optional info icon sibling).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type DescriptionItemLabelProps = {
  /**
   * The label text or custom content.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

export type DescriptionItemTrailingProps = {
  /**
   * The trailing content (DescriptionItemValue, Tag, Link, etc.).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type DescriptionItemValueProps = {
  /**
   * The value text or custom content.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;
