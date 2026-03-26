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

const meta: Meta<typeof ListItem> = {
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

export const VariantsShowcase: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);

    return (
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

        <ListItem onClick={() => setSelected(!selected)}>
          <ListItemLeading>
            <Spot size={48} appearance='icon' icon={Wallet} />
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
            <Spot size={48} appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Icon Variant</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ChevronRight size={24} className='text-muted' />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
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

      <ListItem {...args}>
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
            <Spot size={48} appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Short Title</ListItemTitle>
              <ListItemDescription>Short description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ChevronRight size={24} className='text-muted' />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <Spot size={48} appearance='icon' icon={Settings} />
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
            <ChevronRight size={24} className='text-muted' />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <Spot size={48} appearance='icon' icon={Wallet} />
            <ListItemContent>
              <ListItemContentRow>
                <ListItemTitle>
                  Long Title that should truncate appropriately
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
      </div>
    </div>
  ),
};
