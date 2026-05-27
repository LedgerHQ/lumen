import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../shared';

const meta: Meta = {
  title: 'Foundations/Spacing',
};

export default meta;
type Story = StoryObj;

const SpacingShowcase = () => (
  <div className='mb-32'>
    <div className='grid grid-cols-1 place-items-start gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2'>
      {[
        { name: '0px', class: 'p-0', token: 'p-0' },
        { name: '1px', class: 'p-1', token: 'p-1' },
        { name: '2px', class: 'p-2', token: 'p-2' },
        { name: '4px', class: 'p-4', token: 'p-4' },
        { name: '6px', class: 'p-6', token: 'p-6' },
        { name: '8px', class: 'p-8', token: 'p-8' },
        { name: '10px', class: 'p-10', token: 'p-10' },
        { name: '12px', class: 'p-12', token: 'p-12' },
        { name: '14px', class: 'p-14', token: 'p-14' },
        { name: '16px', class: 'p-16', token: 'p-16' },
        { name: '20px', class: 'p-20', token: 'p-20' },
        { name: '24px', class: 'p-24', token: 'p-24' },
        { name: '32px', class: 'p-32', token: 'p-32' },
        { name: '40px', class: 'p-40', token: 'p-40' },
        { name: '48px', class: 'p-48', token: 'p-48' },
        { name: '56px', class: 'p-56', token: 'p-56' },
        { name: '64px', class: 'p-64', token: 'p-64' },
        { name: '80px', class: 'p-80', token: 'p-80' },
        { name: '96px', class: 'p-96', token: 'p-96' },
        { name: '112px', class: 'p-112', token: 'p-112' },
        { name: '128px', class: 'p-128', token: 'p-128' },
        { name: '144px', class: 'p-144', token: 'p-144' },
        { name: '160px', class: 'p-160', token: 'p-160' },
        { name: '256px', class: 'p-256', token: 'p-256' },
      ].map(({ name, class: widthClass, token }) => (
        <div key={name} className='flex items-center gap-8'>
          <div>
            <div className='body-2 text-muted'>{token}</div>
            <div className='w-48 body-4 text-base'>{name}</div>
          </div>
          <div
            className={`${widthClass} rounded-md border border-muted-subtle bg-[repeating-linear-gradient(45deg,var(--border-muted-subtle)_2px,var(--border-muted-subtle)_4px,transparent_4px,transparent_12px)]`}
          >
            <div className='size-56 rounded-sm bg-accent body-2 text-muted' />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Spacing: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Spacing'
        description='Tailwind classes for controlling the spacing of an element. Includes padding, margin, and gap.'
      />
      <SpacingShowcase />
    </div>
  ),
};
