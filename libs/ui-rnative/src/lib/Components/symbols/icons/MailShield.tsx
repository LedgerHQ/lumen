import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * MailShield icon component for React Native.
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
 * import { MailShield } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <MailShield />
 *
 * @example
 * // With custom size and style
 * <MailShield size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={MailShield} size="md">
 *   Click me
 * </Button>
 */
export const MailShield = createIcon(
  'MailShield',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.114 7.073V3.88m-5.757 7.033H3.52a1.28 1.28 0 0 1-1.279-1.28V3.862m0 0c0-.71.576-1.287 1.286-1.287h8.302a1.287 1.287 0 0 1 .722 2.352L9.124 7.251a2.58 2.58 0 0 1-2.893 0L2.804 4.927a1.29 1.29 0 0 1-.564-1.065m11.927 6.183v1.598c0 1.124-1.412 1.953-2.04 2.267a.65.65 0 0 1-.587 0c-.628-.314-2.04-1.144-2.04-2.267v-1.598a.34.34 0 0 1 .315-.33 3.3 3.3 0 0 0 1.638-.612.65.65 0 0 1 .76 0 3.3 3.3 0 0 0 1.638.613c.174.013.31.155.316.33'
    />
  </Svg>,
);
