import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../shared';

const meta: Meta = {
  title: 'Foundations/Border/Radius',
};

export default meta;
type Story = StoryObj;

const BorderRadiusShowcase = () => (
  <div className='mb-32'>
    <div className='grid grid-cols-2 gap-16 sm:grid-cols-4 lg:grid-cols-8'>
      {[
        { name: 'none', class: 'rounded-none' },
        { name: 'xxs', class: 'rounded-xxs' },
        { name: 'xs', class: 'rounded-xs' },
        { name: 'sm', class: 'rounded-sm' },
        { name: 'md', class: 'rounded-md' },
        { name: 'lg', class: 'rounded-lg' },
        { name: 'xl', class: 'rounded-xl' },
        { name: '2xl', class: 'rounded-2xl' },
        { name: 'full', class: 'rounded-full' },
      ].map(({ name, class: className }) => (
        <div key={name} className=''>
          <div className={`mb-8 size-80 bg-accent ${className}`}></div>
          <div></div>
          <div className='body-2 text-base'>{name}</div>
          <div className='body-4 text-muted'>{className}</div>
        </div>
      ))}
    </div>
  </div>
);

export const BorderRadius: Story = {
  name: 'Radius',
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Border Radius'
        description='Tailwind classes for controlling the border radius of an element.'
      />
      <BorderRadiusShowcase />
    </div>
  ),
};
