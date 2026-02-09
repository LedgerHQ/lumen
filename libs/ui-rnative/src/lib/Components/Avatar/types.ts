import { StyledViewProps } from '../../../styles';

export type AvatarProps = {
  /**
   * Image source URL. When undefined or on load error, displays a fallback icon.
   * @optional
   */
  src?: string;
  /**
   * Alternative text for the image.
   * @optional
   */
  alt?: string;
  /**
   * The size variant of the avatar.
   * @optional
   * @default md
   */
  size?: 'sm' | 'md';
  /**
   * Whether to show the notifications indicator.
   * @optional
   * @default false
   */
  showNotification?: boolean;
} & Omit<StyledViewProps, 'children'>;
