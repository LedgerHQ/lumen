import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Download icon component for React Native.
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
 * import { Download } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Download />
 *
 * @example
 * // With custom size and style
 * <Download size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Download} size="md">
 *   Click me
 * </Button>
 */
export const Download = createIcon(
  'Download',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.63 7.407 8 9.778l2.37-2.37M8 9.777V2.667m5.333 8.296a2.37 2.37 0 0 1-2.37 2.37H5.037a2.37 2.37 0 0 1-2.37-2.37'
    />
  </Svg>,
);
