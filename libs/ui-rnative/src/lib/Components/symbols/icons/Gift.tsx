import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Gift icon component for React Native.
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
 * import { Gift } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Gift />
 *
 * @example
 * // With custom size and style
 * <Gift size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Gift} size="md">
 *   Click me
 * </Button>
 */
export const Gift = createIcon(
  'Gift',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 14V5.333m2.464-.926c-.72.746-1.853.925-2.4.925m-.004.001s-.333-2.08.48-2.92m1.92 1.994a1.463 1.463 0 0 0 0-2 1.314 1.314 0 0 0-1.917 0m-.616 2.925c-.547 0-1.68-.179-2.394-.925a1.45 1.45 0 0 1 0-2 1.314 1.314 0 0 1 1.917 0m.484 2.926s.327-2.08-.487-2.92M12.667 8v5.333c0 .367-.3.667-.667.667H4a.664.664 0 0 1-.667-.667V8m10-2.667H2.667A.664.664 0 0 0 2 6v1.333C2 7.7 2.293 8 2.667 8h10.666C13.7 8 14 7.7 14 7.333V6c0-.373-.3-.667-.667-.667'
    />
  </Svg>,
);
