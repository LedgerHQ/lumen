import { BaseButton } from '../Button/BaseButton';
import type { IconButtonProps } from './types';

export const IconButton = (props: IconButtonProps) => {
  return <BaseButton {...props} />;
};
