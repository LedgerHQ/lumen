import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { MoreHorizontal, Settings } from '../../Symbols';
import { IconButton } from '../IconButton';
import { Box } from '../Utility';
import {
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarDescription,
  NavBarTitle,
} from './NavBar';

const meta: Meta<typeof NavBar> = {
  component: NavBar,
  title: 'Navigation/NavBar',
  subcomponents: {
    NavBarBackButton,
    NavBarTitle,
    NavBarDescription,
    NavBarCoinCapsule,
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
    appearance: {
      control: 'select',
      options: ['compact', 'expanded', 'with-asset'],
      description: 'Controls the appearance/layout of the NavBar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Base: Story = {
  args: {
    appearance: 'compact',
    lx: {
      width: 's480',
    },
  },
  render: (args) => (
    <NavBar {...args}>
      <NavBarBackButton onPress={() => console.log('Back pressed')} />
      <NavBarTitle>Page Title</NavBarTitle>
      <IconButton
        appearance='no-background'
        size='md'
        icon={MoreHorizontal}
        accessibilityLabel='More options'
      />
    </NavBar>
  ),
};

export const Expanded: Story = {
  args: {
    appearance: 'expanded',
    lx: {
      width: 's480',
    },
  },
  render: (args) => (
    <NavBar {...args}>
      <NavBarBackButton onPress={() => console.log('Back pressed')} />
      <NavBarTitle>Account Details</NavBarTitle>
      <NavBarDescription>View and manage your account</NavBarDescription>
      <IconButton
        appearance='no-background'
        size='md'
        icon={Settings}
        accessibilityLabel='Settings'
      />
    </NavBar>
  ),
};

export const WithAsset: Story = {
  args: {
    appearance: 'with-asset',
    lx: {
      width: 's480',
    },
  },
  render: (args) => (
    <NavBar {...args}>
      <NavBarBackButton onPress={() => console.log('Back pressed')} />
      <NavBarCoinCapsule
        ticker='BTC'
        icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />}
      />
      <IconButton
        appearance='no-background'
        size='md'
        icon={MoreHorizontal}
        accessibilityLabel='More options'
      />
    </NavBar>
  ),
};

export const TruncationShowcase: Story = {
  args: {
    lx: {
      width: 's480',
    },
  },
  render: (args) => (
    <Box lx={{ gap: 's16' }}>
      <NavBar {...args} appearance='compact'>
        <NavBarBackButton onPress={() => console.log('Back pressed')} />
        <NavBarTitle>
          This is a very long title that will be truncated on a single line
        </NavBarTitle>
      </NavBar>

      <NavBar {...args} appearance='expanded'>
        <NavBarBackButton onPress={() => console.log('Back pressed')} />
        <NavBarTitle>
          This is a very long title in expanded mode with multiple lines of text
          that demonstrates the two-line truncation behavior when the content
          exceeds the available space in the navigation bar
        </NavBarTitle>
        <NavBarDescription>
          And this description also truncates when it gets too long for the
          available space in the navigation bar
        </NavBarDescription>
      </NavBar>
    </Box>
  ),
};
