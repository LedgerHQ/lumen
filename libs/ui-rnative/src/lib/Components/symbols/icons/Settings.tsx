import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Settings icon component for React Native.
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
 * import { Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Settings />
 *
 * @example
 * // With custom size and style
 * <Settings size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Settings} size="md">
 *   Click me
 * </Button>
 */
export const Settings = createIcon(
  'Settings',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8.533 2a.67.67 0 0 1 .628.441l.338.944a.67.67 0 0 0 .295.352l1.005.58a.67.67 0 0 0 .451.078l.987-.178a.67.67 0 0 1 .696.323l.534.92a.67.67 0 0 1-.067.764l-.647.765a.67.67 0 0 0-.158.431v1.16c0 .158.056.31.158.43l.647.766a.67.67 0 0 1 .067.764l-.534.92a.67.67 0 0 1-.696.323l-.986-.178a.67.67 0 0 0-.452.078l-1.004.58a.67.67 0 0 0-.295.352l-.339.944a.67.67 0 0 1-.628.441H7.467a.67.67 0 0 1-.628-.441l-.338-.944a.67.67 0 0 0-.294-.352l-1.006-.58a.67.67 0 0 0-.451-.078l-.987.178a.67.67 0 0 1-.696-.323l-.534-.92a.67.67 0 0 1 .067-.764l.647-.765a.67.67 0 0 0 .158-.431V7.42a.67.67 0 0 0-.158-.43l-.64-.766a.67.67 0 0 1-.067-.764l.533-.92a.67.67 0 0 1 .696-.323l.987.178c.155.028.315 0 .451-.078l1.006-.58a.67.67 0 0 0 .294-.352l.338-.944A.67.67 0 0 1 7.467 2z'
    />
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 9.833a1.833 1.833 0 1 0 0-3.666 1.833 1.833 0 0 0 0 3.666'
    />
  </Svg>,
);
