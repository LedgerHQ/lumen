import { BaseButton } from '../Button/BaseButton';
import { IconButtonProps } from './types';

export const IconButton = (props: IconButtonProps) => {
  return <BaseButton {...props} />;
};

IconButton.displayName = 'IconButton';
