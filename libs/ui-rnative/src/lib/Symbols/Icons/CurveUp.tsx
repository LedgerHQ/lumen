import Svg, { Path, Circle } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * CurveUp icon component for React Native.
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
 * import { CurveUp } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CurveUp />
 *
 * @example
 * // With custom size and style
 * <CurveUp size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CurveUp} size="md">
 *   Click me
 * </Button>
 */
export const CurveUp = createIcon(
  'CurveUp',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 17 16'>
    <Path
      stroke='currentColor'
      strokeDasharray='1 2.2'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M1.52 4.208H10.2'
    />
    <Path
      stroke='currentColor'
      strokeDasharray='1 2'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.235 4.207h2.393'
    />
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2.264 13.901c-.108-1.203.447-3.305 3.236-3.932 2.719-.611 5.44-1.397 5.912-4.106'
    />
    <Circle
      cx={11.71}
      cy={4.207}
      r={1.458}
      stroke='currentColor'
      strokeWidth={1.3}
    />
  </Svg>,
);
