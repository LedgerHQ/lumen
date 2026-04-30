import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Settings, ChevronRight, Wallet } from '../../Symbols';
import { MediaImage } from '../MediaImage';
import { Spot } from '../Spot';
import { Switch } from '../Switch/Switch';
import { Tag } from '../Tag/Tag';
import { Box, Text } from '../Utility';
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
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof ListItem>;

export const Base: Story = {
  args: {
    density: 'expanded',
    lx: { maxWidth: 's320' },
  },
  render: (args) => (
    <ListItem {...args}>
      <ListItemLeading>
        <Spot
          appearance='icon'
          icon={Settings}
          size={args.density === 'compact' ? 32 : 48}
        />
        <ListItemContent>
          <ListItemTitle>Item with Icon and Description</ListItemTitle>
          {args.density === 'expanded' && (
            <ListItemDescription>Additional information</ListItemDescription>
          )}
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
    <Spot appearance="icon" icon={Settings} size={density === 'compact' ? 32 : 48} />
    <ListItemContent>
      <ListItemTitle>Item with Icon and Description</ListItemTitle>
      {density === 'expanded' && (
        <ListItemDescription>Additional information</ListItemDescription>
      )}
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
    <Box lx={{ flexDirection: 'column', maxWidth: 's320', gap: 's8' }}>
      <ListItem density='compact' onPress={() => {}}>
        <ListItemLeading>
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />
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
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={48} />
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

export const InteractiveShowcase: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);

    return (
      <Box lx={{ flexDirection: 'column', maxWidth: 's320', gap: 's16' }}>
        <Box lx={{ flexDirection: 'column', gap: 's8' }}>
          <Text typography='body4SemiBold' lx={{ color: 'muted' }}>
            Info
          </Text>
          <ListItem>
            <ListItemLeading>
              <Spot size={48} appearance='icon' icon={Settings} />
              <ListItemContent>
                <ListItemTitle>Display only</ListItemTitle>
                <ListItemDescription>No press feedback</ListItemDescription>
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
                <ListItemDescription>Not pressable</ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
            <ListItemTrailing>
              <Tag size='sm' label='New' appearance='accent' />
            </ListItemTrailing>
          </ListItem>
        </Box>

        <Box lx={{ flexDirection: 'column', gap: 's8' }}>
          <Text typography='body4SemiBold' lx={{ color: 'muted' }}>
            Interactive
          </Text>
          <ListItem onPress={() => {}}>
            <ListItemLeading>
              <Spot size={48} appearance='icon' icon={Settings} />
              <ListItemContent>
                <ListItemTitle>Navigation</ListItemTitle>
                <ListItemDescription>Press feedback styles</ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
            <ListItemTrailing>
              <ChevronRight size={24} />
            </ListItemTrailing>
          </ListItem>

          <ListItem onPress={() => setSelected(!selected)}>
            <ListItemLeading>
              <Spot size={48} appearance='icon' icon={Wallet} />
              <ListItemContent>
                <ListItemTitle>Toggle</ListItemTitle>
                <ListItemDescription>Press to toggle</ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
            <ListItemTrailing>
              <Switch checked={selected} onCheckedChange={setSelected} />
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
        </Box>
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

export const ResponsiveLayout: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', width: 's480', gap: 's32' }}>
      <ListItem lx={{ alignSelf: 'flex-start' }} onPress={() => {}}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Fit content</ListItemTitle>
            <ListItemDescription>Short</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
        </ListItemTrailing>
      </ListItem>

      <ListItem lx={{ width: 's320' }} onPress={() => {}}>
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
          <ChevronRight size={24} />
        </ListItemTrailing>
      </ListItem>

      <ListItem lx={{ width: 's320' }}>
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

      <ListItem lx={{ width: 'full' }} onPress={() => {}}>
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
          <ChevronRight size={24} />
        </ListItemTrailing>
      </ListItem>
    </Box>
  ),
};

export const CompositionShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', maxWidth: 's320', gap: 's8' }}>
      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Simple composition</ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Crypto icon</ListItemTitle>
            <ListItemContentRow>
              <ListItemDescription>Inline with description</ListItemDescription>
              <MediaImage
                src='https://crypto-icons.ledger.com/ALGO.png'
                alt='Algorand'
                size={20}
              />
            </ListItemContentRow>
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
  ),
};
