import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * MinusCircle icon component for React Native.
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
 * import { MinusCircle } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <MinusCircle />
 *
 * @example
 * // With custom size and style
 * <MinusCircle size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={MinusCircle} size="md">
 *   Click me
 * </Button>
 */
export const MinusCircle = createIcon(
  'MinusCircle',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M10.667 8H5.333M8 14c-3.32 0-6-2.686-6-6 0-3.32 2.686-6 6-6a6 6 0 1 1 0 12'
    />
  </Svg>,
);
