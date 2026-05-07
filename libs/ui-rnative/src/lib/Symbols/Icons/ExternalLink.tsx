import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * ExternalLink icon component for React Native.
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
 * import { ExternalLink } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ExternalLink />
 *
 * @example
 * // With custom size and style
 * <ExternalLink size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ExternalLink} size="md">
 *   Click me
 * </Button>
 */
export const ExternalLink = createIcon(
  'ExternalLink',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m8 8 5-5M9.333 3H13v3.667M6 3H4.333C3.597 3 3 3.597 3 4.333v7.334C3 12.4 3.597 13 4.333 13h7.334C12.4 13 13 12.4 13 11.667V10'
    />
  </Svg>,
);
