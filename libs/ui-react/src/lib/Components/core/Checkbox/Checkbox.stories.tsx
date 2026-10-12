import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Checkbox } from './Checkbox';

const meta = {
  id: 'react-checkbox',
  title: 'Core/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    onCheckedChange: {
      action: 'checked changed',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

/**
 * The base checkbox in its normal state.
 */
export const Base: Story = {
  render: (args) => (
    <div className='flex size-80 items-center justify-center'>
      <Checkbox aria-label='Toggle' {...args} />
    </div>
  ),
};

/**
 * Interactive example showing all states.
 */
export const AllStates: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-16 p-16 text-base'>
      <div className='space-y-16'>
        <h3 className='heading-5'>Enabled</h3>
        <div className='space-y-8'>
          <div className='flex items-center space-x-8'>
            <Checkbox aria-label='Toggle' checked={false} />
            <span>Unchecked</span>
          </div>
          <div className='flex items-center space-x-8'>
            <Checkbox aria-label='Toggle' checked />
            <span>Checked</span>
          </div>
        </div>
      </div>
      <div className='space-y-16'>
        <h3 className='heading-5'>Disabled</h3>
        <div className='space-y-8'>
          <div className='flex items-center space-x-8'>
            <Checkbox aria-label='Toggle' disabled checked={false} />
            <span className='text-muted'>Unchecked</span>
          </div>
          <div className='flex items-center space-x-8'>
            <Checkbox aria-label='Toggle' disabled checked />
            <span className='text-muted'>Checked</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Example of checkbox usage in a form context.
 */
export const FormExample: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState<string>();

    return (
      <form
        className='space-y-16 p-16 text-base'
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const payload = Object.fromEntries(
            [...new Set(data.keys())].map((key) => {
              const values = data.getAll(key);
              return [key, values.length > 1 ? values : values[0]];
            }),
          );
          setSubmitted(JSON.stringify(payload));
        }}
      >
        <div className='space-y-12'>
          <h3 className='body-1'>Subscribe to newsletters</h3>
          <div className='space-y-8'>
            <div className='flex items-center space-x-8'>
              <Checkbox
                aria-label='Toggle'
                id='weekly'
                name='newsletter'
                value='weekly'
              />
              <label htmlFor='weekly' className='cursor-pointer body-3'>
                Weekly newsletter
              </label>
            </div>
            <div className='flex items-center space-x-8'>
              <Checkbox
                aria-label='Toggle'
                id='monthly'
                name='newsletter'
                value='monthly'
              />
              <label htmlFor='monthly' className='cursor-pointer body-3'>
                Monthly newsletter
              </label>
            </div>
            <div className='flex items-center space-x-8'>
              <Checkbox
                aria-label='Toggle'
                id='product-updates'
                name='newsletter'
                value='product-updates'
                defaultChecked
              />
              <label
                htmlFor='product-updates'
                className='cursor-pointer body-3'
              >
                Product updates
              </label>
            </div>
          </div>
        </div>
        <div className='flex items-center space-x-8'>
          <Checkbox aria-label='Toggle' id='terms' name='terms' required />
          <label htmlFor='terms' className='cursor-pointer body-3'>
            I agree to the{' '}
            <a
              href='#'
              onClick={(e) => e.preventDefault()}
              className='underline'
            >
              terms and conditions
            </a>{' '}
            *
          </label>
        </div>
        <Button type='submit' size='sm'>
          Submit
        </Button>
        <output className='block body-3 text-muted'>
          {submitted ?? 'Unchecked checkboxes are not submitted.'}
        </output>
      </form>
    );
  },
};
