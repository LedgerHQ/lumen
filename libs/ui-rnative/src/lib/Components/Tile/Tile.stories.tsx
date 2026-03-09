import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React from 'react';
import { Settings, Plus, User, Apps, ChevronRight } from '../../Symbols';
import { Spot } from '../Spot';
import { Tag } from '../Tag/Tag';
import { Box, Text } from '../Utility';
import {
  Tile,
  TileLeading,
  TileContent,
  TileTitle,
  TileDescription,
  TileTrailing,
} from './Tile';

const meta: Meta<typeof Tile> = {
  component: Tile,
  subcomponents: {
    TileLeading,
    TileContent,
    TileTitle,
    TileDescription,
    TileTrailing,
  },
  title: 'Containment/Tile',
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
    onPress: {
      action: 'pressed',
    },
    onLongPress: {
      action: 'long pressed',
    },
    appearance: {
      control: 'select',
      options: ['no-background', 'card'],
    },
    disabled: {
      control: 'boolean',
    },
    centered: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tile>;

export const Base: Story = {
  args: {
    appearance: 'no-background',
    disabled: false,
    centered: false,
  },
  render: (args) => (
    <Tile {...args} lx={{ maxWidth: 's112' }}>
      <TileLeading>
        <Spot appearance='icon' icon={Settings} />
        <TileContent>
          <TileTitle>Item with Spot and Description</TileTitle>
          <TileDescription>Additional information</TileDescription>
        </TileContent>
      </TileLeading>
    </Tile>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Tile lx={{ maxWidth: 's112' }}>
  <TileLeading>
    <Spot appearance="icon" icon={Settings} />
    <TileContent>
      <TileTitle>Item with Spot and Description</TileTitle>
      <TileDescription>Additional information</TileDescription>
    </TileContent>
  </TileLeading>
</Tile>
`,
      },
    },
  },
};

export const VariantsShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Tile lx={{ maxWidth: 's176' }}>
        <TileLeading>
          <Spot appearance='icon' icon={User} />
          <TileContent>
            <TileTitle>User</TileTitle>
            <TileDescription>With description</TileDescription>
          </TileContent>
        </TileLeading>
      </Tile>
      <Tile lx={{ maxWidth: 's176' }}>
        <TileLeading>
          <Spot appearance='icon' icon={Plus} />
          <TileContent>
            <TileTitle>Without Description</TileTitle>
          </TileContent>
        </TileLeading>
      </Tile>
      <Tile lx={{ maxWidth: 's176' }}>
        <TileLeading>
          <Spot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>With Trailing Content</TileTitle>
            <TileDescription>Additional information</TileDescription>
          </TileContent>
          <Tag label='Custom' appearance='base' />
        </TileLeading>
      </Tile>
      <Tile lx={{ maxWidth: 's176' }}>
        <TileLeading>
          <Spot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>With Trailing Content</TileTitle>
            <TileDescription>Additional information</TileDescription>
          </TileContent>
          <Text typography='body2SemiBold' lx={{ color: 'success' }}>
            +7.87%
          </Text>
        </TileLeading>
      </Tile>
    </Box>
  ),
};

export const WithSecondaryAction: Story = {
  render: () => (
    <Tile
      onLongPress={() => alert('Long press - secondary action triggered!')}
      lx={{ maxWidth: 's176' }}
    >
      <TileLeading>
        <Spot appearance='icon' icon={Settings} />
        <TileContent>
          <TileTitle>Long Press Me</TileTitle>
          <TileDescription>Try long pressing this tile</TileDescription>
        </TileContent>
      </TileLeading>
    </Tile>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Tile
  onLongPress={() => alert('Long press - secondary action triggered!')}
  lx={{ maxWidth: 's160' }}
>
  <TileLeading>
    <Spot appearance="icon" icon={Settings} />
    <TileContent>
      <TileTitle>Long Press Me</TileTitle>
      <TileDescription>Try long pressing this tile</TileDescription>
    </TileContent>
  </TileLeading>
</Tile>
`,
      },
    },
  },
};

