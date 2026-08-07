import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * ShieldMore icon component for React Native.
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
 * import { ShieldMore } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ShieldMore />
 *
 * @example
 * // With custom size and style
 * <ShieldMore size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ShieldMore} size="md">
 *   Click me
 * </Button>
 */
export const ShieldMore = createIcon(
  'ShieldMore',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8.118 7.549c.06.06.06.166 0 .233a.18.18 0 0 1-.24 0 .17.17 0 0 1 0-.24.16.16 0 0 1 .233 0m2.669.007c.06.06.06.166 0 .233a.18.18 0 0 1-.24 0 .17.17 0 0 1 0-.24.16.16 0 0 1 .233 0m-5.322.007c.06.06.06.166 0 .233a.18.18 0 0 1-.24 0 .17.17 0 0 1 0-.24.16.16 0 0 1 .234 0m7.888-.087c0 3.027-2.28 5.858-5.333 6.545-3.058-.693-5.333-3.52-5.333-6.545V4.82c0-.546.326-1.033.766-1.213l3.334-1.364c.806-.333 1.646-.333 2.4-.027l3.333 1.36c.5.2.827.687.827 1.234v2.627z'
    />
  </Svg>,
);
