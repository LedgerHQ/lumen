import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * RecoveryKey icon component for React Native.
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
 * import { RecoveryKey } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <RecoveryKey />
 *
 * @example
 * // With custom size and style
 * <RecoveryKey size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={RecoveryKey} size="md">
 *   Click me
 * </Button>
 */
export const RecoveryKey = createIcon(
  'RecoveryKey',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <G clipPath='url(#clip0_7062_10)'>
      <Path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.3}
        d='M6.333 4.667H4.667v1m1.666 5.666H4.667v-1m5-5.666h1.666v1m-1.666 5.666h1.666v-1m-8 4.334h9.334a2 2 0 0 0 2-2V3.333a2 2 0 0 0-2-2H3.333a2 2 0 0 0-2 2v9.334a2 2 0 0 0 2 2'
      />
    </G>
    <Defs>
      <ClipPath id='clip0_7062_10'>
        <Path fill='#fff' d='M0 0h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>,
);
