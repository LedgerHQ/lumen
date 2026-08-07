import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * CheckmarkCircleFill icon component for React Native.
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
 * import { CheckmarkCircleFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CheckmarkCircleFill />
 *
 * @example
 * // With custom size and style
 * <CheckmarkCircleFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CheckmarkCircleFill} size="md">
 *   Click me
 * </Button>
 */
export const CheckmarkCircleFill = createIcon(
  'CheckmarkCircleFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M8.001 1.35a6.65 6.65 0 1 1-.003 13.301A6.65 6.65 0 0 1 8.001 1.35m2.795 4.58a.67.67 0 0 0-.944 0L7.064 8.718l-.963-.962a.666.666 0 1 0-.943.942l1.444 1.445a.67.67 0 0 0 1.027-.105l3.167-3.164a.667.667 0 0 0 0-.942'
    />
  </Svg>,
);
