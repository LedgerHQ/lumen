import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { InformationFill, SparksFill } from '../../symbols';
import { Button } from '../Button';
import { Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip';
import { TextInput } from './TextInput';

const meta = {
  component: TextInput,
  id: 'react-textinput',
  title: 'Core/TextInput',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic',
      },
    },
  },
  argTypes: {
    suffix: {
      control: 'select',
      options: [undefined, 'Information'],
      defaultValue: undefined,
      mapping: {
        undefined: undefined,
        Information: <InformationFill size={20} className='text-muted' />,
      },
      onClear: {
        control: false,
      },
    },
    hideClearButton: {
      control: 'boolean',
    },
    maxCount: {
      control: 'number',
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || '');

    return (
      <TextInput
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={args.onClear ? () => console.log('Clear') : undefined}
        suffix={args.suffix}
      />
    );
  },
  args: {
    label: 'Label',
    type: 'text',
    disabled: false,
    value: '',
    onClear: undefined,
    suffix: undefined,
    hideClearButton: false,
  },
};

export const WithContent: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Initial content',
  },
};

export const WithLabelAndPlaceholder: Story = {
  args: {
    label: 'Phone',
    placeholder: '+1 (555) 000-0000',
  },
};

export const ExtendedClearBehavior: Story = {
  args: {
    label: 'Extended Clear Behavior',
    onClear: () => {
      alert('Extended clear behavior');
    },
  },
};

export const ControlledInputExample = () => {
  const [value, setValue] = useState('Type here to see default clear button');
  return (
    <TextInput
      label='Controlled Input (Default Clear)'
      value={value}
      onChange={(e) => setValue(e.target.value)}
      id='controlled-input'
    />
  );
};

export const UncontrolledInputExample = () => {
  return (
    <TextInput
      label='Uncontrolled Input (Default Clear)'
      defaultValue='Default content'
      id='uncontrolled-input'
    />
  );
};

export const HiddenClearButton: Story = {
  args: {
    label: 'Clear Button Hidden',
    defaultValue: 'Content with no clear button',
    hideClearButton: true,
  },
};

export const WithError: Story = {
  render: () => {
    const [email, setEmail] = useState('invalid.email');
    // Consider empty input as valid to allow clearing
    const isValidEmail =
      email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return (
      <TextInput
        label='Email'
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        helperText={
          isValidEmail ? undefined : 'Please enter a valid email address'
        }
        status={isValidEmail ? undefined : 'error'}
      />
    );
  },
};

export const WithCounter: Story = {
  args: {
    label: 'Label',
    helperText: 'Info text',
    maxCount: 32,
  },
};

export const WithCounterExceeded: Story = {
  render: () => {
    const [value, setValue] = useState('This text exceeds the character limit');
    const maxCount = 32;
    const isOverLimit = value.length > maxCount;

    return (
      <TextInput
        label='Label'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        helperText={isOverLimit ? 'Character limit exceeded' : 'Info text'}
        status={isOverLimit ? 'error' : undefined}
        maxCount={maxCount}
      />
    );
  },
};

export const WithNativeMaxLength: Story = {
  args: {
    label: 'Label',
    helperText: 'Input is capped at 8 characters',
    maxLength: 8,
    maxCount: 8,
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'Address',
    defaultValue: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    helperText: 'Address verified',
    status: 'success',
  },
};

export const WithNeutralHint: Story = {
  args: {
    label: 'Address',
    placeholder: '0x…',
    helperText: 'Enter your ETH address',
  },
};

export const WithMultilineTextarea: Story = {
  args: {
    label: 'Note',
    multiline: true,
    minLines: 2,
    maxLines: 5,
    helperText: 'Grows from 2 to 5 lines, then scrolls',
  },
};

export const WithMultilineFixedHeight: Story = {
  args: {
    label: 'Note',
    multiline: true,
    minLines: 4,
    maxLines: 4,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Disabled content',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Label',
    defaultValue: 'Read-only content',
    readOnly: true,
  },
};

const InfoTooltip = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type='button' aria-label='Username requirements'>
          <InformationFill size={20} className='text-muted' />
        </button>
      </TooltipTrigger>
      <TooltipContent side='top'>
        Username must be unique and at least 3 characters long
      </TooltipContent>
    </Tooltip>
  );
};

const GeneratePasswordButton = () => (
  <button
    type='button'
    onClick={() => alert('Generate password')}
    aria-label='Generate random password'
  >
    <SparksFill size={20} className='text-muted' />
  </button>
);

export const WithCustomElement: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className='max-w-4xl'>
        <div className='grid grid-cols-1 gap-16 md:grid-cols-2'>
          {/* Example with tooltip and clear button */}
          <div>
            <h3 className='mb-8 body-1-semi-bold'>
              With Tooltip and Clear Button
            </h3>
            <TextInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              label='Username'
              suffix={<InfoTooltip />}
              id='tooltip-input'
            />
          </div>

          {/* Example with action button and no clear button */}
          <div>
            <h3 className='mb-8 body-1-semi-bold'>
              With Action Button and No Clear Button
            </h3>
            <TextInput
              label='Generate Password'
              type='password'
              hideClearButton
              suffix={<GeneratePasswordButton />}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange =
      (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: '' }));
        }
      };

    const handleClear = (field: string) => () => {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        setIsSubmitted(true);
        // Reset form after success
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
        }, 2000);
      }
    };

    if (isSubmitted) {
      return (
        <div className='rounded-md bg-success p-16 text-center'>
          <div className='body-1-semi-bold text-success'>
            ✓ Form submitted successfully!
          </div>
          <div className='mt-4 body-3 text-muted'>Resetting form...</div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className='flex flex-col gap-16'>
        <TextInput
          label='Username'
          value={formData.username}
          onChange={handleChange('username')}
          onClear={handleClear('username')}
          helperText={errors.username}
          status={errors.username ? 'error' : undefined}
          suffix={<InformationFill size={20} className='text-muted' />}
        />

        <TextInput
          label='Email'
          type='email'
          value={formData.email}
          onChange={handleChange('email')}
          onClear={handleClear('email')}
          helperText={errors.email}
          status={errors.email ? 'error' : undefined}
        />

        <TextInput
          label='Password'
          type='password'
          value={formData.password}
          onChange={handleChange('password')}
          onClear={handleClear('password')}
          helperText={errors.password}
          status={errors.password ? 'error' : undefined}
        />

        <TextInput
          label='Confirm Password'
          type='password'
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onClear={handleClear('confirmPassword')}
          helperText={errors.confirmPassword}
          status={errors.confirmPassword ? 'error' : undefined}
        />

        <div className='flex gap-12'>
          <Button type='submit' appearance='base'>
            Create Account
          </Button>
          <Button
            type='button'
            appearance='gray'
            onClick={() => {
              setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
              });
              setErrors({});
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    );
  },
};
