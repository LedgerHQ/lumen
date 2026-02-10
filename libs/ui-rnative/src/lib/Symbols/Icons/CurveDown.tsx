import Svg, { Path, Circle } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * CurveDown icon component for React Native.
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
 * import { CurveDown } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CurveDown />
 *
 * @example
 * // With custom size and style
 * <CurveDown size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CurveDown} size="md">
 *   Click me
 * </Button>
 */
export const CurveDown = createIcon(
  'CurveDown',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 17 16'>
    <Path
      stroke='currentColor'
      strokeDasharray='1 2.2'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M1.52 11.793H10.2'
    />
    <Path
      stroke='currentColor'
      strokeDasharray='1 2'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.235 11.793h2.393'
    />
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2.264 2.099C2.156 3.302 2.711 5.404 5.5 6.03c2.719.611 5.44 1.397 5.912 4.106'
    />
    <Circle
      cx={2.108}
      cy={2.108}
      r={1.458}
      stroke='currentColor'
      strokeWidth={1.3}
      transform='matrix(1 0 0 -1 9.601 13.901)'
    />
  </Svg>,
);
