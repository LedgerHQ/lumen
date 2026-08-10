import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * CreditCard icon component for React Native.
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
 * import { CreditCard } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CreditCard />
 *
 * @example
 * // With custom size and style
 * <CreditCard size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CreditCard} size="md">
 *   Click me
 * </Button>
 */
export const CreditCard = createIcon(
  'CreditCard',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2 6h12M6.38 8.667H4.667m7.333 4H4a2 2 0 0 1-2-2V5.333a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5.334a2 2 0 0 1-2 2'
    />
  </Svg>,
);
