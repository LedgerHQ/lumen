import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * AiBubble icon component for React Native.
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
 * import { AiBubble } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <AiBubble />
 *
 * @example
 * // With custom size and style
 * <AiBubble size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={AiBubble} size="md">
 *   Click me
 * </Button>
 */
export const AiBubble = createIcon(
  'AiBubble',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <G clipPath='url(#clip0_10870_31)'>
      <Path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M5.328 9.168h3m.256.779-1.26-3.893h-.982l-1.26 3.893m5.643 0V6.054M.995 8.001a6.97 6.97 0 0 0 1.269 4.014l-.492 2.214 2.214-.492A7.003 7.003 0 1 0 .995 8'
      />
    </G>
    <Defs>
      <ClipPath id='clip0_10870_31'>
        <Path fill='#fff' d='M0 0h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>,
);
