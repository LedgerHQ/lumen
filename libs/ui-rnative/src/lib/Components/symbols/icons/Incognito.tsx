import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Incognito icon component for React Native.
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
 * import { Incognito } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Incognito />
 *
 * @example
 * // With custom size and style
 * <Incognito size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Incognito} size="md">
 *   Click me
 * </Button>
 */
export const Incognito = createIcon(
  'Incognito',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m3.958 6 .481-2.888a1.335 1.335 0 0 1 1.316-1.114h4.41c.652 0 1.208.471 1.315 1.114l.482 2.887m-5.145 6.003a2 2 0 1 1-4.002 0 2 2 0 0 1 4.002 0m0 0c.632-.763 1.655-.763 2.287 0m0 0a2 2 0 1 0 4.002 0 2 2 0 0 0-4.002 0M1.998 8.667c3.315-1.779 8.69-1.779 12.005 0'
    />
  </Svg>,
);
