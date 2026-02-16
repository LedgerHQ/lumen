import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { useTheme } from '../../../styles';
import * as Icons from '../../Symbols';
import { SearchInput } from '../SearchInput/SearchInput';
import { Box, Text, Pressable } from '../Utility';
import type { IconSize } from './types';

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
  color?: string;
};

type IconCardProps = {
  name: string;
  size?: IconSize;
  color?: string;
};

const IconCard = ({ name, size = 24, color }: IconCardProps) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const IconComponent = Icons[name as keyof typeof Icons];
  const iconColor = color ?? theme.colors.text.base;

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
    <Pressable
      key={name}
      onPress={handleClick}
      lx={{
        position: 'relative',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 's8',
        borderRadius: 'sm',
        padding: 's16',
        width: 's96',
      }}
      style={({ pressed }) => ({
        backgroundColor: pressed ? theme.colors.bg.mutedPressed : 'transparent',
      })}
    >
      <IconComponent size={size} style={{ color: iconColor }} />
      <Text typography='body4' lx={{ color: 'muted' }}>
        {name}
      </Text>
      {copied && (
        <Box
          lx={{
            position: 'absolute',
            top: 's0',
            left: 's0',
            right: 's0',
            bottom: 's0',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'sm',
            backgroundColor: 'muted',
          }}
        >
          <Text typography='body4' lx={{ color: 'onAccent' }}>
            Copied!
          </Text>
        </Box>
      )}
    </Pressable>
  );
};

export const Icon: StoryObj<IconStoryProps> = {
  args: {
    size: 24,
    name: 'Home',
  },
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
      description: 'The size of the icon in pixels',
    },
    name: {
      control: 'select',
      options: iconNames,
      description: 'The name of the icon to display',
    },
    color: {
      control: 'color',
      description: 'The color of the icon',
    },
  },
  render: (args) => {
    const { theme } = useTheme();
    const IconComponent = Icons[args.name];
    const iconColor = args.color ?? theme.colors.text.base;

    return (
      <Box lx={{ padding: 's8' }}>
        <Box lx={{ flexDirection: 'column', alignItems: 'center', gap: 's4' }}>
          <IconComponent size={args.size} style={{ color: iconColor }} />
          <Text lx={{ color: 'base' }}>{args.name}</Text>
        </Box>
      </Box>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
        <Information size={24} style={{ color: theme.colors.text.base }} />
      `,
      },
    },
  },
};

export const IconSizes: StoryObj = {
  render: () => {
    const { theme } = useTheme();

    return (
      <Box lx={{ flexDirection: 'column', gap: 's16' }}>
        {sizes.map((size) => (
          <Box key={size} lx={{ flexDirection: 'column' }}>
            <Text typography='heading4' lx={{ marginBottom: 's16' }}>
              Size {size}px
            </Text>
            <Box
              lx={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 's8',
                borderRadius: 'sm',
                padding: 's8',
              }}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border.mutedSubtle,
              }}
            >
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
            </Box>
          </Box>
        ))}
      </Box>
    );
  },
};

export const Gallery: StoryObj = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter icons based on search term
    const filteredIcons = Object.entries(Icons).filter(([name]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
      <Box
        lx={{
          width: 'full',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: 's8',
        }}
      >
        {/* Search bar */}
        <Box lx={{ marginBottom: 's32' }}>
          <Box lx={{ marginBottom: 's8', maxWidth: 's320' }}>
            <SearchInput
              placeholder='Search icons...'
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </Box>

          {/* Results count */}
          <Box lx={{ marginBottom: 's4' }}>
            <Text typography='body3' lx={{ marginLeft: 's8', color: 'muted' }}>
              {filteredIcons.length} of {Object.keys(Icons).length} icons
              {searchTerm && ` matching "${searchTerm}"`}
            </Text>
          </Box>
        </Box>

        {/* Icon grid - using flexWrap for RN compatibility */}
        <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's8' }}>
          {filteredIcons.map(([name]) => (
            <IconCard key={name} name={name} />
          ))}
        </Box>

        {/* No results message */}
        {filteredIcons.length === 0 && searchTerm && (
          <Box
            lx={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 's16',
            }}
          >
            <Text typography='body2' lx={{ color: 'muted' }}>
              No icons found matching "{searchTerm}"
            </Text>
            <Pressable
              onPress={() => setSearchTerm('')}
              style={({ pressed }) => ({
                marginTop: 16,
                color: pressed
                  ? theme.colors.text.interactivePressed
                  : theme.colors.text.interactive,
              })}
            >
              <Text typography='body2' lx={{ color: 'interactive' }}>
                Clear search
              </Text>
            </Pressable>
          </Box>
        )}
      </Box>
    );
  },
};
