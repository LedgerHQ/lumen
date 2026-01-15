import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Delete icon component for React Native.
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
 * import { Delete } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Delete />
 *
 * @example
 * // With custom size and style
 * <Delete size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Delete} size="md">
 *   Click me
 * </Button>
 */
export const Delete = createIcon(
  'Delete',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M10.817 6.583 7.984 9.417m2.833 0L7.984 6.583M4.08 4.131 1.905 7.177a1.42 1.42 0 0 0 0 1.647l2.176 3.046c.265.372.695.593 1.152.593h7.71c.782 0 1.416-.634 1.416-1.417V4.954c0-.783-.634-1.417-1.417-1.417H5.233c-.457 0-.887.221-1.152.594'
    />
  </Svg>,
);
