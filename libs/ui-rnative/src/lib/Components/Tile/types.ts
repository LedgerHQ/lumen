import { ReactNode } from 'react';
import {
  StyledPressableProps,
  StyledTextProps,
  StyledViewProps,
} from '../../../styles';
import { DiscriminatedSpotProps, SpotSize } from '../Spot/types';

export type TileContextValue = {
  disabled: boolean;
};

export type TileSpotSize = Extract<SpotSize, 40 | 48>;

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
   * Whether the tile content should be centered vertically.
   * Useful when the tile has a fixed height and you want the content centered.
   * @default false
   */
  centered?: boolean;
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

export type TileSpotProps = {
  /**
   * The size of the spot.
   * @default 48
   */
  size?: 40 | 48;
} & DiscriminatedSpotProps;

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
