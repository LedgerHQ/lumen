import React from 'react';
import { useCommonTranslation } from '../../../i18n';
import { QrCode as QrCodeIcon } from '../../Symbols';
import { BaseInput } from '../BaseInput';
import { InteractiveIcon } from '../InteractiveIcon';
import { AddressInputProps } from './types';

/**
 * A customizable address field input component for cryptocurrency addresses with fixed "To:" prefix, QR code scanner, automatic clear button, error states, and focus/hover effects.
 *
 * ## Key Features
 * - **Customizable prefix text** - defaults to "To:" but can be overridden via prefix prop
 * - **Context-aware suffix icons** - QR code scanner when empty (if onQrCodeClick provided), clear button when content
 * - **Automatic clear button** appears when input has content
 * - **Conditional QR code scanner** appears only when onQrCodeClick handler is provided
 * - **ENS and address support** optimized for cryptocurrency address entry
 * - **Error state styling** with aria-invalid and errorMessage support
 * - **Flexible styling** via className prop
 *
 * ## Clear Button Behavior
 * - Shows automatically when input has content and is not disabled
 * - Works with both controlled and uncontrolled inputs using native value setter
 * - Can be hidden with `hideClearButton={true}`
 * - Extended behavior via optional `onClear` prop
 *
 *
 * @example
 * // Basic address field with automatic clear button
 * <AddressInput value={address} onChange={(e) => setAddress(e.target.value)} />
 *
 * // Address field with error state
 * <AddressInput
 *   value={invalidAddress}
 *   onChange={(e) => setInvalidAddress(e.target.value)}
 *   aria-invalid={!isValid}
 *   errorMessage="Please enter a valid address or ENS name"
 * />
 *
 * // Address field with QR scanner
 * <AddressInput
 *   value={walletAddress}
 *   onChange={(e) => setWalletAddress(e.target.value)}
 *   onQrCodeClick={() => openQrScanner()}
 * />
 *
 * // Address field with custom prefix
 * <AddressInput
 *   prefix="From:"
 *   value={senderAddress}
 *   onChange={(e) => setSenderAddress(e.target.value)}
 * />
 *
 * // Extend clear behavior with analytics
 * <AddressInput
 *   value={recipientAddress}
 *   onChange={(e) => setRecipientAddress(e.target.value)}
 *   onQrCodeClick={() => openQrScanner()}
 *   onClear={() => {
 *     analytics.track('address_cleared');
 *   }}
 * />
 */
export const AddressInput = ({
  ref,
  prefix = 'To:',
  suffix,
  onQrCodeClick,
  ...props
}: AddressInputProps & {
  ref?: React.Ref<HTMLInputElement>;
}) => {
  const { t } = useCommonTranslation();
  // Use custom prefix if provided, otherwise default "To:" prefix
  const effectivePrefix = (
    <span
      className='body-1 text-nowrap text-base group-has-disabled:text-disabled'
      aria-hidden='true'
    >
      {prefix}
    </span>
  );

  // Show QR code icon only when no custom suffix is provided AND onQrCodeClick exists
  // BaseInput will handle showing/hiding based on content via its clear button logic
  const effectiveSuffix =
    suffix ||
    (onQrCodeClick && (
      <InteractiveIcon
        iconType='filled'
        onClick={onQrCodeClick}
        aria-label={t('components.addressInput.qrCodeAriaLabel')}
        className='group-has-disabled:text-disabled'
      >
        <QrCodeIcon size={20} />
      </InteractiveIcon>
    ));

  return (
    <BaseInput
      ref={ref}
      prefix={effectivePrefix}
      suffix={effectiveSuffix}
      {...props}
    />
  );
};

AddressInput.displayName = 'AddressInput';
