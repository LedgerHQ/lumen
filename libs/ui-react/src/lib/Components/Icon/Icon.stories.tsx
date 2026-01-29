import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import * as Icons from '../../Symbols';
import { SearchInput } from '../SearchInput/SearchInput';
import { IconSize } from './types';

const meta: Meta = {
  title: 'Symbols/Interface Icons',
};

export default meta;

const sizes: IconSize[] = [12, 16, 20, 24, 32, 40, 48, 56];

type IconName = keyof typeof Icons;
const iconNames = Object.keys(Icons) as IconName[];

type IconStoryProps = {
  size: IconSize;
  name: IconName;
  className?: string;
};

type IconCardProps = {
  name: string;
  size?: IconSize;
  className?: string;
};

const IconCard = ({
  name,
  size = 24,
  className = 'text-base',
}: IconCardProps) => {
  const [copied, setCopied] = useState(false);
  const IconComponent = Icons[name as keyof typeof Icons];

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      key={name}
      className='relative flex cursor-pointer flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-muted-pressed'
      onClick={handleClick}
    >
      <IconComponent size={size} className={className} />
      <span className='body-4 text-muted'>{name}</span>
      {copied && (
        <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-muted'>
          <span className='body-4 text-on-accent'>Copied!</span>
        </div>
      )}
    </div>
  );
};

export const Icon: StoryObj<IconStoryProps> = {
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
  parameters: {
    docs: {
      source: {
        code: `
        <Information size={24} className="text-base" />
      `,
      },
    },
  },
};

export const IconSizes: StoryObj = {
  render: () => (
    <div className='space-y-16 text-base'>
      {sizes.map((size) => (
        <div key={size}>
          <h3 className='mb-16 heading-4'>Size {size}px</h3>
          <div className='flex max-w-fit flex-wrap gap-16 rounded-lg border border-muted-subtle p-16'>
            {[
              'Home',
              'Settings',
              'Heart',
              'Star',
              'ArrowDown',
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
            ].map((iconName) => (
              <IconCard key={iconName} name={iconName} size={size} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Gallery: StoryObj = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter icons based on search term
    const filteredIcons = Object.entries(Icons).filter(([name]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
      <div className='p-8'>
        {/* Search bar */}
        <div className='mb-32'>
          <div className='mb-8 max-w-md'>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search icons...'
              className='w-full'
            />
          </div>

          {/* Results count */}
          <div className='mb-4'>
            <span className='ml-8 body-3 text-muted'>
              {filteredIcons.length} of {Object.keys(Icons).length} icons
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
        </div>

        {/* Icon grid */}
        <div className='grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-8'>
          {filteredIcons.map(([name]) => (
            <IconCard key={name} name={name} />
          ))}
        </div>

        {/* No results message */}
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
