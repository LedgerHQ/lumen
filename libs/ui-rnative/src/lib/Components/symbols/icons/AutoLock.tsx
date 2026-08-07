import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * AutoLock icon component for React Native.
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
 * import { AutoLock } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <AutoLock />
 *
 * @example
 * // With custom size and style
 * <AutoLock size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={AutoLock} size="md">
 *   Click me
 * </Button>
 */
export const AutoLock = createIcon(
  'AutoLock',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8.26 4.667V8.26H5.327m8.633-.927a6.01 6.01 0 0 0-6.633-5.3 5.996 5.996 0 0 0-.007 11.92M11.5 12h2.334M11.5 12a.833.833 0 0 0-.833.833v1c0 .46.373.834.833.834h2.334c.46 0 .833-.373.833-.834v-1a.833.833 0 0 0-.833-.833M11.5 12v-.833a1.168 1.168 0 0 1 2.333 0V12'
    />
  </Svg>,
);
