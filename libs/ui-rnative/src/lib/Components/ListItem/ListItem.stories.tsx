import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Settings, ChevronRight, Wallet } from '../../Symbols';
import { Switch } from '../Switch/Switch';
import { Tag } from '../Tag/Tag';
import { Box } from '../Utility';
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
    layout: 'padded',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the list item is disabled',
    },
    onPress: {
      action: 'pressed',
      description: 'The function to be called when the list item is pressed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ListItem>;

export const Base: Story = {
  args: {
    lx: { maxWidth: 's320' },
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
    <ListItemSpot appearance="icon" icon={Settings} />
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
      <Box lx={{ flexDirection: 'column', maxWidth: 's320', gap: 's8' }}>
        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Simple composition</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
        </ListItem>

        <ListItem onPress={() => setSelected(!selected)}>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Wallet} />
            <ListItemContent>
              <ListItemTitle>Switch Variant</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <Switch checked={selected} onCheckedChange={setSelected} />
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
              <ListItemDescription lx={{ color: 'error' }}>
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
              <ListItemDescription lx={{ color: 'success' }}>
                +7.53%
              </ListItemDescription>
            </ListItemContent>
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Tag Variant</ListItemTitle>
              <ListItemDescription>Custom style</ListItemDescription>
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
            <ListItemIcon color='muted' icon={ChevronRight} />
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
            <ListItemIcon color='muted' icon={ChevronRight} />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Wallet} />
            <ListItemContent>
              <ListItemTitle>
                <ListItemTruncate variant='title'>Complex 1</ListItemTruncate>
                <Tag size='sm' label='New' appearance='base' />
              </ListItemTitle>
              <ListItemDescription>
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
              <ListItemTitle>
                <Tag size='sm' label='New' appearance='base' />
                <ListItemTruncate variant='title'>1200.12</ListItemTruncate>
              </ListItemTitle>
              <ListItemDescription>
                <Tag size='sm' label='BTC' appearance='gray' />
              </ListItemDescription>
            </ListItemContent>
          </ListItemTrailing>
        </ListItem>
      </Box>
    );
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Box lx={{ flexDirection: 'column', width: 's320' }}>
      <ListItem {...args}>
        <ListItemLeading>
          <ListItemSpot appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Disabled Item</ListItemTitle>
            <ListItemDescription>This item is disabled</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Switch checked={false} disabled={args.disabled} />
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
          <ListItemIcon color='muted' icon={ChevronRight} />
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
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<ListItem disabled>
  <ListItemLeading>
    <ListItemSpot appearance="icon" icon={Settings} />
    <ListItemContent>
      <ListItemTitle>Disabled Item</ListItemTitle>
      <ListItemDescription>This item is disabled</ListItemDescription>
    </ListItemContent>
  </ListItemLeading>
  <ListItemTrailing>
    <ChevronRight size={24} />
  </ListItemTrailing>
</ListItem>
`,
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box
      lx={{
        width: 's400',
        borderWidth: 's1',
        borderColor: 'mutedSubtle',
        padding: 's16',
      }}
    >
      <Box lx={{ flexDirection: 'column' }}>
        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Short Title</ListItemTitle>
              <ListItemDescription>Short description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ListItemIcon color='muted' icon={ChevronRight} />
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
            <ListItemIcon color='muted' icon={ChevronRight} />
          </ListItemTrailing>
        </ListItem>

        <ListItem>
          <ListItemLeading>
            <ListItemSpot appearance='icon' icon={Wallet} />
            <ListItemContent>
              <ListItemTitle>
                <ListItemTruncate variant='title'>
                  Long Title that should truncate appropriately
                </ListItemTruncate>
                <Tag size='sm' label='New' appearance='base' />
              </ListItemTitle>
              <ListItemDescription>
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
      </Box>
    </Box>
  ),
};
