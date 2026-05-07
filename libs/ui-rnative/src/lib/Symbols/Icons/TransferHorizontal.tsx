import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * TransferHorizontal icon component for React Native.
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
 * import { TransferHorizontal } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <TransferHorizontal />
 *
 * @example
 * // With custom size and style
 * <TransferHorizontal size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={TransferHorizontal} size="md">
 *   Click me
 * </Button>
 */
export const TransferHorizontal = createIcon(
  'TransferHorizontal',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m5.333 13.333-2-2 2-2m-2 2h9.334m-2-8.666 2 2-2 2m2-2H3.333'
    />
  </Svg>,
);
