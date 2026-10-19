import type { ReactNode } from 'react';
import type {
  StyledPressableProps,
  StyledTextProps,
  StyledViewProps,
} from '../../../../styles';

export type TileHorizontalAlignment = 'start' | 'center';

export type TileVerticalAlignment = 'start' | 'center';

export type TileContextValue = {
  horizontalAlignment: TileHorizontalAlignment;
};

export type TileProps = {
  /**
   * The visual style of the tile.
   * - `no-background`: Transparent background with pressed state
   * - `card`: Surface background with pressed state
   * @default 'no-background'
   */
  appearance?: 'no-background' | 'card';
  /**
   * Whether the tile is disabled.
   * When disabled, the tile will not respond to press events and will appear dimmed.
   * @default false
   */
  disabled?: boolean;
  /**
   * The horizontal alignment of the tile content, propagated to TileContent, TileTitle, TileDescription and TileTrailingContent.
   * @default 'center'
   */
  horizontalAlignment?: TileHorizontalAlignment;
  /**
   * The vertical alignment of the tile content.
   * Use `center` when the tile is stretched taller than its content, like a "Show more" tile in a grid.
   * @default 'start'
   */
  verticalAlignment?: TileVerticalAlignment;
  /**
   * Callback function when the tile is pressed.
   */
  onPress?: StyledPressableProps['onPress'];
  /**
   * Callback function when the tile is long pressed.
   * Can be used to perform secondary actions.
   */
  onLongPress?: StyledPressableProps['onLongPress'];
  /**
   * The children to display inside the tile.
   */
  children: ReactNode;
} & Omit<StyledPressableProps, 'onPress' | 'onLongPress' | 'disabled'>;

export type TileContentProps = {
  /**
   * The children to display inside the tile content area.
   * Typically contains TileTitle and TileDescription.
   */
  children: ReactNode;
} & StyledViewProps;

export type TileTitleProps = {
  /**
   * The title text to display.
   */
  children: ReactNode;
} & StyledTextProps;

export type TileDescriptionProps = {
  /**
   * The description text to display.
   */
  children: ReactNode;
} & StyledTextProps;

export type TileTrailingContentProps = {
  /**
   * The trailing content to display after title and description.
   * Typically contains Tags, custom labels, or other supplementary information.
   */
  children: ReactNode;
} & StyledViewProps;
