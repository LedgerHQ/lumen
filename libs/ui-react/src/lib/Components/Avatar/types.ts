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
  loading?: 'eager' | 'lazy';
} & React.HTMLAttributes<HTMLDivElement>;
