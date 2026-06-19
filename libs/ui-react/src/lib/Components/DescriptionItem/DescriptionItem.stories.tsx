import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Information } from '../../Symbols';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectTrigger,
} from '../Select/Select';
import { Tag } from '../Tag/Tag';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';
import {
  DescriptionItem,
  DescriptionItemLabel,
  DescriptionItemLeading,
  DescriptionItemTrailing,
  DescriptionItemValue,
} from './DescriptionItem';

const meta = {
  component: DescriptionItem,
  title: 'Core/DescriptionItem',
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
} satisfies Meta<typeof DescriptionItem>;

export default meta;
type Story = StoryObj<typeof DescriptionItem>;

export const Base: Story = {
  args: {
    size: 'md',
    className: 'w-320',
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
  render: () => (
    <div className='flex w-320 flex-col gap-16'>
      <DescriptionItem size='md'>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Network</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>Ethereum</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>

      <DescriptionItem size='md'>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Network</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <Tag size='md' label='Ethereum' appearance='base' />
        </DescriptionItemTrailing>
      </DescriptionItem>
      <br />
      <DescriptionItem size='sm'>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Network</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>Ethereum</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>

      <DescriptionItem size='sm'>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Network</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <Tag size='sm' label='Ethereum' appearance='base' />
        </DescriptionItemTrailing>
      </DescriptionItem>
    </div>
  ),
};

export const TrailingVariants: Story = {
  render: () => (
    <div className='flex w-320 flex-col gap-16'>
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
    </div>
  ),
};

export const WithInfoIcon: Story = {
  render: () => (
    <div className='flex w-320 flex-col gap-16'>
      <DescriptionItem>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Fees</DescriptionItemLabel>
          <Tooltip>
            <TooltipTrigger>
              <Information size={16} className='shrink-0 text-muted' />
            </TooltipTrigger>
            <TooltipContent>Network fee paid to miners</TooltipContent>
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
              <Information size={16} className='shrink-0 text-muted' />
            </TooltipTrigger>
            <TooltipContent>
              Time may vary based on network congestion
            </TooltipContent>
          </Tooltip>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>~30 min</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>
    </div>
  ),
};

export const TruncationBehavior: Story = {
  render: () => (
    <div className='flex w-320 flex-col gap-16'>
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
    </div>
  ),
};

const networkOptions = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'polygon', label: 'Polygon' },
];

export const WithSelect: Story = {
  render: () => {
    const [network, setNetwork] = useState<string | null>('ethereum');

    return (
      <DescriptionItem className='w-320'>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Network</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <Select
            items={networkOptions}
            value={network}
            onValueChange={setNetwork}
          >
            <SelectTrigger label='Network' />
            <SelectContent>
              <SelectList
                renderItem={(item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <SelectItemText>{item.label}</SelectItemText>
                  </SelectItem>
                )}
              />
            </SelectContent>
          </Select>
        </DescriptionItemTrailing>
      </DescriptionItem>
    );
  },
};
