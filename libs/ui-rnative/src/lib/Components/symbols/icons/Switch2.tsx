import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Switch2 icon component for React Native.
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
 * import { Switch2 } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Switch2 />
 *
 * @example
 * // With custom size and style
 * <Switch2 size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Switch2} size="md">
 *   Click me
 * </Button>
 */
export const Switch2 = createIcon(
  'Switch2',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M11.607 7.053c.52.52.52 1.36 0 1.88-.527.52-1.367.52-1.887 0a1.324 1.324 0 0 1 0-1.886 1.316 1.316 0 0 1 1.88 0m-6.267-2.38h5.334a3.335 3.335 0 0 1 0 6.667H5.333a3.334 3.334 0 0 1 0-6.667'
    />
  </Svg>,
);
