import type {
  ComponentPropsWithRef,
  MouseEventHandler,
  ReactNode,
} from 'react';

export type MediaCardProps = {
  /**
   * The source URL for the background image.
   */
  imageUrl: string;
  /**
   * The card content — typically a `MediaCardTitle` and optional
   * leading content such as tags or icons.
   */
  children: ReactNode;
  /**
   * Callback fired when the card is pressed.
   */
  onClick: MouseEventHandler<HTMLDivElement>;
  /**
   * Callback fired when the close button is pressed.
   */
  onClose: () => void;
  /**
   * Additional CSS classes for the card.
   */
  className?: string;
} & Omit<ComponentPropsWithRef<'div'>, 'onClick'>;

export type MediaCardTitleProps = ComponentPropsWithRef<'div'>;
