import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Question icon component for React Native.
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
 * import { Question } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Question />
 *
 * @example
 * // With custom size and style
 * <Question size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Question} size="md">
 *   Click me
 * </Button>
 */
export const Question = createIcon(
  'Question',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M6.453 6.453a1.444 1.444 0 0 1 1.474-1.126 1.42 1.42 0 0 1 1.5 1.333c0 1-1.434 1.333-1.434 2M8 10.4a.083.083 0 0 0-.083.083c0 .045.036.084.083.084a.085.085 0 0 0 .083-.084.084.084 0 0 0-.085-.083M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2'
    />
  </Svg>,
);
