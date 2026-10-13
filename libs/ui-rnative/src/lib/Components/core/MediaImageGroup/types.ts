import type { ReactNode } from 'react';
import type { StyledViewProps } from '../../../../styles';
import type { MediaImageProps } from '../MediaImage';

export type MediaImageGroupItem = {
  /**
   * Stable identifier of the item, used as its React key. Falls back to the
   * item's index.
   * @optional
   */
  id?: string;
} & Omit<MediaImageProps, 'id' | 'size' | 'shape' | 'ref' | 'style' | 'lx'>;

export type MediaImageGroupItemContext = Required<
  Pick<MediaImageProps, 'size' | 'shape'>
>;

export type MediaImageGroupProps<T = MediaImageGroupItem> = {
  /**
   * Items to display. They are rendered as
   * `MediaImage` unless `renderItem` is provided.
   */
  data: readonly T[];
  /**
   * Renders an item in place of the default `MediaImage`. Receives the `size`
   * and `shape` owned by the group, which must be forwarded to the rendered
   * element so the overlap and overflow badge stay consistent.
   * @optional
   */
  renderItem?: (item: T, context: MediaImageGroupItemContext) => ReactNode;
  /**
   * Size applied to every item.
   * @default 32
   */
  size?: MediaImageProps['size'];
  /**
   * Shape applied to every item.
   * @default 'circle'
   */
  shape?: MediaImageProps['shape'];
  /**
   * Dims the items and the `+N` badge.
   * @default false
   */
  disabled?: boolean;
  /**
   * Maximum number of slots displayed, the `+N` overflow badge included.
   * @default 4
   */
  maxVisible?: number;
  /**
   * Test id of the `+N` overflow badge.
   * @optional
   */
  overflowTestID?: string;
  /**
   * Accessible label of the `+N` overflow badge, e.g. "7 more assets".
   * @optional
   */
  overflowLabel?: string;
} & Omit<StyledViewProps, 'children'>;
