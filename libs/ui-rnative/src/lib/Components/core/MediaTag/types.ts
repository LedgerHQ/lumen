import type { ReactNode } from 'react';
import type { TagProps } from '../Tag';

export type MediaTagProps = Omit<TagProps, 'icon'> & {
  /**
   * The media element rendered before the label (e.g. an image or a crypto icon).
   * Should be sized to match the tag's `size`: 16px for `md`, 12px for `sm`.
   */
  leadingContent: ReactNode;
};
