import Svg, { G, Mask, Path, Circle, Defs, ClipPath } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * BellNotification icon component for React Native.
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
 * import { BellNotification } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <BellNotification />
 *
 * @example
 * // With custom size and style
 * <BellNotification size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={BellNotification} size="md">
 *   Click me
 * </Button>
 */
export const BellNotification = createIcon(
  'BellNotification',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <G clipPath='url(#clip0_3_362)'>
      <G clipPath='url(#clip1_3_362)'>
        <Mask
          id='mask0_3_362'
          width={16}
          height={16}
          x={0}
          y={0}
          maskUnits='userSpaceOnUse'
          style={{
            maskType: 'alpha',
          }}
        >
          <Path
            fill='currentColor'
            d='M16 16H0V0h7.759a4.5 4.5 0 1 0 7.482 0H16z'
          />
        </Mask>
        <G mask='url(#mask0_3_362)'>
          <Path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.3}
            d='M6 11.427v.74c0 1.1.893 2 2 2 1.1 0 2-.9 2-2v-.727m2-2.273 1.133 1.133c.12.12.194.293.194.467v-.007c0 .367-.3.667-.667.667H3.327a.664.664 0 0 1-.667-.667.66.66 0 0 1 .193-.473l1.134-1.14V6.313c0-2.213 1.786-4 4-4 2.206 0 4 1.787 4 4z'
          />
        </G>
      </G>
      <Circle cx={11.5} cy={2.5} r={2.5} fill='#C24244' />
    </G>
    <Defs>
      <ClipPath id='clip0_3_362'>
        <Path fill='#fff' d='M0 0h16v16H0z' />
      </ClipPath>
      <ClipPath id='clip1_3_362'>
        <Path fill='#fff' d='M0 0h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>,
);
