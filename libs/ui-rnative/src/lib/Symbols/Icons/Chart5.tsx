import Svg, { Path, Mask } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Chart5 icon component for React Native.
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
 * import { Chart5 } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Chart5 />
 *
 * @example
 * // With custom size and style
 * <Chart5 size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Chart5} size="md">
 *   Click me
 * </Button>
 */
export const Chart5 = createIcon(
  'Chart5',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m3.96 10.313 2.562-2.639a.485.485 0 0 1 .712 0l1.082 1.114a.493.493 0 0 0 .713 0l3.012-3.101m-1.345.005h1.344v1.385'
    />
    <Mask id='path-2-inside-1_8174_813' fill='#fff'>
      <Path d='M.9 3.672a2 2 0 0 1 2-2h10.2a2 2 0 0 1 2 2v8.656a2 2 0 0 1-2 2H2.9a2 2 0 0 1-2-2z' />
    </Mask>
    <Path
      fill='currentColor'
      d='M2.9 1.672v1.3h10.2v-2.6H2.9zm12.2 2h-1.3v8.656h2.6V3.672zm-2 10.656v-1.3H2.9v2.6h10.2zm-12.2-2h1.3V3.672H-.4v8.656zm2 2v-1.3a.7.7 0 0 1-.7-.7H-.4a3.3 3.3 0 0 0 3.3 3.3zm12.2-2h-1.3a.7.7 0 0 1-.7.7v2.6a3.3 3.3 0 0 0 3.3-3.3zm-2-10.656v1.3a.7.7 0 0 1 .7.7h2.6a3.3 3.3 0 0 0-3.3-3.3zm-10.2 0v-1.3a3.3 3.3 0 0 0-3.3 3.3h2.6a.7.7 0 0 1 .7-.7z'
      mask='url(#path-2-inside-1_8174_813)'
    />
  </Svg>,
);
