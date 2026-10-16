import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchInput } from '../../core/SearchInput/SearchInput';
import * as Icons from '../../symbols';
import type { IconSize } from './types';

const meta = {
  parameters: { docs: { source: { type: 'code' } } },
  id: 'react-icon',
  title: 'Symbols/Interface Icons',
} satisfies Meta;

export default meta;

const sizes: IconSize[] = [12, 16, 20, 24, 32, 40, 48, 56];

type IconName = keyof typeof Icons;
const iconNames = Object.keys(Icons) as IconName[];

type IconStoryProps = {
  size: IconSize;
  name: IconName;
  className?: string;
  disabled?: boolean;
};

export const Base: StoryObj<IconStoryProps> = {
  args: {
    size: 24,
    name: 'Home',
    className: 'text-base',
  },
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
    },
    name: {
      control: 'select',
      options: iconNames,
    },
    disabled: {
      control: 'boolean',
    },
  },
  render: (args) => {
    const IconComponent = Icons[args.name];
    return (
      <div className='p-8'>
        <div className='flex flex-col items-center gap-4'>
          <IconComponent size={args.size} className={args.className} />
          <span className='text-base'>{args.name}</span>
        </div>
      </div>
    );
  },
};

export const Sizes: StoryObj = {
  render: () => (
    <div className='space-y-16 text-base'>
      {sizes.map((size) => (
        <div key={size}>
          <h3 className='mb-16 heading-4'>Size {size}px</h3>
          <div className='flex max-w-fit flex-wrap gap-16 rounded-lg border border-muted-subtle p-16'>
            {(
              [
                'Home',
                'Settings',
                'Heart',
                'Star',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
              ] as const
            ).map((iconName) => {
              const IconComponent = Icons[iconName];
              return (
                <div
                  key={iconName}
                  className='flex flex-col items-center gap-2 rounded-lg p-4'
                >
                  <IconComponent size={size} className='text-base' />
                  <span className='body-4 text-muted'>{iconName}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Gallery: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedName, setCopiedName] = useState<string | null>(null);

    const filteredIcons = Object.entries(Icons).filter(([name]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const copyName = async (name: string) => {
      try {
        await navigator.clipboard.writeText(name);
        setCopiedName(name);
        setTimeout(() => setCopiedName(null), 1500);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    return (
      <div className='p-8'>
        <div className='mb-32'>
          <div className='mb-8 max-w-md'>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search icons...'
              className='w-full'
            />
          </div>

          <div className='mb-4'>
            <span className='ml-8 body-3 text-muted'>
              {filteredIcons.length} of {Object.keys(Icons).length} icons
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
        </div>

        <div className='grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-8'>
          {filteredIcons.map(([name, IconComponent]) => (
            <div
              key={name}
              className='relative flex cursor-pointer flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-muted-pressed'
              onClick={() => copyName(name)}
            >
              <IconComponent size={24} className='text-base' />
              <span className='body-4 text-muted'>{name}</span>
              {copiedName === name && (
                <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-muted'>
                  <span className='body-4 text-on-accent'>Copied!</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredIcons.length === 0 && searchTerm && (
          <div className='flex flex-col items-center justify-center py-16'>
            <p className='body-2 text-muted'>
              No icons found matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className='mt-4 body-2 text-interactive hover:text-interactive-hover'
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    );
  },
};
