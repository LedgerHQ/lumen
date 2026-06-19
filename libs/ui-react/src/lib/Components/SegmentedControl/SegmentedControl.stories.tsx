import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Coins, TransferHorizontal, Nft } from '../../Symbols';
import { DotCount } from '../DotCount';
import {
  createSegmentedControl,
  SegmentedControl,
  SegmentedControlButton,
} from './SegmentedControl';

const meta = {
  title: 'Navigation/SegmentedControl',
  component: SegmentedControl,
  subcomponents: {
    SegmentedControlButton,
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  decorators: [
    (Story) => (
      <div className='flex w-320 justify-center'>
        <Story />
      </div>
    ),
  ],
  args: {
    appearance: 'background',
    tabLayout: 'fixed',
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => {
    const [state, setState] = useState('send');

    return (
      <SegmentedControl
        {...args}
        selectedValue={state}
        onSelectedChange={setState}
      >
        <SegmentedControlButton value='send'>Send</SegmentedControlButton>
        <SegmentedControlButton value='receive'>Receive</SegmentedControlButton>
        <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
      </SegmentedControl>
    );
  },
};

export const WithIcons: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => {
    const [state, setState] = useState('tokens');

    return (
      <SegmentedControl
        {...args}
        selectedValue={state}
        onSelectedChange={setState}
      >
        <SegmentedControlButton value='tokens' icon={Coins}>
          Tokens
        </SegmentedControlButton>
        <SegmentedControlButton value='nfts' icon={Nft}>
          NFTs
        </SegmentedControlButton>
        <SegmentedControlButton value='trade' icon={TransferHorizontal}>
          Trade
        </SegmentedControlButton>
      </SegmentedControl>
    );
  },
};

export const TabLayoutShowcase: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => {
    const [fitState, setFitState] = useState('send');
    const [fixedState, setFixedState] = useState('send');

    return (
      <div className='flex flex-col gap-24'>
        <div>
          <p className='mb-8 body-2 text-muted'>Fit</p>
          <SegmentedControl
            {...args}
            tabLayout='fit'
            selectedValue={fitState}
            onSelectedChange={setFitState}
          >
            <SegmentedControlButton value='send'>Send</SegmentedControlButton>
            <SegmentedControlButton value='receive'>
              Receive
            </SegmentedControlButton>
            <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
          </SegmentedControl>
        </div>
        <div>
          <p className='mb-8 body-2 text-muted'>Fixed</p>
          <SegmentedControl
            {...args}
            tabLayout='fixed'
            selectedValue={fixedState}
            onSelectedChange={setFixedState}
          >
            <SegmentedControlButton value='send'>Send</SegmentedControlButton>
            <SegmentedControlButton value='receive'>
              Receive
            </SegmentedControlButton>
            <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
          </SegmentedControl>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => (
    <SegmentedControl
      {...args}
      selectedValue='receive'
      onSelectedChange={() => {
        /* empty */
      }}
      disabled
    >
      <SegmentedControlButton value='send'>Send</SegmentedControlButton>
      <SegmentedControlButton value='receive'>Receive</SegmentedControlButton>
      <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
    </SegmentedControl>
  ),
};

export const WithTrailingContent: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => {
    const [state, setState] = useState('tokens');

    return (
      <SegmentedControl
        {...args}
        selectedValue={state}
        onSelectedChange={setState}
        aria-label='Asset section'
      >
        <SegmentedControlButton
          value='tokens'
          trailingContent={<DotCount value={3} />}
        >
          Tokens
        </SegmentedControlButton>
        <SegmentedControlButton
          value='nfts'
          trailingContent={<DotCount value={12} />}
        >
          NFTs
        </SegmentedControlButton>
        <SegmentedControlButton value='trade'>Trade</SegmentedControlButton>
      </SegmentedControl>
    );
  },
};

type View = 'preview' | 'raw' | 'blame';
const TypedSegmentedControl = createSegmentedControl<View>();

export const Typed: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => {
    const [view, setView] = useState<View>('preview');

    return (
      <TypedSegmentedControl.SegmentedControl
        {...args}
        selectedValue={view}
        onSelectedChange={setView}
      >
        <TypedSegmentedControl.SegmentedControlButton value='preview'>
          Preview
        </TypedSegmentedControl.SegmentedControlButton>
        <TypedSegmentedControl.SegmentedControlButton value='raw'>
          Raw
        </TypedSegmentedControl.SegmentedControlButton>
        <TypedSegmentedControl.SegmentedControlButton value='blame'>
          Blame
        </TypedSegmentedControl.SegmentedControlButton>
      </TypedSegmentedControl.SegmentedControl>
    );
  },
};
