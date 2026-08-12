import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * FilterSort icon component for React Native.
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
 * import { FilterSort } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <FilterSort />
 *
 * @example
 * // With custom size and style
 * <FilterSort size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={FilterSort} size="md">
 *   Click me
 * </Button>
 */
export const FilterSort = createIcon(
  'FilterSort',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m9.667 9 3.471-3.471a.67.67 0 0 0 .195-.472V3.333a.667.667 0 0 0-.666-.666H3.333a.667.667 0 0 0-.666.666v1.724c0 .177.07.347.195.472L6.333 9M6.333 9v4.166c0 .542.51.94 1.036.809l1.666-.417a.834.834 0 0 0 .632-.809V9'
      clipRule='evenodd'
    />
  </Svg>,
);
