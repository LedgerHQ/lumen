import { cn } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../shared';

const meta: Meta = {
  id: 'react-backdrop',
  title: 'Foundations/Styles/Backdrop',
};

export default meta;
type Story = StoryObj;

const IMAGE_URL =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop';

const BackdropShowcase = () => (
  <div className='mb-32'>
    <div className='grid grid-cols-1 gap-16 gap-y-40 sm:grid-cols-2 lg:grid-cols-4'>
      {[
        { name: 'None', class: 'backdrop-blur-none' },
        { name: '8px', class: 'backdrop-blur-sm' },
        { name: '12px', class: 'backdrop-blur-md' },
        { name: '16px', class: 'backdrop-blur-lg' },
        { name: '24px', class: 'backdrop-blur-xl' },
      ].map(({ name, class: backdropClass }) => (
        <div key={name}>
          <div className='relative size-192 overflow-hidden rounded-lg'>
            {/* Background image */}
            <img
              src={IMAGE_URL}
              alt='Mountain landscape'
              className='absolute inset-0 size-full object-cover'
            />
            {/* Blurred overlay */}
            <div
              className={cn('absolute inset-24 rounded-lg', backdropClass)}
            />
          </div>
          <div className='mt-8 body-2 text-base'>{backdropClass}</div>
          <div className='mt-8 body-4 text-muted'>{name}</div>
        </div>
      ))}
    </div>
  </div>
);

export const Backdrop: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Backdrop Blur'
        description='Tailwind classes for controlling the backdrop blur of an element.'
      />
      <BackdropShowcase />
    </div>
  ),
};
