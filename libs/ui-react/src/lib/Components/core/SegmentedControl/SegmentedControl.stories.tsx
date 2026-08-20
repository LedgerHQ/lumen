import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Coins, TransferHorizontal, Nft } from '../../symbols';
import { DotCount } from '../DotCount';
import {
  createSegmentedControl,
  SegmentedControl,
  SegmentedControlButton,
} from './SegmentedControl';

const meta = {
  id: 'react-segmentedcontrol',
  title: 'Core/SegmentedControl',
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
    const [fitFewState, setFitFewState] = useState('send');
    const [fitManyState, setFitManyState] = useState('tokens');
    const [fixedState, setFixedState] = useState('send');

    return (
      <div className='flex flex-col gap-24'>
        <div className='w-max'>
          <p className='mb-8 body-2 text-muted'>Fit (all items visible)</p>
          <SegmentedControl
            {...args}
            tabLayout='fit'
            selectedValue={fitFewState}
            onSelectedChange={setFitFewState}
          >
            <SegmentedControlButton value='send'>Send</SegmentedControlButton>
            <SegmentedControlButton value='receive'>
              Receive
            </SegmentedControlButton>
            <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
          </SegmentedControl>
        </div>
        <div className='w-320'>
          <p className='mb-8 body-2 text-muted'>Fit (container too narrow)</p>
          <SegmentedControl
            {...args}
            tabLayout='fit'
            selectedValue={fitManyState}
            onSelectedChange={setFitManyState}
          >
            <SegmentedControlButton value='tokens'>
              Tokens
            </SegmentedControlButton>
            <SegmentedControlButton value='nfts'>NFTs</SegmentedControlButton>
            <SegmentedControlButton value='trade'>Trade</SegmentedControlButton>
            <SegmentedControlButton value='earn'>Earn</SegmentedControlButton>
            <SegmentedControlButton value='market'>
              Market
            </SegmentedControlButton>
            <SegmentedControlButton value='history'>
              History
            </SegmentedControlButton>
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

export const TypesafeFactory: Story = {
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
