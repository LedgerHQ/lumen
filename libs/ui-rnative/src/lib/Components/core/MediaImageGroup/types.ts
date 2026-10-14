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

export type MediaImageGroupRenderItem<T> = (
  item: T,
  context: MediaImageGroupItemContext,
) => ReactNode;

type MediaImageGroupDataProps<T> =
  | {
      /**
       * Items to display, rendered as `MediaImage`.
       */
      data: readonly MediaImageGroupItem[];
      renderItem?: never;
    }
  | {
      /**
       * Items to display, rendered by `renderItem`.
       */
      data: readonly T[];
      /**
       * Renders an item in place of the default `MediaImage`. Required when
       * `data` is not `MediaImageGroupItem[]`. Receives the `size` and `shape`
       * owned by the group, which must be forwarded to the rendered element so
       * the overlap and overflow badge stay consistent.
       */
      renderItem: MediaImageGroupRenderItem<T>;
    };

export type MediaImageGroupProps<T = MediaImageGroupItem> =
  MediaImageGroupDataProps<T> & {
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
