import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Eye icon component for React Native.
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
 * import { Eye } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Eye />
 *
 * @example
 * // With custom size and style
 * <Eye size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Eye} size="md">
 *   Click me
 * </Button>
 */
export const Eye = createIcon(
  'Eye',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M9.415 6.587A2 2 0 1 1 6.58 9.413a1.996 1.996 0 0 1 0-2.833 1.996 1.996 0 0 1 2.827 0M2 8c0-.44.1-.874.293-1.28C3.3 4.653 5.533 3.327 7.996 3.327c2.46 0 4.687 1.326 5.7 3.386.193.4.293.834.293 1.274 0 .433-.106.874-.3 1.273-1.013 2.06-3.246 3.387-5.706 3.387-2.467 0-4.694-1.334-5.703-3.394-.2-.406-.3-.84-.3-1.28z'
    />
  </Svg>,
);
