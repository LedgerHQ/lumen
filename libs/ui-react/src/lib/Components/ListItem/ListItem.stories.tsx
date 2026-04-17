import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Settings, Wallet, ChevronRight } from '../../Symbols';
import { Spot } from '../Spot/Spot';
import { Switch } from '../Switch';
import { Tag } from '../Tag/Tag';
import {
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
  ListItemContentRow,
} from './ListItem';

const meta = {
  component: ListItem,
  title: 'Containment/ListItem',
  subcomponents: {
    ListItemLeading,
    ListItemContent,
    ListItemTitle,
    ListItemDescription,
    ListItemTrailing,
    ListItemContentRow,
  },
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
    onClick: {
      action: 'clicked',
    },
  },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof ListItem>;

export const Base: Story = {
  args: {
    className: 'max-w-320 gap-4',
  },
  render: (args) => (
    <ListItem {...args}>
      <ListItemLeading>
        <Spot appearance='icon' icon={Settings} />
        <ListItemContent>
          <ListItemTitle>Item with Icon and Description</ListItemTitle>
          <ListItemDescription>Additional information</ListItemDescription>
        </ListItemContent>
      </ListItemLeading>
    </ListItem>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<ListItem>
  <ListItemLeading>
    <Spot appearance="icon" icon={Settings} />
    <ListItemContent>
      <ListItemTitle>Item with Icon and Description</ListItemTitle>
      <ListItemDescription>Additional information</ListItemDescription>
    </ListItemContent>
  </ListItemLeading>
</ListItem>
`,
      },
    },
  },
};

export const DensityShowcase: Story = {
  render: () => (
    <div className='flex max-w-320 flex-col gap-16'>
      <ListItem density='compact' onClick={() => {}}>
        <ListItemLeading>
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />
          <ListItemContent>
            <ListItemTitle>Compact with crypto icon</ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} className='text-muted' />
        </ListItemTrailing>
      </ListItem>

      <ListItem density='compact'>
        <ListItemLeading>
          <Spot size={32} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Compact with value</ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <div className='body-2-semi-bold'>$3,000</div>
        </ListItemTrailing>
      </ListItem>

      <ListItem density='expanded' onClick={() => {}}>
        <ListItemLeading>
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
          <ListItemContent>
            <ListItemTitle>Expanded with crypto icon</ListItemTitle>
            <ListItemDescription>Additional information</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} className='text-muted' />
        </ListItemTrailing>
      </ListItem>

      <ListItem density='expanded'>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Expanded with value</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <div className='body-2-semi-bold'>$3,000</div>
        </ListItemTrailing>
      </ListItem>
    </div>
  ),
};

export const InteractiveShowcase: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);

    return (
      <div className='flex max-w-320 flex-col gap-16'>
        <div className='flex flex-col gap-4'>
          <div className='body-4-semi-bold text-muted'>Info</div>
          <ListItem>
            <ListItemLeading>
              <Spot size={48} appearance='icon' icon={Settings} />
              <ListItemContent>
                <ListItemTitle>Display only</ListItemTitle>
                <ListItemDescription>No hover or focus</ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
            <ListItemTrailing>
              <ListItemContent>
                <ListItemTitle>42.10</ListItemTitle>
                <ListItemDescription>USD</ListItemDescription>
              </ListItemContent>
            </ListItemTrailing>
          </ListItem>

          <ListItem>
            <ListItemLeading>
              <Spot size={48} appearance='icon' icon={Wallet} />
              <ListItemContent>
                <ListItemTitle>Static item</ListItemTitle>
                <ListItemDescription>Not clickable</ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
            <ListItemTrailing>
              <Tag size='sm' label='New' appearance='accent' />
            </ListItemTrailing>
          </ListItem>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='body-4-semi-bold text-muted'>Interactive</div>
          <ListItem onClick={() => {}}>
            <ListItemLeading>
              <Spot size={48} appearance='icon' icon={Settings} />
              <ListItemContent>
                <ListItemTitle>Navigation</ListItemTitle>
                <ListItemDescription>
                  Hover and focus styles
                </ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
            <ListItemTrailing>
              <ChevronRight size={24} className='text-muted' />
            </ListItemTrailing>
          </ListItem>

          <ListItem onClick={() => setSelected(!selected)}>
            <ListItemLeading>
              <Spot size={48} appearance='icon' icon={Wallet} />
              <ListItemContent>
                <ListItemTitle>Toggle</ListItemTitle>
                <ListItemDescription>Click to toggle</ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
            <ListItemTrailing>
              <Switch tabIndex={-1} selected={selected} />
            </ListItemTrailing>
          </ListItem>

          <ListItem onClick={() => {}}>
            <ListItemLeading>
              <Wallet size={24} />
              <ListItemContent>
                <ListItemTitle>Icon without Spot</ListItemTitle>
                <ListItemDescription>With icon</ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
            <ListItemTrailing>
              <ChevronRight size={24} className='text-muted' />
            </ListItemTrailing>
          </ListItem>
        </div>
      </div>
    );
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <div className='flex w-320 flex-col gap-4'>
      <ListItem {...args}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Disabled Item</ListItemTitle>
            <ListItemDescription>This item is disabled</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Switch selected={false} disabled={args.disabled} />
        </ListItemTrailing>
      </ListItem>

      <ListItem {...args} onClick={() => {}}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Disabled Item</ListItemTitle>
            <ListItemDescription>This item is disabled</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} className='text-disabled' />
        </ListItemTrailing>
      </ListItem>

      <ListItem {...args}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Content Variant</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>42.10</ListItemTitle>
            <ListItemDescription>USD</ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem {...args}>
        <ListItemLeading>
          <Wallet size={24} />
          <ListItemContent>
            <ListItemTitle>Icon without Spot</ListItemTitle>
            <ListItemDescription>Using interface icon</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div className='flex w-480 flex-col gap-32'>
      <ListItem className='w-fit' onClick={() => {}}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Fit content</ListItemTitle>
            <ListItemDescription>Short</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} className='text-muted' />
        </ListItemTrailing>
      </ListItem>

      <ListItem className='w-320' onClick={() => {}}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>
              Defined width (320px) with a long title that truncates
            </ListItemTitle>
            <ListItemDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} className='text-muted' />
        </ListItemTrailing>
      </ListItem>

      <ListItem className='w-320'>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemContentRow>
              <ListItemTitle>
                Defined width (320px) with ContentRow
              </ListItemTitle>
              <Tag size='sm' label='New' appearance='base' />
            </ListItemContentRow>
            <ListItemContentRow>
              <ListItemDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </ListItemDescription>
              <Tag size='sm' label='Custom Tag' appearance='gray' />
            </ListItemContentRow>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>42.10</ListItemTitle>
            <ListItemDescription>USD</ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem className='w-full' onClick={() => {}}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Full width (fills parent)</ListItemTitle>
            <ListItemDescription>
              Stretches to container width
            </ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} className='text-muted' />
        </ListItemTrailing>
      </ListItem>
    </div>
  ),
};

export const CompositionShowcase: Story = {
  render: () => (
    <div className='flex max-w-320 flex-col gap-4'>
      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Simple composition</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Content Variant</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>42.10</ListItemTitle>
            <ListItemDescription>USD</ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Content Variant</ListItemTitle>
            <ListItemDescription>Custom style</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>USD</ListItemTitle>
            <ListItemDescription className='text-error'>
              -7.53%
            </ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Content Variant</ListItemTitle>
            <ListItemDescription>Custom style</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>USD</ListItemTitle>
            <ListItemDescription className='text-success'>
              +7.53%
            </ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Content Variant</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <div className='body-2-semi-bold'>$3,000</div>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Tag Variant</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Tag size='sm' label='New' appearance='accent' />
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemContentRow>
              <ListItemTitle>Complex 1</ListItemTitle>
              <Tag size='sm' label='New' appearance='base' />
            </ListItemContentRow>
            <ListItemContentRow>
              <ListItemDescription>With description</ListItemDescription>
              <Tag size='sm' label='Custom Tag' appearance='gray' />
            </ListItemContentRow>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>42.10</ListItemTitle>
            <ListItemDescription>USD</ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Complex 2</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemContentRow>
              <Tag size='sm' label='New' appearance='base' />
              <ListItemTitle>1200.12</ListItemTitle>
            </ListItemContentRow>
            <ListItemContentRow>
              <Tag size='sm' label='BTC' appearance='gray' />
            </ListItemContentRow>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>
    </div>
  ),
};
