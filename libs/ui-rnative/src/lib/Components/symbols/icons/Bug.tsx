import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Bug icon component for React Native.
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
 * import { Bug } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Bug />
 *
 * @example
 * // With custom size and style
 * <Bug size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Bug} size="md">
 *   Click me
 * </Button>
 */
export const Bug = createIcon(
  'Bug',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M7.333 5.667 6.667 5m2 .667L9.333 5m2 1.333a4.716 4.716 0 0 1-6.666 0M5.9 9.78c-.46.22-.88.52-1.24.88m6.673.007a4.5 4.5 0 0 0-1.24-.887M5.5 8.5H4.333m7.334 0H10.5M8 5.667c-.663 0-1.299.28-1.768.78A2.76 2.76 0 0 0 5.5 8.334c0 .708.263 1.386.732 1.886.47.5 1.105.781 1.768.781s1.299-.281 1.768-.781a2.76 2.76 0 0 0 .732-1.886 2.76 2.76 0 0 0-.732-1.885A2.42 2.42 0 0 0 8 5.667M5.333 2h5.334A3.333 3.333 0 0 1 14 5.333v5.334A3.333 3.333 0 0 1 10.667 14H5.333A3.333 3.333 0 0 1 2 10.667V5.333A3.333 3.333 0 0 1 5.333 2'
    />
  </Svg>,
);
