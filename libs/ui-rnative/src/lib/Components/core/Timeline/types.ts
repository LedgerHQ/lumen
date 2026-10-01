import type { ReactNode } from 'react';
import type { StyledTextProps, StyledViewProps } from '../../../../styles';

export type TimelineItemStatus =
  | 'idle'
  | 'success'
  | 'error'
  | 'pending'
  | 'loading';

/**
 * Props for the Timeline root.
 */
export type TimelineProps = {
  /**
   * The timeline items.
   * @required
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for one timeline item.
 */
export type TimelineItemProps = {
  /**
   * Indicator and title tone. Omit it for a neutral item.
   * @default undefined
   */
  status?: TimelineItemStatus;
  /**
   * Header and content of the item.
   * @required
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the row beside the indicator.
 */
export type TimelineItemHeaderProps = {
  /**
   * Leading and trailing parts.
   * @required
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the text column opposite the trailing slot.
 */
export type TimelineItemLeadingProps = {
  /**
   * Caption, title, and description.
   * @required
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for a horizontal row inside the leading column.
 */
export type TimelineItemLeadingRowProps = {
  /**
   * A title or description beside an optional tag.
   * @required
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the overline above the title.
 */
export type TimelineItemCaptionProps = {
  /**
   * Overline text. A date is the common case.
   * @required
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the item title.
 */
export type TimelineItemTitleProps = {
  /**
   * Title text.
   * @required
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the description under the title.
 */
export type TimelineItemDescriptionProps = {
  /**
   * Description text.
   * @required
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the end-aligned header slot.
 */
export type TimelineItemTrailingProps = {
  /**
   * Amount, tag, or text. A string or number is wrapped so it can render.
   * @required
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the block under the header.
 */
export type TimelineItemBodyProps = {
  /**
   * Content indented past the indicator. A string or number is wrapped so it can render.
   * @required
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;
