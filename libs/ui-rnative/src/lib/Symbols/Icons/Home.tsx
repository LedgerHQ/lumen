import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Home icon component for React Native.
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
 * import { Home } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Home />
 *
 * @example
 * // With custom size and style
 * <Home size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Home} size="md">
 *   Click me
 * </Button>
 */
export const Home = createIcon(
  'Home',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2.667 5.733V14H6v-4c0-.74.593-1.333 1.333-1.333h1.334C9.4 8.667 10 9.26 10 10v4h3.333V5.733m-12 .934L8 2l6.667 4.667'
    />
  </Svg>,
);
