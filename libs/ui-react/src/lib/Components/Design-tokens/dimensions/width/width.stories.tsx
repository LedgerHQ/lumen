import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../../shared';

const meta: Meta = {
  title: 'Foundations/Width',
};

export default meta;
type Story = StoryObj;

const WidthShowcase = () => (
  <div className='mb-32'>
    <div className='space-y-16'>
      {[
        { name: '560px', class: 'w-560', token: 'w-560' },
        { name: '480px', class: 'w-480', token: 'w-480' },
        { name: '400px', class: 'w-400', token: 'w-400' },
        { name: '320px', class: 'w-320', token: 'w-320' },
        { name: '256px', class: 'w-256', token: 'w-256' },
        { name: '224px', class: 'w-224', token: 'w-224' },
        { name: '208px', class: 'w-208', token: 'w-208' },
        { name: '176px', class: 'w-176', token: 'w-176' },
        { name: '160px', class: 'w-160', token: 'w-160' },
        { name: '144px', class: 'w-144', token: 'w-144' },
        { name: '128px', class: 'w-128', token: 'w-128' },
        { name: '112px', class: 'w-112', token: 'w-112' },
        { name: '96px', class: 'w-96', token: 'w-96' },
        { name: '80px', class: 'w-80', token: 'w-80' },
        { name: '64px', class: 'w-64', token: 'w-64' },
        { name: '48px', class: 'w-48', token: 'w-48' },
        { name: '40px', class: 'w-40', token: 'w-40' },
        { name: '32px', class: 'w-32', token: 'w-32' },
        { name: '24px', class: 'w-24', token: 'w-24' },
        { name: '20px', class: 'w-20', token: 'w-20' },
        { name: '16px', class: 'w-16', token: 'w-16' },
        { name: '12px', class: 'w-12', token: 'w-12' },
        { name: '10px', class: 'w-10', token: 'w-10' },
        { name: '8px', class: 'w-8', token: 'w-8' },
        { name: '6px', class: 'w-6', token: 'w-6' },
        { name: '4px', class: 'w-4', token: 'w-4' },
        { name: '2px', class: 'w-2', token: 'p-2' },
        { name: '1px', class: 'w-1', token: 'w-1' },
        { name: '0px', class: 'w-0', token: 'w-0' },
      ].map(({ name, class: widthClass, token }) => (
        <div key={name} className='flex items-center gap-8'>
          <div>
            <div className='w-48 body-2 text-base'>{name}</div>
            <div className='body-4 text-muted'>{token}</div>
          </div>
          <div className={`${widthClass} h-24 rounded-xs bg-accent`} />
        </div>
      ))}
    </div>
  </div>
);

export const Default: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Width'
        description='Tailwind classes for controlling the width of an element. Use the `w-*` prefix followed by the size value.'
      />
      <WidthShowcase />
    </div>
  ),
};
