import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Settings, Wallet } from '../../Symbols';
import { Button } from '../Button';
import { Spot } from '../Spot';
import {
  ContentBanner,
  ContentBannerContent,
  ContentBannerDescription,
  ContentBannerTitle,
} from './ContentBanner';

const meta: Meta<typeof ContentBanner> = {
  component: ContentBanner,
  title: 'Communication/ContentBanner',
  subcomponents: {
    ContentBannerContent,
    ContentBannerTitle,
    ContentBannerDescription,
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
    onClose: {
      action: 'closed',
    },
    closeAriaLabel: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContentBanner>;

export const Base: Story = {
  args: {
    closeAriaLabel: 'Close content banner',
  },
  render: (args) => (
    <div className='w-320'>
      <ContentBanner {...args}>
        <Spot appearance='icon' icon={Settings} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>Content Banner</ContentBannerTitle>
          <ContentBannerDescription>
            This is a description for the content banner.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
    </div>
  ),
};

export const WithClose: Story = {
  render: () => {
    const [visible, setVisible] = React.useState(true);

    if (!visible) {
      return (
        <Button
          appearance='transparent'
          size='sm'
          onClick={() => setVisible(true)}
        >
          Show banner again
        </Button>
      );
    }

    return (
      <div className='w-320'>
        <ContentBanner
          onClose={() => setVisible(false)}
          closeAriaLabel='Close content banner'
        >
          <Spot appearance='icon' icon={Settings} size={48} />
          <ContentBannerContent>
            <ContentBannerTitle>Dismissible Banner</ContentBannerTitle>
            <ContentBannerDescription>
              Click the close button to dismiss this banner.
            </ContentBannerDescription>
          </ContentBannerContent>
        </ContentBanner>
      </div>
    );
  },
};

export const ContentVariationsShowcase: Story = {
  render: () => (
    <div className='flex w-320 flex-col gap-16'>
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
    </div>
  ),
};
