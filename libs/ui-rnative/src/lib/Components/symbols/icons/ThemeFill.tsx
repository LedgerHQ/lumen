import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * ThemeFill icon component for React Native.
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
 * import { ThemeFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ThemeFill />
 *
 * @example
 * // With custom size and style
 * <ThemeFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ThemeFill} size="md">
 *   Click me
 * </Button>
 */
export const ThemeFill = createIcon(
  'ThemeFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='m8 13.333-.026-.65.026 1.3zM8 2.667v-.65l-.026 1.3zm3.771 1.562-.46.46zm0 7.542-.46-.46zm-7.542 0 .46-.46zm0-7.542.46.46zm4.204-1.545h.65a.65.65 0 0 0-.623-.65zm0 10.632.027.65a.65.65 0 0 0 .623-.65zM13.333 8h-.65A4.683 4.683 0 0 1 8 12.683v1.3A5.983 5.983 0 0 0 13.983 8zM8 2.667v.65A4.683 4.683 0 0 1 12.683 8h1.3A5.983 5.983 0 0 0 8 2.017zm3.771 1.562-.46.46a4.683 4.683 0 0 1 0 6.623l.46.46.46.459a5.983 5.983 0 0 0 0-8.462zm0 7.542-.46-.46a4.683 4.683 0 0 1-6.623 0l-.46.46-.459.46a5.983 5.983 0 0 0 8.462 0zm-7.542 0 .46-.46a4.683 4.683 0 0 1 0-6.623l-.46-.46-.46-.459a5.983 5.983 0 0 0 0 8.462zm0-7.542.46.46a4.683 4.683 0 0 1 6.623 0l.46-.46.459-.46a5.983 5.983 0 0 0-8.462 0zm4.204-1.545.027-.65-.434-.017-.026.65-.026.65.433.017zM8 13.334l.026.649.434-.018-.027-.65-.026-.649-.433.018zm.433-.018h.65V2.684h-1.3v10.632z'
    />
  </Svg>,
);
