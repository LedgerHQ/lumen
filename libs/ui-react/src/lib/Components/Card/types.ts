import type {
  ComponentPropsWithRef,
  MouseEventHandler,
  ReactNode,
} from 'react';

export type CardType = 'interactive' | 'expandable' | 'info';

export type CardContextValue = {
  cardClickable: boolean;
  headerClickable: boolean;
  footerExpanded: boolean;
  onHeaderClick?: MouseEventHandler<HTMLDivElement>;
};

export type CardContentAlignContextValue = {
  align?: 'left' | 'right';
};

export type CardProps = {
  /**
   * The interaction mode of the card.
   * - `'interactive'` (default): whole card is clickable with hover/pressed states.
   * - `'expandable'`: only the header is clickable, toggles footer visibility.
   * - `'info'`: data-display only, no built-in click handling.
   * @default 'interactive'
   */
  type?: CardType;
  /**
   * Whether the card footer is expanded (visible).
   * Only relevant when `type="expandable"`.
   * When `false`, CardFooter is hidden.
   */
  expanded?: boolean;
  /**
   * Whether the card shows a selection outline.
   */
  outlined?: boolean;
  /**
   * Whether the card is disabled.
   */
  disabled?: boolean;
  /**
   * The card content (CardHeader, CardFooter, etc.).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type CardHeaderProps = {
  /**
   * The header content (CardLeading, CardTrailing).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type CardLeadingProps = {
  /**
   * The leading content (icon + CardContent).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type CardContentProps = {
  /**
   * The content (CardContentTitle, CardContentDescription).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type CardContentTitleProps = {
  /**
   * The title text or custom inline content.
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type CardContentDescriptionProps = {
  /**
   * The description text or custom inline content.
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type CardContentRowProps = {
  /**
   * The row content (CardContentTitle or CardContentDescription alongside additional elements like Tag).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type CardTrailingProps = {
  /**
   * The trailing content (Button, Tag, CardContent, etc.).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type CardFooterProps = {
  /**
   * The footer content (DescriptionList, Button, etc.).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type CardFooterActionsProps = {
  /**
   * The action buttons to display in a horizontal row.
   */
  children: ReactNode;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;
