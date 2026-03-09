import { ReactNode } from 'react';
import { GestureResponderEvent } from 'react-native';
import { StyledTextProps, StyledViewProps } from '../../../styles';

export type CardType = 'interactive' | 'expandable' | 'info';

export type CardContextValue = {
  cardPressable: boolean;
  headerPressable: boolean;
  footerExpanded: boolean;
  onHeaderPress?: (event: GestureResponderEvent) => void;
};

export type CardContentAlignContextValue = {
  align?: 'left' | 'right';
};

export type CardDisabledContextValue = {
  disabled: boolean;
};

export type CardProps = {
  /**
   * The interaction mode of the card.
   * - `'interactive'` (default): whole card is pressable with pressed states.
   * - `'expandable'`: only the header is pressable, toggles footer visibility.
   * - `'info'`: data-display only, no built-in press handling.
   * @default 'interactive'
   */
  type?: CardType;
  /**
   * Whether the card footer is expanded (visible).
   * Only relevant when `type="expandable"`.
   * When `false`, CardFooter is hidden. When `undefined`, CardFooter is always visible.
   */
  expanded?: boolean;
  /**
   * Whether the card shows a selection outline.
   * @default false
   */
  outlined?: boolean;
  /**
   * Whether the card is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback function when the card is pressed.
   * For `type="interactive"`, the whole card responds.
   * For `type="expandable"`, the header responds.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * The card content (CardHeader, CardFooter, etc.).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'onPress' | 'disabled' | 'children'>;

export type CardHeaderProps = {
  /**
   * The header content (CardLeading, CardTrailing).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type CardLeadingProps = {
  /**
   * The leading content (icon + CardContent).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type CardContentProps = {
  /**
   * The content (CardContentTitle, CardContentDescription).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type CardContentTitleProps = {
  /**
   * The title text or custom inline content.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

export type CardContentDescriptionProps = {
  /**
   * The description text or custom inline content.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

export type CardContentRowProps = {
  /**
   * The row content (CardContentTitle or CardContentDescription
   * alongside additional elements like Tag).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type CardTrailingProps = {
  /**
   * The trailing content (Button, Tag, CardContent, etc.).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type CardFooterProps = {
  /**
   * The footer content (DescriptionList, Button, etc.).
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type CardFooterActionsProps = {
  /**
   * The action buttons to display in a horizontal row.
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;
