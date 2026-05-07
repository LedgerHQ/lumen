import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * FileDownload icon component for React Native.
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
 * import { FileDownload } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <FileDownload />
 *
 * @example
 * // With custom size and style
 * <FileDownload size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={FileDownload} size="md">
 *   Click me
 * </Button>
 */
export const FileDownload = createIcon(
  'FileDownload',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2.653 8.653V3.987c0-1.107.894-2 2-2h5c.534 0 1.04.206 1.42.586l1.674 1.674c.373.38.58.886.586 1.42V12c0 1.1-.9 2-2 2H8.667m4.666-8.333H11c-.74 0-1.333-.6-1.333-1.334V2m-5 8.667V14m-1.334-1.333L4.667 14 6 12.667'
    />
  </Svg>,
);
