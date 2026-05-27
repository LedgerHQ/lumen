import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { G } from 'react-native-svg';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator.tsx';
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
          <View style={{ width: 600, padding: 16 }}>
            <Story />
          </View>
        </StoryDecorator>
      );
    },
  ],
} satisfies Meta<typeof Point>;

export default meta;
type Story = StoryObj<typeof Point>;

export const Base: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => {
    const { theme } = useTheme();
    return (
      <LineChart series={sampleSeries} height={250} showArea>
        <Point
          dataX={9}
          dataY={4}
          label='$4.00'
          color={theme.colors.bg.errorStrong}
          labelPosition='bottom'
        />
        <Point
          dataX={4}
          dataY={98}
          label='$98.00'
          color={theme.colors.bg.successStrong}
          labelPosition='top'
        />
      </LineChart>
    );
  },
};

export const WithCustomLabelComponent: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => {
    const { theme } = useTheme();
    return (
      <LineChart
        series={sampleSeries}
        height={250}
        inset={{ top: 15 }}
        showArea
      >
        <Point
          dataX={9}
          dataY={4}
          label='$4.00'
          color={theme.colors.bg.errorStrong}
          labelPosition='bottom'
          LabelComponent={({ children, ...props }) => (
            <PointLabel {...props}>{children}</PointLabel>
          )}
        />
        <Point
          dataX={4}
          dataY={98}
          label='$98.00'
          color={theme.colors.bg.successStrong}
          labelPosition='top'
          LabelComponent={({ x, y, children }) => (
            <G>
              <PointLabel x={x} y={y - 16}>
                {children}
              </PointLabel>
              <PointLabel x={x} y={y} fontSize={10}>
                +5.2%
              </PointLabel>
            </G>
          )}
        />
      </LineChart>
    );
  },
};

export const NoPoint: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => (
    <LineChart series={sampleSeries} height={250} showArea>
      <Point dataX={4} dataY={98} label='ATH' hidePoint />
      <Point dataX={9} dataY={4} label='Low' hidePoint labelPosition='bottom' />
    </LineChart>
  ),
};

export const CustomSize: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => {
    const { theme } = useTheme();
    return (
      <LineChart series={sampleSeries} height={250} showArea>
        <Point
          dataX={4}
          dataY={98}
          size={16}
          label={(i) => `Index ${i}`}
          color={theme.colors.bg.successStrong}
        />
        <Point
          dataX={9}
          dataY={4}
          size={6}
          label='$4.00'
          color={theme.colors.bg.errorStrong}
          labelPosition='bottom'
        />
      </LineChart>
    );
  },
};
