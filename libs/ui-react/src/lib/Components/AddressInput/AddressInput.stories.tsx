import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { InformationFill, QrCode } from '../../Symbols';
import { AddressInput } from './AddressInput';

const meta: Meta<typeof AddressInput> = {
  component: AddressInput,
  title: 'Input/AddressInput',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    suffix: {
      control: 'select',
      options: ['QrCode', 'Information'],
      mapping: {
        QrCode: <QrCode size={20} className='text-muted' />,
        Information: <InformationFill size={20} className='text-muted' />,
      },
    },
    onQrCodeClick: {
      action: 'qr-code-clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AddressInput>;

/**
 * The default address field input with "To:" prefix and clickable QR code scanner icon.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter address or ENS',
    onQrCodeClick: () => console.log('QR code clicked!'),
  },
  parameters: {
    docs: {
      source: {
        code: '<AddressInput placeholder="Enter address or ENS" onQrCodeClick={() => openQrScanner()} />',
      },
    },
  },
};

/**
 * Empty address field showing placeholder text and clickable QR code scanner.
 */
export const Empty: Story = {
  args: {
    placeholder: 'Enter address or ENS',
    onQrCodeClick: () => console.log('QR code clicked!'),
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      source: {
        code: '<AddressInput placeholder="Enter address or ENS" onQrCodeClick={() => openQrScanner()} className="max-w-md" />',
      },
    },
  },
};

/**
 * Address field with content showing the clear button instead of QR code scanner.
 */
export const WithContent: Story = {
  args: {
    placeholder: 'Enter address or ENS',
    defaultValue: '0x95f980s5ag77xe7csuz',
    className: 'max-w-md',
    onQrCodeClick: () => console.log('QR code clicked!'),
  },
  parameters: {
    docs: {
      source: {
        code: '<AddressInput placeholder="Enter address or ENS" defaultValue="0x95f980s5ag77xe7csuz" className="max-w-md" />',
      },
    },
  },
};

/**
 * Disabled address field input.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Enter address or ENS',
    disabled: true,
    defaultValue: '0x95f980s5ag77xe7csuz',
    className: 'max-w-md',
    onQrCodeClick: () => console.log('QR code clicked!'),
  },
  parameters: {
    docs: {
      source: {
        code: '<AddressInput placeholder="Enter address or ENS" disabled defaultValue="0x95f980s5ag77xe7csuz" className="max-w-md" />',
      },
    },
  },
};

/**
 * Address field in error state with error message.
 */
export const Error: Story = {
  args: {
    placeholder: 'Enter address or ENS',
    defaultValue: 'invalid-address-format',
    helperText: 'Invalid address format',
    status: 'error',
    'aria-invalid': true,
    className: 'max-w-md',
    onQrCodeClick: () => console.log('QR code clicked!'),
  },
  parameters: {
    docs: {
      source: {
        code: `<AddressInput 
  placeholder="Enter address or ENS"
  defaultValue="invalid-address-format"
  helperText="Invalid address format"
  status="error"
  aria-invalid={true}
  className="max-w-md"
/>`,
      },
    },
  },
};

/**
 * Address field with controlled state and QR code scanning functionality.
 */
export const Controlled: Story = {
  render: () => {
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');

    // Simulate address validation
    useEffect(() => {
      if (address.length > 0) {
        const isValidAddress =
          address.startsWith('0x') && address.length === 42;
        const isValidENS = address.endsWith('.eth');

        if (!isValidAddress && !isValidENS && address.length > 5) {
          setError('Please enter a valid Ethereum address or ENS name');
        } else {
          setError('');
        }
      } else {
        setError('');
      }
    }, [address]);

    const handleQrCodeScan = () => {
      // Simulate QR code scanning
      const mockAddress = '0x742d35cc6234567c3c3c2f308bcfb8d6e80f3434';
      setAddress(mockAddress);
      console.log('QR code scanned:', mockAddress);
    };

    return (
      <div className='space-y-4'>
        <AddressInput
          placeholder='Enter address or ENS'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onQrCodeClick={handleQrCodeScan}
          onClear={() => {
            // BaseInput already handles clearing the input value
            setError(''); // Clear error state
            console.log('Address cleared');
          }}
          helperText={error || undefined}
          status={error ? 'error' : undefined}
          aria-invalid={!!error}
          className='max-w-md'
        />

        <div className='body-3 text-muted'>
          <p>
            Click the QR code icon when the field is empty to scan an address.
          </p>
        </div>

        {address && !error && (
          <div className='rounded-md border border-muted bg-success p-16'>
            <h4 className='mb-4 body-2-semi-bold text-success'>
              Valid Address
            </h4>
            <p className='body-3 break-all text-success'>{address}</p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Address field without QR code scanner (no onQrCodeClick handler provided).
 */
export const WithoutQrCode: Story = {
  args: {
    placeholder: 'Enter address or ENS',
    className: 'max-w-md',
    onQrCodeClick: undefined,
  },
  parameters: {
    docs: {
      source: {
        code: '<AddressInput className="max-w-md" />',
      },
    },
  },
};
