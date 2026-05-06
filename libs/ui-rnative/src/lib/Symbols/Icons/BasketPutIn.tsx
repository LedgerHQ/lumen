import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * BasketPutIn icon component for React Native.
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
 * import { BasketPutIn } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <BasketPutIn />
 *
 * @example
 * // With custom size and style
 * <BasketPutIn size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={BasketPutIn} size="md">
 *   Click me
 * </Button>
 */
export const BasketPutIn = createIcon(
  'BasketPutIn',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.5 12h6.667M5.5 12a1.167 1.167 0 1 0 0 2.333A1.167 1.167 0 0 0 5.5 12m6.667 0a1.167 1.167 0 1 0 0 2.333 1.167 1.167 0 0 0 0-2.333M3.762 4.667h1.571M8.667 4v3.333M10 6 8.667 7.333 7.333 6m-2 6-2-9.333H2m10 2h1.333a.667.667 0 0 1 .644.838l-1.066 4a.67.67 0 0 1-.644.495H4.905'
    />
  </Svg>,
);
