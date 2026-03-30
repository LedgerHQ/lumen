import {
  LumenTextStyle,
  StyledPressableProps,
  StyledTextProps,
  StyledViewProps,
} from '../../../styles';
import { DiscriminatedSpotProps } from '../Spot';

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

/**
 * Props for the ListItemTruncate component
 * Used to truncate text that should when ListItemDescription or ListItemTitle contain custom content
 */
export type ListItemTruncateProps = {
  /**
   * The text content to truncate
   */
  children: string;
  /**
   * The variant determines typography and color styling.
   * Use 'title' inside ListItemTitle and 'description' inside ListItemDescription.
   * @default 'description'
   */
  variant?: 'title' | 'description';
} & Omit<StyledTextProps, 'children'>;

/**
 * Props for the ListItemSpot component
 * Spot adapter that inherits disabled state from parent ListItem
 */
export type ListItemSpotProps = DiscriminatedSpotProps &
  Omit<StyledViewProps, 'children'>;

/**
 * Props for the ListItemIcon component
 */
export type ListItemIconProps = {
  /**
   * The icon component to render
   */
  icon: React.ComponentType<any>;
  /**
   * Optional color override. If not provided, uses theme color with disabled state handling.
   */
  color?: LumenTextStyle['color'];
} & Omit<StyledViewProps, 'children'>;
