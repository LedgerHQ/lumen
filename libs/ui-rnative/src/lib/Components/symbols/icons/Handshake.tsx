import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Handshake icon component for React Native.
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
 * import { Handshake } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Handshake />
 *
 * @example
 * // With custom size and style
 * <Handshake size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Handshake} size="md">
 *   Click me
 * </Button>
 */
export const Handshake = createIcon(
  'Handshake',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M11.307 9.276h-.634a1.2 1.2 0 0 0-.5.108L7.637 10.54m6.368-5.146h-1.667a1 1 0 0 0-1 1v2.668a1 1 0 0 0 1 1h1.667M2 10.061h1.667a1 1 0 0 0 1-1V6.393a1 1 0 0 0-1-1H2m9.608.285-2.066-.91c-.372-.163-.8-.128-1.141.092L6.828 5.88a.908.908 0 0 0 .877 1.584l.938-.438.659.598a.98.98 0 0 1 .003 1.45l-1.397 1.279c-.46.42-1.163.422-1.624.004l-.84-.762a1.3 1.3 0 0 0-.742-.322m-.02-3.178 1.456-.524c.335-.118.704-.08 1.01.1'
    />
  </Svg>,
);
