import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator';
import { LineChart } from '../LineChart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  sampleSeries,
} from '../LineChart/__stories__/chartStoryFixtures';

import { ReferenceLine } from './ReferenceLine';

const meta = {
  component: ReferenceLine,
  title: 'Visualization/ReferenceLine',
  tags: ['experimental'],
  decorators: [
    (Story, context) => {
      return (
        <StoryDecorator context={context}>
          <div style={{ width: CHART_WIDTH, padding: 16 }}>
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
  args: {
    dataY: 50,
    label: 'Target',
    labelDy: -4,
    labelVerticalAlignment: 'start',
    labelHorizontalAlignment: 'start',
  },
  render: (args) => (
    <LineChart series={sampleSeries} height={CHART_HEIGHT} showArea>
      <ReferenceLine {...args} />
    </LineChart>
  ),
};

export const VerticalLine: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={CHART_HEIGHT} showArea>
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

export const WithLabelAndStyling: Story = {
  render: () => (
    <LineChart
      series={sampleSeries}
      height={CHART_HEIGHT}
      showArea
      xAxis={{ showLine: true }}
    >
      <ReferenceLine
        dataY={75}
        label='25th percentile'
        labelDy={-4}
        labelVerticalAlignment='start'
        labelHorizontalAlignment='start'
        stroke={cssVar('var(--border-success)')}
      />
      <ReferenceLine
        dataY={25}
        label='75th percentile'
        labelDy={-4}
        labelVerticalAlignment='start'
        labelHorizontalAlignment='start'
        stroke={cssVar('var(--border-error)')}
      />
      <ReferenceLine
        dataY={50}
        label='Median'
        lineStyle='solid'
        stroke={cssVar('var(--border-muted-subtle)')}
        labelDy={-4}
        labelVerticalAlignment='start'
        labelHorizontalAlignment='start'
      />
    </LineChart>
  ),
};
