import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Whatsapp icon component for React Native.
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
 * import { Whatsapp } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Whatsapp />
 *
 * @example
 * // With custom size and style
 * <Whatsapp size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Whatsapp} size="md">
 *   Click me
 * </Button>
 */
export const Whatsapp = createIcon(
  'Whatsapp',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      fillRule='evenodd'
      d='M7.285 7.288a4.4 4.4 0 0 0 1.427 1.427l.548-.328a.67.67 0 0 1 .76.05l1.063.851a.667.667 0 0 1 .051.996l-.48.473a2 2 0 0 1-2.474.267A10.8 10.8 0 0 1 4.976 7.82a2 2 0 0 1 .267-2.473l.473-.481a.667.667 0 0 1 .996.05l.85 1.064c.174.218.195.52.051.76z'
      clipRule='evenodd'
    />
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m4.578 13.324-1.798.3a.352.352 0 0 1-.405-.404l.3-1.798a6.345 6.345 0 1 1 1.903 1.902'
      clipRule='evenodd'
    />
  </Svg>,
);
