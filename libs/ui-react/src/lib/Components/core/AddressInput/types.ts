import type { ReactNode } from 'react';
import type { BaseInputProps } from '../../internal/BaseInput/types';

export type AddressInputProps = {
  /**
   * Custom suffix element to show instead of the QR code icon.
   * Default suffix is a QR code scanner when empty (if onQrCodeClick provided), clear button when content.
   * — both can be overridden with a custom suffix.
   *
   * @default QrCodeIcon
   */
  suffix?: ReactNode;
  /**
   * Custom prefix text to show instead of the "To:" prefix.
   * @default "To:"
   */
  prefix?: ReactNode;
  /**
   * Callback fired when the QR code scanner icon is clicked.
   * When provided, the QR code scanner icon will be displayed when input is empty.
   * When not provided, no QR code scanner icon will be shown.
   */
  onQrCodeClick?: () => void;
} & Omit<BaseInputProps, 'prefix' | 'label'>;
