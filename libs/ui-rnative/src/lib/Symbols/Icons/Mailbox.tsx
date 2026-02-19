import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Mailbox icon component for React Native.
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
 * import { Mailbox } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Mailbox />
 *
 * @example
 * // With custom size and style
 * <Mailbox size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Mailbox} size="md">
 *   Click me
 * </Button>
 */
export const Mailbox = createIcon(
  'Mailbox',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M9.038 4.332 7.74 5.628l-.778-.778m-.964 2.817h4.002M3.33 9.334V3.33c0-.736.598-1.333 1.334-1.333h6.67c.736 0 1.334.597 1.334 1.333v6.003M1.998 12.669v-2.335a1 1 0 0 1 1-1H4.25a1 1 0 0 1 .707.293l.651.65c.25.25.589.39.942.39h2.897c.354 0 .693-.14.944-.39l.553-.553c.25-.25.588-.39.942-.39h1.115a1 1 0 0 1 1 1v2.335c0 .736-.597 1.333-1.333 1.333H3.33a1.334 1.334 0 0 1-1.333-1.333'
    />
  </Svg>,
);
