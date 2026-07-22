import type { StyledViewProps } from '../../../styles';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type AvatarProps = {
  /**
   * Image source URL. When undefined or on load error, displays a fallback.
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
  size?: AvatarSize;
  /**
   * Background color behind the fallback when no image is displayed.
   * Use `resolveAvatarColor` from `@ledgerhq/lumen-ui-rnative` to derive
   * a stable pastel color from an identifier such as a user id.
   * @optional
   */
  fallbackColor?: string;
  /**
   * Short text shown in place of the fallback icon when no image is displayed,
   * typically a user's initials.
   * @optional
   */
  fallbackText?: string;
  /**
   * Appearance for the avatar.
   * - `thin`: 1px ring using the icon border color
   * - `thick`: 2px ring using the muted subtle transparent border color
   * @optional
   */
  appearance?: 'thin' | 'thick';
} & Omit<StyledViewProps, 'children'>;
