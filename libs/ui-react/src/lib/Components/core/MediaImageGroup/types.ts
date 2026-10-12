import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { MediaImageProps } from '../MediaImage';

export type MediaImageGroupItem = {
  /**
   * Stable identifier of the item, used as its React key.
   */
  id: string;
} & Omit<MediaImageProps, 'id' | 'size' | 'shape' | 'ref' | 'className'>;

export type MediaImageGroupItemContext = Required<
  Pick<MediaImageProps, 'size' | 'shape'>
>;

export type MediaImageGroupProps<
  T extends { id: string } = MediaImageGroupItem,
> = {
  /**
   * Items to display, each with a unique `id`. They are rendered as
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
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   * @optional
   */
  className?: string;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;
