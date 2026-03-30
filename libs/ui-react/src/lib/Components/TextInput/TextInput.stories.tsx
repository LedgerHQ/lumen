import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, ChangeEvent, FormEvent } from 'react';
import { InformationFill, SparksFill } from '../../Symbols';
import { Button } from '../Button';
import { Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: 'Input/TextInput',
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
  },
  // Default args moved to Default story
};

export default meta;
type Story = StoryObj<typeof TextInput>;

/**
 * The default input with a label.
 */
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
    'aria-invalid': false,
    value: '',
    onClear: undefined,
    suffix: undefined,
    hideClearButton: false,
  },
  parameters: {
    docs: {
      source: {
        code: `<TextInput 
  label="Label" 
  type="text" 
/>`,
      },
    },
  },
};

/**
 * Input with content showing the floating label behavior and clear button.
 */
export const WithContent: Story = {
  render: () => {
    const [value, setValue] = useState('Initial content');
    return (
      <TextInput
        label='Label'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='max-w-md'
      />
    );
  },
  parameters: {
    docs: {
      source: {
        code: `<TextInput 
  label="Label"
  value="Initial content"
  onChange={(e) => setValue(e.target.value)}
/>`,
      },
    },
  },
};

export const ExtendedClearBehavior: Story = {
  render: () => {
    return (
      <TextInput
        label='Extended Clear Behavior'
        onClear={() => {
          alert('Extended clear behavior');
        }}
        className='max-w-md'
      />
    );
  },
  parameters: {
    docs: {
      source: {
        code: `<TextInput 
  label="Extended Clear Behavior"
  onClear={() => {
    alert('Extended clear behavior');
  }}
  className="max-w-md"
/>`,
      },
    },
  },
};

// Separate components to avoid state interference
export const ControlledInputExample = () => {
  const [value, setValue] = useState('Type here to see default clear button');
  return (
    <TextInput
      label='Controlled Input (Default Clear)'
      value={value}
      onChange={(e) => setValue(e.target.value)}
      id='controlled-input'
      className='max-w-md'
    />
  );
};

export const UncontrolledInputExample = () => {
  return (
    <TextInput
      label='Uncontrolled Input (Default Clear)'
      defaultValue='Default content'
      id='uncontrolled-input'
      className='max-w-md'
    />
  );
};

/**
 * Input with hidden clear button using hideClearButton prop.
 */
export const HiddenClearButton: Story = {
  render: () => {
    const [value, setValue] = useState('Content with no clear button');
    return (
      <div className='max-w-md space-y-16'>
        <TextInput
          label='Clear Button Hidden'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          hideClearButton
        />
        <div className='body-3 text-muted'>
          Use hideClearButton to prevent the clear button from appearing.
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `<TextInput 
  label="Clear Button Hidden" 
  value="Content with no clear button"
  onChange={(e) => setValue(e.target.value)}
  hideClearButton
/>`,
      },
    },
  },
};

/**
 * Input in an error state with visual indicators.
 */
export const WithError: Story = {
  render: () => {
    const [email, setEmail] = useState('invalid.email');
    // Consider empty input as valid to allow clearing
    const isValidEmail =
      email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return (
      <div className='max-w-md'>
        <TextInput
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!isValidEmail}
          errorMessage={
            !isValidEmail ? 'Please enter a valid email address' : undefined
          }
        />
        <div className='mt-12 body-3 text-muted'>
          Try typing a valid email address or clicking the clear button to
          remove the error state
        </div>
      </div>
    );
  },
};

/**
 * Disabled input state.
 */
export const Disabled: Story = {
  render: () => {
    const [value] = useState('Disabled content');
    return (
      <TextInput
        label='Label'
        value={value}
        onChange={() => {
          console.log('onChange');
        }}
        disabled
        className='max-w-md'
      />
    );
  },
  parameters: {
    docs: {
      source: {
        code: `<TextInput 
  label="Label" 
  value="Disabled content"
  onChange={handleChange}
  disabled
  className="max-w-md"
/>`,
      },
    },
  },
};

/**
 * Interactive example showing how the input behaves with user interaction and external error handling.
 */
/**
 * Input with an info icon that provides additional context.
 */
// Custom right elements
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
        <div className='mt-16 body-3 text-muted'>
          The suffix prop allows you to add custom interactive elements like
          tooltips, or action buttons
        </div>
      </div>
    );
  },
};

/**
 * Interactive form example showing how Input components work together in a real form with validation and submission.
 */
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
      <div className='max-w-md'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-16'>
          <div className='flex flex-col gap-16'>
            <TextInput
              label='Username'
              value={formData.username}
              onChange={handleChange('username')}
              onClear={handleClear('username')}
              aria-invalid={!!errors.username}
              errorMessage={errors.username}
              suffix={<InformationFill size={20} className='text-muted' />}
            />

            <TextInput
              label='Email'
              type='email'
              value={formData.email}
              onChange={handleChange('email')}
              onClear={handleClear('email')}
              aria-invalid={!!errors.email}
              errorMessage={errors.email}
            />

            <TextInput
              label='Password'
              type='password'
              value={formData.password}
              onChange={handleChange('password')}
              onClear={handleClear('password')}
              aria-invalid={!!errors.password}
              errorMessage={errors.password}
            />

            <TextInput
              label='Confirm Password'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onClear={handleClear('confirmPassword')}
              aria-invalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
            />
          </div>

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

          <div className='body-3 text-muted'>
            This example demonstrates form validation, error handling, clear
            buttons, and right elements working together.
          </div>
        </form>
      </div>
    );
  },
};
