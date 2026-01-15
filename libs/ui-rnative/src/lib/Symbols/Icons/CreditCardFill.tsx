import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * CreditCardFill icon component for React Native.
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
 * import { CreditCardFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CreditCardFill />
 *
 * @example
 * // With custom size and style
 * <CreditCardFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CreditCardFill} size="md">
 *   Click me
 * </Button>
 */
export const CreditCardFill = createIcon(
  'CreditCardFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='m1.376 6.646 13.248.002v4.167a2.5 2.5 0 0 1-2.5 2.5H3.876a2.5 2.5 0 0 1-2.5-2.5zm3.085 1.386a.651.651 0 0 0 0 1.301h1.713a.65.65 0 0 0 0-1.3zM14.625 5.35l-.001 1.298V5.385l-.002-.036zm-2.7-2.665a2.7 2.7 0 0 1 2.697 2.664L1.377 5.346a2.7 2.7 0 0 1 2.698-2.661z'
    />
  </Svg>,
);
