export type AvatarProps = {
  /**
   * Image source URL. When undefined or on load error, displays a fallback icon.
   * @optional
   */
  src?: string;
  /**
   * Alternative text for the image.
   * @optional
   * @default avatar
   */
  alt?: string;
  /**
   * The size variant of the avatar.
   * @default md
   */
  size?: 'sm' | 'md';
  /**
   * Whether to show the notifications indicator.
   * @default false
   */
  showNotification?: boolean;
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   * @optional
   */
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;
