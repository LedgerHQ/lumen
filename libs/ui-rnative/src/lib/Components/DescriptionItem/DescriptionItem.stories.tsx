import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { Information } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { Tag } from '../Tag';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import {
  DescriptionItem,
  DescriptionItemLabel,
  DescriptionItemLeading,
  DescriptionItemTrailing,
  DescriptionItemValue,
} from './DescriptionItem';

const Container = ({ children }: { children: React.ReactNode }) => (
  <View style={{ padding: 8, backgroundColor: '#ffffff', width: 320 }}>
    {children}
  </View>
);

const meta: Meta<typeof DescriptionItem> = {
  component: DescriptionItem,
  title: 'Containment/DescriptionItem',
  subcomponents: {
    DescriptionItemLeading,
    DescriptionItemLabel,
    DescriptionItemTrailing,
    DescriptionItemValue,
  },
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DescriptionItem>;

export const Base: Story = {
  args: {
    size: 'md',
  },
  render: (args) => (
    <DescriptionItem {...args}>
      <DescriptionItemLeading>
        <DescriptionItemLabel>Fees</DescriptionItemLabel>
      </DescriptionItemLeading>
      <DescriptionItemTrailing>
        <DescriptionItemValue>0.001 BTC</DescriptionItemValue>
      </DescriptionItemTrailing>
    </DescriptionItem>
  ),
};

export const SizeShowcase: Story = {
  args: {
    size: 'md',
  },
  render: ({ size }) => (
    <View style={{ gap: 16 }}>
      <DescriptionItem size={size}>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Network</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>Ethereum</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>

      <DescriptionItem size={size}>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Network</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <Tag size={size} label='Ethereum' appearance='base' />
        </DescriptionItemTrailing>
      </DescriptionItem>
    </View>
  ),
};

export const TrailingVariants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <DescriptionItem>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Plain value</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>Ethereum</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>

      <DescriptionItem>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Tag</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <Tag size='md' label='Confirmed' appearance='success' />
        </DescriptionItemTrailing>
      </DescriptionItem>

      <DescriptionItem>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Multiple tags</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <Tag size='md' label='ERC-20' appearance='base' />
          <Tag size='md' label='New' appearance='accent' />
        </DescriptionItemTrailing>
      </DescriptionItem>
    </View>
  ),
};

export const WithInfoIcon: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <DescriptionItem>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Fees</DescriptionItemLabel>
          <Tooltip>
            <TooltipTrigger>
              <InteractiveIcon
                icon={Information}
                size={16}
                iconType='stroked'
                accessibilityLabel='More information'
              />
            </TooltipTrigger>
            <TooltipContent content={<Text>Network fee paid to miners</Text>} />
          </Tooltip>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>0.001 BTC</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>

      <DescriptionItem>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Estimated time</DescriptionItemLabel>
          <Tooltip>
            <TooltipTrigger>
              <InteractiveIcon
                icon={Information}
                size={16}
                iconType='stroked'
                accessibilityLabel='More information'
              />
            </TooltipTrigger>
            <TooltipContent
              content={<Text>Time may vary based on network congestion</Text>}
            />
          </Tooltip>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>~30 min</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>
    </View>
  ),
};

export const TruncationBehavior: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <DescriptionItem>
        <DescriptionItemLeading>
          <DescriptionItemLabel>
            This is a very long label that should go to a second line.
          </DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>0.001 BTC</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>

      <DescriptionItem>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Label</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>
            0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
          </DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>

      <DescriptionItem>
        <DescriptionItemLeading>
          <DescriptionItemLabel>
            Destination address on network
          </DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>
            0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
          </DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>
    </View>
  ),
};
