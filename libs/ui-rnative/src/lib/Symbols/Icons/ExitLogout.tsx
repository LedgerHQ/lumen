import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * ExitLogout icon component for React Native.
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
 * import { ExitLogout } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ExitLogout />
 *
 * @example
 * // With custom size and style
 * <ExitLogout size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ExitLogout} size="md">
 *   Click me
 * </Button>
 */
export const ExitLogout = createIcon(
  'ExitLogout',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M7.333 8H14m-2.333-2.333L14 8l-2.333 2.333M8 2H4c-1.107 0-2 .893-2 2v8c0 1.1.893 2 2 2h4'
    />
  </Svg>,
);
