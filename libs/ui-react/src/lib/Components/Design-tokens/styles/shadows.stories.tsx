import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../shared';

const meta: Meta = {
  title: 'Foundations/Styles/Shadows',
};

export default meta;
type Story = StoryObj;

const ShadowShowcase = () => (
  <div className='mb-32'>
    <div className='grid grid-cols-1 gap-16 gap-y-40 sm:grid-cols-2 lg:grid-cols-3'>
      {[
        { name: '4px', class: 'shadow-sm' },
        { name: '8px', class: 'shadow-md' },
        { name: '16px', class: 'shadow-lg' },
        { name: '24px', class: 'shadow-xl' },
        { name: '32px', class: 'shadow-2xl' },
      ].map(({ name, class: shadowClass }) => (
        <div key={name}>
          <div className='flex size-192 items-center justify-center rounded-lg border border-muted-subtle text-center dark:bg-muted-strong'>
            <div className={`size-80 rounded-lg ${shadowClass}`} />
          </div>
          <div className='mt-8 body-2 text-base'>{name}</div>
          <div className='mt-8 body-4 text-muted'>{shadowClass}</div>
        </div>
      ))}
    </div>
  </div>
);

export const Shadows: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Shadow'
        description='Tailwind classes for controlling the shadow of an element.'
      />
      <ShadowShowcase />
    </div>
  ),
};
