import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator';
import { LineChart } from '../LineChart';

import { ReferenceLine } from './ReferenceLine';

const sampleSeries = [
  {
    id: 'prices',
    stroke: '#7B61FF',
    data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20, 21, 58],
  },
];

const meta = {
  component: ReferenceLine,
  title: 'Visualization/ReferenceLine',
  tags: ['experimental'],
  decorators: [
    (Story, context) => {
      return (
        <StoryDecorator context={context}>
          <div style={{ width: 600, padding: 16 }}>
            <Story />
          </div>
        </StoryDecorator>
      );
    },
  ],
} satisfies Meta<typeof ReferenceLine>;

export default meta;
type Story = StoryObj<typeof ReferenceLine>;

export const HorizontalLine: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} showArea>
      <ReferenceLine
        dataY={50}
        label='Target'
        labelDy={-4}
        labelVerticalAlignment='start'
        labelHorizontalAlignment='start'
      />
    </LineChart>
  ),
};

export const VerticalLine: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} showArea>
      <ReferenceLine
        dataX={7}
        label='Midpoint'
        labelDx={4}
        labelHorizontalAlignment='end'
        labelVerticalAlignment='end'
        labelPosition='start'
      />
    </LineChart>
  ),
};

export const Combined: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} showArea>
      <ReferenceLine
        dataY={98}
        label='ATH'
        labelDy={4}
        labelVerticalAlignment='start'
        stroke={cssVar('var(--border-success)')}
      />
      <ReferenceLine
        dataY={4}
        label='Low'
        labelDy={-4}
        labelVerticalAlignment='end'
        stroke={cssVar('var(--border-error)')}
      />
      <ReferenceLine
        dataX={4}
        label='Peak'
        labelDx={8}
        labelDy={8}
        labelHorizontalAlignment='end'
        labelPosition='start'
        opacity={0.6}
      />
    </LineChart>
  ),
};
