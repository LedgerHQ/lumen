import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Settings, Wallet, ChevronRight } from '../../Symbols';
import { Switch } from '../Switch';
import { Tag } from '../Tag/Tag';
import {
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
  ListItemSpot,
  ListItemIcon,
  ListItemTruncate,
} from './ListItem';

const meta: Meta<typeof ListItem> = {
  component: ListItem,
  title: 'Containment/ListItem',
  subcomponents: {
    ListItemLeading,
    ListItemContent,
    ListItemTitle,
    ListItemDescription,
    ListItemTrailing,
    ListItemSpot,
    ListItemIcon,
    ListItemTruncate,
  },
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
    onClick: {
      action: 'clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ListItem>;

export const Base: Story = {
  args: {
    className: 'max-w-320 gap-4',
  },
  render: (args) => (
    <ListItem {...args}>
      <ListItemLeading>
        <ListItemSpot appearance='icon' icon={Settings} />
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

export const VariantsShowcase: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);

    return (
      <div className='flex max-w-320 flex-col gap-4'>
        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Simple composition</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
        </ListItem>

        <ListItem onClick={() => setSelected(!selected)}>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Wallet} />
            <ListItemContent>
              <ListItemTitle>Switch Variant</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <Switch tabIndex={-1} selected={selected} />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Wallet} />
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
            <ListItemSpot appearance='icon' icon={Wallet} />
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
            <ListItemSpot appearance='icon' icon={Wallet} />
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
            <ListItemSpot appearance='icon' icon={Settings} />
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
            <ListItemSpot appearance='icon' icon={Settings} />
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
            <ListItemSpot appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Icon Variant</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ListItemIcon className='text-muted' icon={ChevronRight} />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <ListItemIcon icon={Wallet} />
            <ListItemContent>
              <ListItemTitle>Icon without Spot</ListItemTitle>
              <ListItemDescription>Using ListItemIcon</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ListItemIcon className='text-muted' icon={ChevronRight} />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Wallet} />
            <ListItemContent>
              <ListItemTitle className='flex gap-6'>
                <ListItemTruncate>Complex 1</ListItemTruncate>
                <Tag size='sm' label='New' appearance='base' />
              </ListItemTitle>
              <ListItemDescription className='flex gap-6'>
                <ListItemTruncate>With description</ListItemTruncate>
                <Tag size='sm' label='Custom Tag' appearance='gray' />
              </ListItemDescription>
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
            <ListItemSpot appearance='icon' icon={Wallet} />
            <ListItemContent>
              <ListItemTitle>Complex 2</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ListItemContent>
              <ListItemTitle className='flex gap-6'>
                <Tag size='sm' label='New' appearance='base' />
                <ListItemTruncate>1200.12</ListItemTruncate>
              </ListItemTitle>
              <ListItemDescription className='flex gap-6'>
                <Tag size='sm' label='BTC' appearance='gray' />
              </ListItemDescription>
            </ListItemContent>
          </ListItemTrailing>
        </ListItem>
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
          <ListItemSpot appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Disabled Item</ListItemTitle>
            <ListItemDescription>This item is disabled</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Switch selected={false} disabled={args.disabled} />
        </ListItemTrailing>
      </ListItem>

      <ListItem {...args}>
        <ListItemLeading>
          <ListItemSpot appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Disabled Item</ListItemTitle>
            <ListItemDescription>This item is disabled</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemIcon className='text-disabled' icon={ChevronRight} />
        </ListItemTrailing>
      </ListItem>

      <ListItem {...args}>
        <ListItemLeading>
          <ListItemSpot appearance='icon' icon={Wallet} />
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
          <ListItemIcon icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Icon without Spot</ListItemTitle>
            <ListItemDescription>Using ListItemIcon</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div className='grid w-400 grid-cols-1 gap-4 border border-muted-subtle p-16'>
      <div className='body-4-semi-bold text-muted'>Container: 320px wide</div>
      <div>
        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Short Title</ListItemTitle>
              <ListItemDescription>Short description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ListItemIcon className='text-muted' icon={ChevronRight} />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>
                Long Title that should truncate appropriately
              </ListItemTitle>
              <ListItemDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ListItemIcon className='text-muted' icon={ChevronRight} />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Wallet} />
            <ListItemContent>
              <ListItemTitle className='flex gap-6'>
                <ListItemTruncate>
                  Long Title that should truncate appropriately
                </ListItemTruncate>
                <Tag size='sm' label='New' appearance='base' />
              </ListItemTitle>
              <ListItemDescription className='flex gap-6'>
                <ListItemTruncate>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos.
                </ListItemTruncate>
                <Tag size='sm' label='Custom Tag' appearance='gray' />
              </ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ListItemContent>
              <ListItemTitle>42.10</ListItemTitle>
              <ListItemDescription>USD</ListItemDescription>
            </ListItemContent>
          </ListItemTrailing>
        </ListItem>
      </div>
    </div>
  ),
};
