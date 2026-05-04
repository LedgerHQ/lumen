import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator';
import { LineChart } from '../LineChart';
import { Point, PointLabel } from './Point';

const sampleSeries = [
  {
    id: 'prices',
    stroke: '#7B61FF',
    data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20, 21, 58],
  },
];

const meta = {
  component: Point,
  title: 'Visualization/Point',
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
} satisfies Meta<typeof Point>;

export default meta;
type Story = StoryObj<typeof Point>;

export const Base: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} showArea>
      <Point
        dataX={9}
        dataY={4}
        label='$4.00'
        color={cssVar('var(--background-error-strong)')}
        labelPosition='bottom'
      />
      <Point
        dataX={4}
        dataY={98}
        label='$98.00'
        color={cssVar('var(--background-success-strong)')}
        labelPosition='top'
      />
    </LineChart>
  ),
};

export const WithCustomLabelComponent: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} inset={{ top: 20 }} showArea>
      <Point
        dataX={9}
        dataY={4}
        label='$4.00'
        color={cssVar('var(--background-error-strong)')}
        labelPosition='bottom'
        LabelComponent={({ children, ...props }) => (
          <PointLabel {...props}>{children}</PointLabel>
        )}
      />
      <Point
        dataX={4}
        dataY={98}
        label='$98.00'
        color={cssVar('var(--background-success-strong)')}
        labelPosition='top'
        LabelComponent={({ x, y, children }) => (
          <g>
            <PointLabel x={x} y={y - 16}>
              {children}
            </PointLabel>
            <PointLabel
              x={x}
              y={y}
              style={{
                fontSize: 10,
                fill: cssVar('var(--text-success)'),
              }}
            >
              +5.2%
            </PointLabel>
          </g>
        )}
      />
    </LineChart>
  ),
};

export const NoPoint: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} showArea>
      <Point dataX={4} dataY={98} label='ATH' hidePoint />
      <Point dataX={9} dataY={4} label='Low' hidePoint labelPosition='bottom' />
    </LineChart>
  ),
};

export const CustomSize: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} showArea>
      <Point
        dataX={4}
        dataY={98}
        size={16}
        label={(i) => `Index ${i}`}
        color={cssVar('var(--background-success-strong)')}
      />
      <Point
        dataX={9}
        dataY={4}
        size={6}
        label='$4.00'
        color={cssVar('var(--background-error-strong)')}
        labelPosition='bottom'
      />
    </LineChart>
  ),
};
