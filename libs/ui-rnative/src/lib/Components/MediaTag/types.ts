import type { ReactNode } from 'react';
import type { TagProps } from '../Tag';

export type MediaTagProps = Omit<TagProps, 'icon'> & {
  icon: ReactNode;
};
