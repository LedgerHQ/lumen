import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * NanoGen5 icon component for React Native.
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
 * import { NanoGen5 } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <NanoGen5 />
 *
 * @example
 * // With custom size and style
 * <NanoGen5 size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={NanoGen5} size="md">
 *   Click me
 * </Button>
 */
export const NanoGen5 = createIcon(
  'NanoGen5',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      fillRule='evenodd'
      d='M11 1.333c.92 0 1.667.747 1.667 1.667v.333c.184 0 .333.15.333.334v1.666a.334.334 0 0 1-.266.327l-.067.007V13c0 .92-.746 1.667-1.667 1.667H5c-.92 0-1.667-.746-1.667-1.667V3c0-.92.747-1.667 1.667-1.667zM9.667 12.667a.667.667 0 0 0 0 1.333H11a.667.667 0 0 0 0-1.333zM5 2.333A.667.667 0 0 0 4.333 3v8c0 .368.299.667.667.667h6a.667.667 0 0 0 .667-.667V3A.667.667 0 0 0 11 2.333z'
      clipRule='evenodd'
    />
  </Svg>,
);
