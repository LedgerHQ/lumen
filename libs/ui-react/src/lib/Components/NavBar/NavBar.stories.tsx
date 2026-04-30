import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreHorizontal, Settings } from '../../Symbols';
import { IconButton } from '../IconButton';
import {
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarDescription,
  NavBarLeading,
  NavBarTitle,
  NavBarTrailing,
} from './NavBar';

type PlaygroundArgs = {
  title: string;
  showBackButton: boolean;
  showTrailing: boolean;
  showCoinCapsule: boolean;
};

const meta: Meta<typeof NavBar> = {
  component: NavBar,
  title: 'Navigation/NavBar',
  subcomponents: {
    NavBarBackButton,
    NavBarTitle,
    NavBarDescription,
    NavBarLeading,
    NavBarTrailing,
    NavBarCoinCapsule,
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
    children: {
      control: false,
    },
    className: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Base: StoryObj<PlaygroundArgs> = {
  args: {
    title: 'Page Title',
  },

  parameters: {
    docs: {
      source: {
        code: `
        <NavBar>
        <NavBarBackButton onClick={() => navigate(-1)} />
        <NavBarLeading>
          <NavBarTitle>Page Title</NavBarTitle>
        </NavBarLeading>
        <NavBarTrailing>
          <IconButton
            appearance="gray"
            size="sm"
            icon={Settings}
            aria-label="Settings"
          />
        </NavBarTrailing>
      </NavBar>
      `,
      },
    },
  },
  render: () => (
    <NavBar>
      <NavBarBackButton onClick={() => console.log('Back clicked')} />
      <NavBarLeading>
        <NavBarTitle>Page Title</NavBarTitle>
      </NavBarLeading>
      <NavBarTrailing>
        <IconButton
          appearance='gray'
          size='sm'
          icon={Settings}
          aria-label='Settings'
        />
      </NavBarTrailing>
    </NavBar>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <NavBar>
      <NavBarBackButton onClick={() => console.log('Back clicked')} />
      <NavBarLeading>
        <NavBarTitle>Page Title</NavBarTitle>
        <NavBarDescription>Page Description</NavBarDescription>
      </NavBarLeading>
    </NavBar>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<NavBar>
  <NavBarBackButton onClick={() => navigate(-1)} />
  <NavBarLeading>
    <NavBarTitle>Page Title</NavBarTitle>
    <NavBarDescription>Page Description</NavBarDescription>
  </NavBarLeading>
</NavBar>
        `,
      },
    },
  },
};

export const WithoutTrailing: Story = {
  render: () => (
    <NavBar>
      <NavBarBackButton onClick={() => console.log('Back clicked')} />
      <NavBarLeading>
        <NavBarTitle>Settings</NavBarTitle>
      </NavBarLeading>
    </NavBar>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<NavBar>
  <NavBarBackButton onClick={() => navigate(-1)} />
  <NavBarTitle>Settings</NavBarTitle>
</NavBar>
        `,
      },
    },
  },
};

export const WithoutTitle: Story = {
  render: () => (
    <NavBar>
      <NavBarBackButton onClick={() => console.log('Back clicked')} />
      <NavBarTrailing>
        <IconButton
          appearance='gray'
          size='sm'
          icon={Settings}
          aria-label='Settings'
        />
      </NavBarTrailing>
    </NavBar>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<NavBar>
  <NavBarBackButton onClick={() => navigate(-1)} />
  <NavBarTrailing>
    <IconButton
      appearance="gray"
      size="sm"
      icon={Settings}
      aria-label="Settings"
    />
  </NavBarTrailing>
</NavBar>
        `,
      },
    },
  },
};

export const WithMultipleTrailingActions: Story = {
  render: () => (
    <NavBar>
      <NavBarBackButton onClick={() => console.log('Back clicked')} />
      <NavBarLeading>
        <NavBarTitle>Account Details</NavBarTitle>
      </NavBarLeading>
      <NavBarTrailing>
        <IconButton
          appearance='no-background'
          size='sm'
          icon={Settings}
          aria-label='Settings'
        />
        <IconButton
          appearance='gray'
          size='sm'
          icon={MoreHorizontal}
          aria-label='More options'
        />
      </NavBarTrailing>
    </NavBar>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<NavBar>
  <NavBarBackButton onClick={() => navigate(-1)} />
  <NavBarLeading>
  <NavBarTitle>Account Details</NavBarTitle>
  </NavBarLeading>
  <NavBarTrailing>
    <IconButton
      appearance="no-background"
      size="sm"
      icon={Settings}
      aria-label="Settings"
    />
    <IconButton
      appearance="gray"
      size="sm"
      icon={MoreHorizontal}
      aria-label="More options"
    />
  </NavBarTrailing>
</NavBar>
        `,
      },
    },
  },
};

export const WithCoinCapsule: Story = {
  name: 'With NavBarCoinCapsule',
  render: () => (
    <NavBar>
      <NavBarBackButton onClick={() => console.log('Back clicked')} />
      <NavBarCoinCapsule
        ticker='BTC'
        icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />}
      />
      <NavBarTrailing>
        <IconButton
          appearance='gray'
          size='sm'
          icon={MoreHorizontal}
          aria-label='More options'
        />
      </NavBarTrailing>
    </NavBar>
  ),
  parameters: {
    docs: {
      source: {
        code: `
import { CryptoIcon } from '@ledgerhq/crypto-icons';
import { NavBar, NavBarBackButton, NavBarCoinCapsule, NavBarTrailing, IconButton } from '@ledgerhq/lumen-ui-react';

<NavBar>
  <NavBarBackButton onClick={() => navigate(-1)} />
  <NavBarCoinCapsule ticker="BTC" icon={<CryptoIcon ledgerId="bitcoin" ticker="BTC" size="24px" />} />
  <NavBarTrailing>
    <IconButton
      appearance="gray"
      size="sm"
      icon={MoreHorizontal}
      aria-label="More options"
    />
  </NavBarTrailing>
</NavBar>
        `,
      },
    },
  },
};
