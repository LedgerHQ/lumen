import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * PenEditWriting icon component for React Native.
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
 * import { PenEditWriting } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <PenEditWriting />
 *
 * @example
 * // With custom size and style
 * <PenEditWriting size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={PenEditWriting} size="md">
 *   Click me
 * </Button>
 */
export const PenEditWriting = createIcon(
  'PenEditWriting',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m10.334 6.333-2-2.001m5.669 7.67-.73.73a2.064 2.064 0 0 1-2.918 0 2.07 2.07 0 0 0-2.919 0m4.152-9.653a1.415 1.415 0 0 1 0 2L4.927 11.74c-.171.171-.385.292-.62.351l-2.31.578.578-2.31c.059-.235.18-.449.35-.62l6.662-6.66a1.415 1.415 0 0 1 2 0'
    />
  </Svg>,
);
