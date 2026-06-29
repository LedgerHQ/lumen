import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Contact icon component for React Native.
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
 * import { Contact } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Contact />
 *
 * @example
 * // With custom size and style
 * <Contact size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Contact} size="md">
 *   Click me
 * </Button>
 */
export const Contact = createIcon(
  'Contact',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M10.667 2h1.666c.737 0 1.334.597 1.334 1.333v9.334c0 .736-.597 1.333-1.334 1.333h-1.666m0 0H3.999a1.33 1.33 0 0 1-1.327-1.334V3.327c0-.733.593-1.334 1.333-1.327h6.668C11.407 2 12 2.58 12 3.32v9.346A1.34 1.34 0 0 1 10.667 14m2.666-9H12m1.333 3H12m1.333 3H12m-2.333-.333A2.069 2.069 0 0 0 7.752 9.38h-.837c-.524 0-1.02.186-1.398.538-.226.201-.4.453-.517.733m3.17-4.967a1.156 1.156 0 0 1 0 1.646 1.2 1.2 0 0 1-1.674 0 1.15 1.15 0 0 1 0-1.653 1.18 1.18 0 0 1 1.667 0'
    />
  </Svg>,
);
