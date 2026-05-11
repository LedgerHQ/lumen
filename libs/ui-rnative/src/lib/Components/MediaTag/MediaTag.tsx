import { BaseTag } from '../Tag/BaseTag';
import type { MediaTagProps } from './types';

export const MediaTag = ({ icon, ...props }: MediaTagProps) => {
  return (
    <BaseTag
      {...props}
      variant='media'
      consumerName='MediaTag'
      renderIcon={() => icon}
    />
  );
};