export const HorizontalList: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Box
        lx={{
          position: 'relative',
          flexDirection: 'row',
          width: 's480',
          backgroundColor: 'base',
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Tile key={`list-1-${i}`}>
            <TileLeading>
              <Spot appearance='icon' icon={Apps} />
              <TileContent>
                <TileTitle>Item {i + 1}</TileTitle>
                <TileDescription>Description {i + 1}</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
        ))}
      </Box>
      <Box
        lx={{
          flexDirection: 'row',
          width: 's480',
          position: 'relative',
          backgroundColor: 'base',
          overflow: 'scroll',
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Tile key={`list-2-${i}`} lx={{ width: 's128', flexShrink: 0 }}>
            <TileLeading>
              <Spot appearance='icon' icon={Apps} />
              <TileContent>
                <TileTitle>Item {i + 1}</TileTitle>
                <TileDescription>
                  Long description that should truncate appropriately
                </TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
        ))}
      </Box>
    </Box>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box lx={{ width: 'full', flexDirection: 'column', gap: 's16' }}>
      <Box>
        <Tile>
          <TileLeading>
            <Spot appearance='icon' icon={Apps} />
            <TileContent>
              <TileTitle>Item fill width</TileTitle>
              <TileDescription>Description fill width</TileDescription>
            </TileContent>
          </TileLeading>
        </Tile>
      </Box>
      <Box lx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Tile lx={{ width: 's224' }}>
          <TileLeading>
            <Spot appearance='icon' icon={Plus} />
            <TileContent>
              <TileTitle>Long Item with fixed width</TileTitle>
              <TileDescription>
                lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </TileDescription>
            </TileContent>
          </TileLeading>
        </Tile>
      </Box>
    </Box>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's24' }}>
      <Box>
        <Box lx={{ marginBottom: 's8' }}>
          <Text typography='body2SemiBold'>No Background</Text>
        </Box>
        <Box lx={{ flexDirection: 'row', gap: 's16' }}>
          <Tile appearance='no-background' lx={{ width: 's112' }}>
            <TileLeading>
              <Spot appearance='icon' icon={Settings} />
              <TileContent>
                <TileTitle>Press me</TileTitle>
                <TileDescription>Press state</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
          <Tile appearance='no-background' disabled lx={{ width: 's112' }}>
            <TileLeading>
              <Spot appearance='icon' icon={Settings} />
              <TileContent>
                <TileTitle>Disabled</TileTitle>
                <TileDescription>Disabled state</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
        </Box>
      </Box>
      <Box>
        <Box lx={{ marginBottom: 's8' }}>
          <Text typography='body2SemiBold'>Card</Text>
        </Box>
        <Box lx={{ flexDirection: 'row', gap: 's16' }}>
          <Tile appearance='card' lx={{ width: 's112' }}>
            <TileLeading>
              <Spot appearance='icon' icon={User} />
              <TileContent>
                <TileTitle>Press me</TileTitle>
                <TileDescription>Press state</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
          <Tile appearance='card' disabled lx={{ width: 's112' }}>
            <TileLeading>
              <Spot appearance='icon' icon={User} />
              <TileContent>
                <TileTitle>Disabled</TileTitle>
                <TileDescription>Disabled state</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
        </Box>
      </Box>
    </Box>
  ),
};

export const CenteredShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', gap: 's8' }}>
      <Tile appearance='card' lx={{ width: 's128' }}>
        <TileLeading>
          <Spot appearance='icon' icon={Apps} />
          <TileContent>
            <TileTitle>Title</TileTitle>
            <TileDescription>Description</TileDescription>
          </TileContent>
          <Tag label='Label' appearance='base' />
        </TileLeading>
      </Tile>
      <Tile appearance='card' lx={{ width: 's128' }}>
        <TileLeading>
          <Spot appearance='icon' icon={Apps} />
          <TileContent>
            <TileTitle>Title</TileTitle>
            <TileDescription>Description</TileDescription>
          </TileContent>
          <Tag label='Label' appearance='base' />
        </TileLeading>
      </Tile>
      <Tile appearance='card' lx={{ width: 's128' }}>
        <TileLeading>
          <Spot appearance='icon' icon={Apps} />
          <TileContent>
            <TileTitle>Title</TileTitle>
            <TileDescription>Description</TileDescription>
          </TileContent>
          <Tag label='Label' appearance='base' />
        </TileLeading>
      </Tile>
      <Tile appearance='card' centered lx={{ width: 's128' }}>
        <TileLeading>
          <Spot appearance='icon' icon={ChevronRight} />
          <TileContent>
            <TileTitle>Show more</TileTitle>
          </TileContent>
        </TileLeading>
      </Tile>
    </Box>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's24' }}>
      <Box>
        <Box lx={{ marginBottom: 's8' }}>
          <Text typography='body2SemiBold'>Size 48 (default)</Text>
        </Box>
        <Box lx={{ flexDirection: 'row', gap: 's16' }}>
          <Tile appearance='card' lx={{ width: 's112' }}>
            <TileLeading>
              <Spot appearance='icon' icon={Settings} size={48} />
              <TileContent>
                <TileTitle>Settings</TileTitle>
                <TileDescription>Size 48</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
          <Tile appearance='card' lx={{ width: 's112' }}>
            <TileLeading>
              <Spot appearance='check' size={48} />
              <TileContent>
                <TileTitle>Check</TileTitle>
                <TileDescription>Size 48</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
        </Box>
      </Box>
      <Box>
        <Box lx={{ marginBottom: 's8' }}>
          <Text typography='body2SemiBold'>Size 40</Text>
        </Box>
        <Box lx={{ flexDirection: 'row', gap: 's16' }}>
          <Tile appearance='card' lx={{ width: 's112' }}>
            <TileLeading>
              <Spot appearance='icon' icon={Settings} size={40} />
              <TileContent>
                <TileTitle>Settings</TileTitle>
                <TileDescription>Size 40</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
          <Tile appearance='card' lx={{ width: 's112' }}>
            <TileLeading>
              <Spot appearance='check' size={40} />
              <TileContent>
                <TileTitle>Check</TileTitle>
                <TileDescription>Size 40</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
        </Box>
      </Box>
    </Box>
  ),
};
