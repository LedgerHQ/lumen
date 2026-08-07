import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Placeholder icon component for React Native.
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
 * import { Placeholder } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Placeholder />
 *
 * @example
 * // With custom size and style
 * <Placeholder size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Placeholder} size="md">
 *   Click me
 * </Button>
 */
export const Placeholder = createIcon(
  'Placeholder',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <G clipPath='url(#clip0_5625_429)'>
      <Path
        stroke='currentColor'
        strokeWidth={1.3}
        d='M1.889 1.889 14.11 14.11m-12.222 0L14.11 1.89M1.333 1.333h13.334v13.334H1.333z'
      />
    </G>
    <Defs>
      <ClipPath id='clip0_5625_429'>
        <Path fill='#fff' d='M0 0h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>,
);
