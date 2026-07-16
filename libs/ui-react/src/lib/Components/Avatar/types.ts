import type { ComponentPropsWithRef } from 'react';

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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   * @optional
   */
  className?: string;
  /**
   * Loading strategy for the image.
   * - `eager`: Load immediately (default browser behavior, recommended for above-fold avatars)
   * - `lazy`: Defer loading until near viewport (use for long lists)
   * @optional
   * @default undefined (browser default: eager)
   */
  imgLoading?: 'eager' | 'lazy';
  /**
   * Background color behind the fallback when no image is displayed.
   * Use `resolveAvatarColor` from `@ledgerhq/lumen-ui-react` to derive
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
   * Ring appearance for the avatar.
   * - `thin`: 1px ring using the icon border color
   * - `thick`: 2px ring using the muted subtle transparent border color
   * @optional
   */
  ringAppearance?: 'thin' | 'thick';
} & ComponentPropsWithRef<'div'>;
