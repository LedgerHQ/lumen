import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * ShoppingInvoiceList icon component for React Native.
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
 * import { ShoppingInvoiceList } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ShoppingInvoiceList />
 *
 * @example
 * // With custom size and style
 * <ShoppingInvoiceList size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ShoppingInvoiceList} size="md">
 *   Click me
 * </Button>
 */
export const ShoppingInvoiceList = createIcon(
  'ShoppingInvoiceList',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13.333 14V2.987a.69.69 0 0 0-.373-.6l-.66-.334a.66.66 0 0 0-.6-.006l-1.053.513-1.034-.52a.66.66 0 0 0-.6-.007l-1.04.514-1.04-.52a.66.66 0 0 0-.6 0L5.3 2.54l-1.053-.52a.68.68 0 0 0-.6 0l-.66.327a.66.66 0 0 0-.374.593v11M10 10.667h.667m0-2.334L10 8.327m-4.667 2.34H8m0-2.334H5.333M10.667 6H5.333m9.334 8H1.333'
    />
  </Svg>,
);
