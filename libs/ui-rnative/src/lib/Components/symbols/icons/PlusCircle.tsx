import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * PlusCircle icon component for React Native.
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
 * import { PlusCircle } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <PlusCircle />
 *
 * @example
 * // With custom size and style
 * <PlusCircle size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={PlusCircle} size="md">
 *   Click me
 * </Button>
 */
export const PlusCircle = createIcon(
  'PlusCircle',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 5.333v5.334M10.667 8H5.333M8 14c-3.32 0-6-2.686-6-6 0-3.32 2.686-6 6-6a6 6 0 1 1 0 12'
    />
  </Svg>,
);
