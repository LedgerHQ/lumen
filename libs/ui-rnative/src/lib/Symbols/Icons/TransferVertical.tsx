import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * TransferVertical icon component for React Native.
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
 * import { TransferVertical } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <TransferVertical />
 *
 * @example
 * // With custom size and style
 * <TransferVertical size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={TransferVertical} size="md">
 *   Click me
 * </Button>
 */
export const TransferVertical = createIcon(
  'TransferVertical',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m6.667 5.333-2-2m0 0-2 2m2-2v9.334m4.666-2 2 2m0 0 2-2m-2 2V3.333'
    />
  </Svg>,
);
