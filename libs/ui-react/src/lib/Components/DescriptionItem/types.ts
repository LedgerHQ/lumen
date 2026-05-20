import type { ComponentPropsWithRef, ReactNode } from 'react';

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
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type DescriptionItemLeadingProps = {
  /**
   * The leading content (DescriptionItemLabel + optional info icon sibling).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type DescriptionItemLabelProps = {
  /**
   * The label text or custom content.
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type DescriptionItemTrailingProps = {
  /**
   * The trailing content (DescriptionItemValue, Tag, Link, etc.).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type DescriptionItemValueProps = {
  /**
   * The value text or custom content.
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;
