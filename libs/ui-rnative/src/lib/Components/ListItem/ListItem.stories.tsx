import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Settings, ChevronRight, Wallet } from '../../Symbols';
import { Spot } from '../Spot';
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
      <Box lx={{ flexDirection: 'column', maxWidth: 's320', gap: 's8' }}>
        <ListItem>
          <ListItemLeading>
            <Spot size={48} appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Simple composition</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
        </ListItem>

        <ListItem onPress={() => setSelected(!selected)}>
          <ListItemLeading>
            <Spot size={48} appearance='icon' icon={Wallet} />
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
              <ListItemDescription lx={{ color: 'error' }}>
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
              <ListItemDescription lx={{ color: 'success' }}>
                +7.53%
              </ListItemDescription>
            </ListItemContent>
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

        <ListItem onPress={() => {}}>
          <ListItemLeading>
            <Spot size={48} appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Icon Variant</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ChevronRight size={24} />
          </ListItemTrailing>
        </ListItem>

        <ListItem onPress={() => {}}>
          <ListItemLeading>
            <Wallet size={24} />
            <ListItemContent>
              <ListItemTitle>Icon without Spot</ListItemTitle>
              <ListItemDescription>With icon</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ChevronRight size={24} />
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
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Disabled Item</ListItemTitle>
            <ListItemDescription>This item is disabled</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Switch checked={false} disabled={args.disabled} />
        </ListItemTrailing>
      </ListItem>

      <ListItem {...args} onPress={() => {}}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Disabled Item</ListItemTitle>
            <ListItemDescription>This item is disabled</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
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
            <ListItemDescription>With icon</ListItemDescription>
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
    <Spot appearance="icon" icon={Settings} />
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

export const Density: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', maxWidth: 's320', gap: 's8' }}>
      <ListItem density='compact' onPress={() => {}}>
        <ListItemLeading>
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />
          <ListItemContent>
            <ListItemTitle>Compact with icon</ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
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
          <ListItemTitle>$3,000</ListItemTitle>
        </ListItemTrailing>
      </ListItem>

      <ListItem density='expanded' onPress={() => {}}>
        <ListItemLeading>
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
          <ListItemContent>
            <ListItemTitle>Expanded with icon</ListItemTitle>
            <ListItemDescription>Additional information</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
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
          <ListItemTitle>$3,000</ListItemTitle>
        </ListItemTrailing>
      </ListItem>
    </Box>
  ),
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
        <ListItem onPress={() => {}}>
          <ListItemLeading>
            <Spot size={48} appearance='icon' icon={Settings} />
            <ListItemContent>
              <ListItemTitle>Short Title</ListItemTitle>
              <ListItemDescription>Short description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ChevronRight size={24} />
          </ListItemTrailing>
        </ListItem>

        <ListItem onPress={() => {}}>
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
            <ChevronRight size={24} />
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
      </Box>
    </Box>
  ),
};
