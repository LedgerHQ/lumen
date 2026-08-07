import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * PenEdit icon component for React Native.
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
 * import { PenEdit } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <PenEdit />
 *
 * @example
 * // With custom size and style
 * <PenEdit size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={PenEdit} size="md">
 *   Click me
 * </Button>
 */
export const PenEdit = createIcon(
  'PenEdit',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m9.167 4.773 2.06 2.06m-7.7 3.574 6.88-6.887c.26-.26.68-.26.94 0l1.113 1.113c.26.26.26.68 0 .94L5.573 12.46a.7.7 0 0 1-.473.194H3.313v-1.787a.66.66 0 0 1 .194-.473z'
    />
  </Svg>,
);
