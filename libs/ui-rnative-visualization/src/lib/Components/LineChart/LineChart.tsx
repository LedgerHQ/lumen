import { View } from 'react-native';
import { Rect, Svg, Text as SvgText } from 'react-native-svg';
import type { Series } from '../../utils';

type LineChartProps = {
  series: Series[];
  width?: number;
  height?: number;
};

export function LineChart({
  series: _series,
  width = 400,
  height = 300,
}: LineChartProps) {
  return (
    <View
      testID='line-chart'
      accessibilityRole='image'
      accessibilityLabel='Line chart'
    >
      <Svg width={width} height={height}>
        <Rect width={width} height={height} rx={8} fill='#F3F0FA' />
        <SvgText
          x={width / 2}
          y={height / 2}
          textAnchor='middle'
          alignmentBaseline='central'
          fill='#7e4ea5'
          fontSize={14}
          fontFamily='Inter'
        >
          LineChart placeholder
        </SvgText>
      </Svg>
    </View>
  );
}
