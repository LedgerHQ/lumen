import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Usb icon component for React Native.
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
 * import { Usb } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Usb />
 *
 * @example
 * // With custom size and style
 * <Usb size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Usb} size="md">
 *   Click me
 * </Button>
 */
export const Usb = createIcon(
  'Usb',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 11.333a1.667 1.667 0 1 0 0 3.333 1.667 1.667 0 0 0 0-3.333m0 0v-10m0 0 1.5 1.5M8 1.333l-1.5 1.5M8 10.147 5.373 9.56a1.34 1.34 0 0 1-1.046-1.307V7.32M8 9.1l2.713-.82c.56-.173.947-.693.947-1.28v-.68M11.167 4h1c.368 0 .666.298.666.667v1a.667.667 0 0 1-.666.666h-1a.667.667 0 0 1-.667-.666v-1c0-.369.299-.667.667-.667M4.333 5a1.167 1.167 0 1 0 0 2.333 1.167 1.167 0 0 0 0-2.333'
    />
  </Svg>,
);
