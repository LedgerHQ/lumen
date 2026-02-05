import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { MoreHorizontal, Settings } from '../../Symbols';
import { IconButton } from '../IconButton';
import {
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarContent,
  NavBarDescription,
  NavBarTitle,
} from './NavBar';

const meta: Meta<typeof NavBar> = {
  component: NavBar,
  title: 'Navigation/NavBar',
  subcomponents: {
    NavBarBackButton,
    NavBarContent,
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
      options: ['compact', 'expanded'],
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
      <NavBarContent>
        <NavBarTitle>Title</NavBarTitle>
        <NavBarDescription>Description</NavBarDescription>
      </NavBarContent>
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
      <NavBarContent>
        <NavBarTitle>Account Details</NavBarTitle>
        <NavBarDescription>View and manage your account</NavBarDescription>
      </NavBarContent>
      <IconButton
        appearance='no-background'
        size='md'
        icon={Settings}
        accessibilityLabel='Settings'
      />
    </NavBar>
  ),
};

export const WithCoinCapsule: Story = {
  args: {
    appearance: 'compact',
    lx: {
      width: 's480',
    },
  },
  render: (args) => (
    <NavBar {...args}>
      <NavBarBackButton onPress={() => console.log('Back pressed')} />
      <NavBarContent>
        <NavBarCoinCapsule
          ticker='BTC'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />}
        />
      </NavBarContent>
      <IconButton
        appearance='no-background'
        size='md'
        icon={MoreHorizontal}
        accessibilityLabel='More options'
      />
    </NavBar>
  ),
};
