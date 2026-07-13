import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Upload icon component for React Native.
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
 * import { Upload } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Upload />
 *
 * @example
 * // With custom size and style
 * <Upload size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Upload} size="md">
 *   Click me
 * </Button>
 */
export const Upload = createIcon(
  'Upload',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.333 10.963a2.37 2.37 0 0 1-2.37 2.37H5.037a2.37 2.37 0 0 1-2.37-2.37m7.704-5.926L8 2.667l-2.37 2.37M8 2.667v7.111'
    />
  </Svg>,
);
