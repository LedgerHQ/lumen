import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * File icon component for React Native.
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
 * import { File } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <File />
 *
 * @example
 * // With custom size and style
 * <File size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={File} size="md">
 *   Click me
 * </Button>
 */
export const File = createIcon(
  'File',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M12.667 5.333H10a.667.667 0 0 1-.667-.666V2m-4 5.333h4m-4 2h4m-4 2H8.22m4.056-7.057-1.885-1.885C10.14 2.14 9.8 2 9.448 2H4.667c-.737 0-1.334.597-1.334 1.333v9.334c0 .736.597 1.333 1.334 1.333h6.666c.737 0 1.334-.597 1.334-1.333V5.219c0-.354-.141-.693-.391-.943'
    />
  </Svg>,
);
