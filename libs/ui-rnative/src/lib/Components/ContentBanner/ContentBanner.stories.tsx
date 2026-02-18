import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React from 'react';
import { Settings, Wallet } from '../../Symbols';
import { Button } from '../Button';
import { Spot } from '../Spot';
import { Stepper } from '../Stepper';
import { Box, Text } from '../Utility';
import {
  ContentBanner,
  ContentBannerContent,
  ContentBannerDescription,
  ContentBannerTitle,
} from './ContentBanner';

const meta: Meta<typeof ContentBanner> = {
  component: ContentBanner,
  title: 'Communication/ContentBanner',
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
    onClose: {
      control: 'select',
      description: 'Close action callback',
      options: ['With Close', 'None'],
      mapping: {
        'With Close': () => {
          console.log('Close clicked');
        },
        None: undefined,
      },
    },
    closeAccessibilityLabel: {
      control: 'text',
      description: 'Accessibility label for the close button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContentBanner>;

export const Base: Story = {
  args: {
    closeAccessibilityLabel: 'Close content banner',
  },
  render: (args) => (
    <Box lx={{ maxWidth: 's400' }}>
      <ContentBanner {...args}>
        <Spot appearance='icon' icon={Settings} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>Content Banner</ContentBannerTitle>
          <ContentBannerDescription>
            This is a description for the content banner.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<ContentBanner>
  <Spot appearance="icon" icon={Settings} size={48} />
  <ContentBannerContent>
    <ContentBannerTitle>Content Banner</ContentBannerTitle>
    <ContentBannerDescription>
      This is a description for the content banner.
    </ContentBannerDescription>
  </ContentBannerContent>
</ContentBanner>
`,
      },
    },
  },
};

export const WithClose: Story = {
  render: () => {
    const [visible, setVisible] = React.useState(true);

    if (!visible) {
      return (
        <Button
          appearance='transparent'
          size='sm'
          onPress={() => setVisible(true)}
        >
          Show banner again
        </Button>
      );
    }

    return (
      <Box lx={{ maxWidth: 's400' }}>
        <ContentBanner
          onClose={() => setVisible(false)}
          closeAccessibilityLabel='Close content banner'
        >
          <Spot appearance='icon' icon={Settings} size={48} />
          <ContentBannerContent>
            <ContentBannerTitle>Dismissible Banner</ContentBannerTitle>
            <ContentBannerDescription>
              Press the close button to dismiss this banner.
            </ContentBannerDescription>
          </ContentBannerContent>
        </ContentBanner>
      </Box>
    );
  },
};

export const ContentVariationsShowcase: Story = {
  render: () => (
    <Box
      lx={{
        flexDirection: 'column',
        maxWidth: 's400',
        gap: 's16',
        padding: 's8',
      }}
    >
      <ContentBanner>
        <Spot appearance='icon' icon={Settings} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>Title Only</ContentBannerTitle>
        </ContentBannerContent>
      </ContentBanner>

      <ContentBanner>
        <Spot appearance='icon' icon={Wallet} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>Title with Description</ContentBannerTitle>
          <ContentBannerDescription>
            This is a description for the content banner.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>

      <ContentBanner onClose={() => console.log('close')}>
        <Spot appearance='icon' icon={Wallet} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>With Close Button</ContentBannerTitle>
          <ContentBannerDescription>
            A content banner with a leading icon and close button.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>

      <ContentBanner onClose={() => console.log('close')}>
        <Spot appearance='icon' icon={Settings} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>
            Longer Title That Demonstrates Clamping Behavior With a Long
            Description
          </ContentBannerTitle>
          <ContentBannerDescription>
            This is a longer description that demonstrates how the content
            banner handles overflow. It should be clamped at two lines.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
    </Box>
  ),
};

export const WithStepper: Story = {
  render: () => (
    <Box lx={{ maxWidth: 's400' }}>
      <ContentBanner onClose={() => console.log('close')}>
        <Stepper currentStep={2} totalSteps={4} />
        <ContentBannerContent>
          <ContentBannerTitle>Setup your wallet</ContentBannerTitle>
          <ContentBannerDescription>
            Complete all steps to secure your wallet.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
    </Box>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box
      lx={{
        width: 's400',
        flexDirection: 'column',
        gap: 's16',
        backgroundColor: 'mutedPressed',
        padding: 's16',
      }}
    >
      <Text typography='body4SemiBold' lx={{ color: 'muted' }}>
        Container with a fixed width
      </Text>
      <ContentBanner>
        <Spot appearance='icon' icon={Settings} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>Short Title</ContentBannerTitle>
          <ContentBannerDescription>Short description</ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
      <ContentBanner onClose={() => console.log('close')}>
        <Spot appearance='icon' icon={Wallet} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>
            Longer Title That Might Overflow When Container is Smaller
          </ContentBannerTitle>
          <ContentBannerDescription>
            This is a longer description that demonstrates how the content
            banner handles longer content within its constraints. It should be
            clamped at two lines with an ellipsis.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
    </Box>
  ),
};
