import { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { IconProps } from '../Icon';
import { DiscriminatedSpotProps, SpotSize } from '../Spot/types';

export type TileContextValue = {
  disabled: boolean;
};

export type TileSpotSize = Extract<SpotSize, 40 | 48>;

export type TileProps = {
  /**
   * The visual appearance of the tile background.
   * - `no-background`: Transparent background (shows hover state)
   * - `card`: Surface background color
   * @default "no-background"
   */
  appearance?: 'no-background' | 'card';
  /**
   * Whether the tile is disabled.
   * When disabled, the tile is non-interactive and has disabled styles.
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
   * The function to call when the tile is clicked.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * The children to display inside the tile.
   * Can include TileSpot, TileContent, TileTitle, TileDescription, TileSecondaryAction, and any custom content.
   */
  children: ReactNode;
  /**
   * Additional CSS classes for the tile container.
   * Should only be used for layout adjustments like margins or positioning.
   */
  className?: string;
  /**
   * Aria label for accessibility.
   */
  'aria-label'?: string;
  /**
   * The secondary action to display inside the tile.
   * Typically contains a TileSecondaryAction component.
   */
  secondaryAction?: ReactNode;
  ref?: React.Ref<HTMLDivElement>;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'>;

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
  /**
   * Additional CSS classes for the content container.
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type TileTitleProps = {
  /**
   * The title text to display.
   */
  children: ReactNode;
  /**
   * Additional CSS classes for the title.
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type TileDescriptionProps = {
  /**
   * The description text to display.
   */
  children: ReactNode;
  /**
   * Additional CSS classes for the description.
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type TileTrailingContentProps = {
  /**
   * The trailing content to display after title and description.
   * Typically contains Tags, custom labels, or other supplementary information.
   */
  children: ReactNode;
  /**
   * Additional CSS classes for the trailing content container.
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type TileSecondaryActionProps = {
  /**
   * The function to call when the secondary action is clicked.
   */
  onClick?: MouseEventHandler;
  /**
   * Icon component to render inside the InteractiveIcon.
   */
  icon: React.ComponentType<Omit<IconProps, 'children'>>;
  /**
   * Additional CSS classes for the secondary action container.
   */
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'>;
