import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Dollar icon component for React Native.
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
 * import { Dollar } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Dollar />
 *
 * @example
 * // With custom size and style
 * <Dollar size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Dollar} size="md">
 *   Click me
 * </Button>
 */
export const Dollar = createIcon(
  'Dollar',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3.522 3.515a6.333 6.333 0 1 1 8.956 8.957 6.333 6.333 0 0 1-8.956-8.957'
    />
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8.02 4.103v.974m0 6.82v-.974M9.951 6.44A1.457 1.457 0 0 0 8.5 5.077H7.433c-.756 0-1.372.608-1.372 1.364 0 .624.427 1.17 1.03 1.325l1.825.452a1.35 1.35 0 0 1 1.029 1.325c0 .756-.616 1.364-1.372 1.364H7.505c-.779 0-1.402-.608-1.457-1.372'
    />
  </Svg>,
);
