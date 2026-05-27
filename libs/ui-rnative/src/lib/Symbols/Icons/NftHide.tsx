import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * NftHide icon component for React Native.
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
 * import { NftHide } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <NftHide />
 *
 * @example
 * // With custom size and style
 * <NftHide size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={NftHide} size="md">
 *   Click me
 * </Button>
 */
export const NftHide = createIcon(
  'NftHide',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M14 8.667v2.666C14 12.8 12.8 14 11.333 14H4.667m0 0A2.67 2.67 0 0 1 2 11.333V4.667A2.666 2.666 0 0 1 4.667 2h2.666M4.667 14 8.86 9.8a1.59 1.59 0 0 1 2.267 0l2.62 2.62M2 8.667l.86-.867a1.595 1.595 0 0 1 2.267-.007l2.86 2.86m4.265-6.72c.034.034.034.094 0 .134a.11.11 0 0 1-.14 0 .097.097 0 0 1 0-.14c.034-.04.094-.04.134 0M9.84 4.46a.83.83 0 0 1 0-.92c.56-.86 1.453-1.547 2.342-1.547.886 0 1.773.68 2.34 1.54.18.274.18.64 0 .92-.567.855-1.46 1.54-2.347 1.54-.893 0-1.78-.686-2.342-1.54z'
    />
  </Svg>,
);
