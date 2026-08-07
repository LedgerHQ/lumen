import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Facebook icon component for React Native.
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
 * import { Facebook } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Facebook />
 *
 * @example
 * // With custom size and style
 * <Facebook size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Facebook} size="md">
 *   Click me
 * </Button>
 */
export const Facebook = createIcon(
  'Facebook',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M15 8.044C15 4.155 11.864 1 8 1S1 4.155 1 8.044C1 11.562 3.56 14.478 6.911 15v-4.925H5.124V8.044H6.91V6.49C6.911 4.73 7.95 3.75 9.55 3.75c.764 0 1.557.145 1.557.145v1.72h-.88c-.872 0-1.146.55-1.146 1.102v1.32h1.947l-.31 2.031H9.08v4.926c3.36-.515 5.919-3.431 5.919-6.95'
    />
  </Svg>,
);
