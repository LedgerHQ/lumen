import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * BluetoothCircleFill icon component for React Native.
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
 * import { BluetoothCircleFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <BluetoothCircleFill />
 *
 * @example
 * // With custom size and style
 * <BluetoothCircleFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={BluetoothCircleFill} size="md">
 *   Click me
 * </Button>
 */
export const BluetoothCircleFill = createIcon(
  'BluetoothCircleFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='m9.29 9.576-1.032-.871v1.627zM8.258 5.668v1.627l1.031-.87z'
    />
    <Path
      fill='currentColor'
      fillRule='evenodd'
      d='M8 14.4A6.4 6.4 0 1 0 8 1.6a6.4 6.4 0 0 0 0 12.8m.078-9.955a.44.44 0 0 0-.7.355v2.01l-1.094-.924a.44.44 0 1 0-.568.672l1.662 1.404v.076L5.716 9.442a.44.44 0 1 0 .568.672l1.094-.924v2.01a.44.44 0 0 0 .7.355l2.182-1.6a.44.44 0 0 0 .024-.691L8.787 8l1.497-1.264a.44.44 0 0 0-.024-.69z'
      clipRule='evenodd'
    />
  </Svg>,
);
