import {
  StyledPressableProps,
  StyledTextProps,
  StyledViewProps,
} from '../../../styles';

/**
 * Context value for passing state to sub-components
 */
export type ListItemContextValue = {
  disabled?: boolean;
};

/**
 * Props for the ListItem root component
 */
export type ListItemProps = {
  /**
   * The content of the list item (ListItemLeading, ListItemTrailing)
   */
  children: React.ReactNode;
  /**
   * Whether the list item is disabled.
   */
  disabled?: boolean;
  /**
   * Callback function when the list item is pressed.
   */
  onPress?: StyledPressableProps['onPress'];
} & Omit<StyledPressableProps, 'disabled' | 'children'>;

/**
 * Props for the ListItemLeading component
 */
export type ListItemLeadingProps = {
  /**
   * The content of the leading area (visual element + ListItemContent)
   */
  children: React.ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the ListItemContent component
 */
export type ListItemContentProps = {
  /**
   * The content (ListItemTitle, ListItemDescription)
   */
  children: React.ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the ListItemContentRow component
 */
export type ListItemContentRowProps = {
  /**
   * The row content (ListItemTitle or ListItemDescription alongside inline elements like Tag)
   */
  children: React.ReactNode;
} & Omit<StyledViewProps, 'children'>;

/**
 * Props for the ListItemTitle component
 */
export type ListItemTitleProps = {
  /**
   * The title text or custom content
   */
  children: React.ReactNode;
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the ListItemDescription component
 */
export type ListItemDescriptionProps = {
  /**
   * The description text or custom content
   */
  children: React.ReactNode;
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the ListItemTrailing component
 */
export type ListItemTrailingProps = {
  /**
   * The trailing content (icons, switches, values, etc.)
   */
  children: React.ReactNode;
} & Omit<StyledViewProps, 'children'>;
