import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Chart5Fill icon component for React Native.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props (from react-native-svg)
 * and additional size variants defined in the Icon component.
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [color] - The color of the icon.
 * @param {SVGProps} [...props] - All standard SVG element props (from react-native-svg).
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Chart5Fill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Chart5Fill />
 *
 * @example
 * // With custom size and style
 * <Chart5Fill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Chart5Fill} size="md">
 *   Click me
 * </Button>
 */
export const Chart5Fill = createIcon(
  'Chart5Fill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M13.1 1.662a2 2 0 0 1 2 2v8.66a2 2 0 0 1-2 2H2.9a2 2 0 0 1-2-2v-8.66a2 2 0 0 1 2-2zm-2.404 3.379a.648.648 0 0 0-.173 1.273L8.672 8.22l-.97-1a1.134 1.134 0 0 0-1.646 0L3.493 9.86a.65.65 0 0 0 .934.905l2.45-2.527.974 1.002.088.082c.456.381 1.132.355 1.556-.082l1.925-1.982a.648.648 0 0 0 1.27-.183V5.691a.647.647 0 0 0-.709-.65z'
    />
  </Svg>,
);
