import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Windows icon component for React Native.
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
 * import { Windows } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Windows />
 *
 * @example
 * // With custom size and style
 * <Windows size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Windows} size="md">
 *   Click me
 * </Button>
 */
export const Windows = createIcon(
  'Windows',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M7.504 7.76H13.6V2.4l-6.096.848zM2.4 12.064l4.608.624V8.304H2.4zm0-4.304h4.608V3.312L2.4 3.936zm5.104 4.992 6.096.848V8.304H7.504z'
    />
  </Svg>,
);
