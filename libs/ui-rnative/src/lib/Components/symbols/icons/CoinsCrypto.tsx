import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * CoinsCrypto icon component for React Native.
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
 * import { CoinsCrypto } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CoinsCrypto />
 *
 * @example
 * // With custom size and style
 * <CoinsCrypto size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CoinsCrypto} size="md">
 *   Click me
 * </Button>
 */
export const CoinsCrypto = createIcon(
  'CoinsCrypto',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M6.453 3.295a4.42 4.42 0 0 1 6.252 0 4.42 4.42 0 0 1 0 6.252m-7.572.02V7.7h1.882c.513 0 .926.413.926.927a.93.93 0 0 1-.933.926m-.695-2.386v.534m0 4.286v-.607m4.53-1.801c0 2.44-1.98 4.421-4.422 4.421A4.42 4.42 0 0 1 2 9.579a4.414 4.414 0 0 1 4.421-4.422 4.42 4.42 0 0 1 4.422 4.422m-3.596 1.799H5.133V9.565h2.11c.494 0 .9.4.9.9 0 .493-.406.9-.906.9z'
    />
  </Svg>,
);
