import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator.tsx';
import { LineChart } from './LineChart';

const meta = {
  component: LineChart,
  title: 'Visualization/LineChart',
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
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof LineChart>;

const sampleSeries = [
  {
    id: 'prices',
    stroke: '#7B61FF',
    data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20, 21, 58],
  },
];

const multiSeries = [
  {
    id: 'lineA',
    label: 'Line A',
    stroke: '#7B61FF',
    data: [5, 15, 10, 90, 85, 70, 30, 25, 25],
  },
  {
    id: 'lineB',
    label: 'Line B',
    stroke: '#44D7B6',
    data: [90, 85, 70, 25, 23, 40, 45, 40, 50],
  },
];

export const Base: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
  },
};

export const WithXAxis: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
  },
};

export const XAxisExplicitNumericData: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
      data: [0, 2, 4],
    },
  },
};

export const XAxisStringData: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
      data: ['Jan', 'Feb', 'Mar'],
    },
  },
};

export const WithStringLabels: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      data: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
      ],
      showLine: true,
      showGrid: true,
    },
  },
};

export const WithCustomTicks: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
      ticks: [0, 3, 6, 9, 13],
    },
  },
};

export const WithTickFormatter: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      data: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
      ],
      showLine: true,
      tickLabelFormatter: (value) => `${String(value).slice(0, 1)}`,
    },
  },
};

export const XAxisTop: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      position: 'top',
      showLine: true,
      showGrid: true,
    },
  },
};

export const MultipleSeries: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: multiSeries,
    width: 400,
    height: 300,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
  },
};

export const CustomDomain: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
    yAxis: {
      domain: { min: 0, max: 100 },
    },
  },
};

export const WithBothAxes: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    showYAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
    yAxis: {
      showLine: true,
      showGrid: true,
      tickLabelFormatter: (value) => `$${value}`,
    },
  },
};

export const WithBothAxesMultipleSeries: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: multiSeries,
    width: 400,
    height: 300,
    showXAxis: true,
    showYAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
    yAxis: {
      showLine: true,
      domain: { min: 0, max: 100 },
    },
  },
};

export const WithArea: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showArea: true,
    showXAxis: true,
    xAxis: {
      showLine: true,
    },
  },
};

export const WithAreaMultipleSeries: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: multiSeries,
    width: 400,
    height: 300,
    showArea: true,
    showXAxis: true,
    showYAxis: true,
    xAxis: {
      showLine: true,
    },
    yAxis: {
      showLine: true,
      domain: { min: 0, max: 100 },
    },
  },
};

/**
 * Initial loading: no data yet, so an animated shimmer placeholder line is
 * shown until a `series` arrives.
 */
export const Loading: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    width: 400,
    height: 250,
    loading: true,
  },
};

/**
 * Transition loading: the chart already has data (e.g. switching time ranges),
 * so the existing line is recoloured to muted grey and shimmers until the new
 * `series` is provided.
 */
export const TransitionLoading: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    loading: true,
    showXAxis: true,
    xAxis: {
      showLine: true,
    },
  },
};

/**
 * Empty: no data and not loading, so a static placeholder line with a centred
 * label is shown.
 */
export const Empty: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: [],
    width: 400,
    height: 250,
  },
};

export const EmptyCustomLabel: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: [],
    width: 400,
    height: 250,
    emptyLabel: 'No transactions yet',
  },
};

const INITIAL_FETCH_DELAY_IN_MS = 1200;
const TRANSITION_FETCH_DELAY_IN_MS = 2000;

/**
 * Putting it together: simulates fetching data. Use the buttons to reload (with
 * existing data -> transition shimmer) or simulate an empty result.
 */
export const Interactive: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => {
    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState<typeof sampleSeries | []>([]);
    const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );

    const scheduleFetch = (callback: () => void, delay: number) => {
      if (fetchTimeoutRef.current !== undefined) {
        clearTimeout(fetchTimeoutRef.current);
      }
      fetchTimeoutRef.current = setTimeout(callback, delay);
    };

    const fetchData = (hasExistingData: boolean) => {
      setLoading(true);
      scheduleFetch(
        () => {
          setSeries(sampleSeries);
          setLoading(false);
        },
        hasExistingData
          ? TRANSITION_FETCH_DELAY_IN_MS
          : INITIAL_FETCH_DELAY_IN_MS,
      );
    };

    const simulateEmpty = () => {
      setLoading(true);
      scheduleFetch(() => {
        setSeries([]);
        setLoading(false);
      }, INITIAL_FETCH_DELAY_IN_MS);
    };

    useEffect(() => {
      fetchData(false);
      return () => {
        if (fetchTimeoutRef.current !== undefined) {
          clearTimeout(fetchTimeoutRef.current);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <View style={{ gap: 12 }}>
        <View
          style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}
        >
          <Pressable
            onPress={() => fetchData(series.length > 0)}
            style={{
              backgroundColor: '#E5E5E5',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text>Reload</Text>
          </Pressable>
          <Pressable
            onPress={simulateEmpty}
            style={{
              backgroundColor: '#E5E5E5',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text>Simulate empty</Text>
          </Pressable>
        </View>

        <LineChart
          series={series}
          width={400}
          height={250}
          loading={loading}
          showArea
          showXAxis
          xAxis={{ showLine: true }}
        />
      </View>
    );
  },
};
