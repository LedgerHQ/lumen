import createIcon from '../../Components/Icon/createIcon';

/**
 * BitcoinVoucher icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:BitcoinVoucher Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { BitcoinVoucher } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <BitcoinVoucher />
 *
 * @example
 * // With custom size and className
 * <BitcoinVoucher size={40} className="text-warning" />
 */
export const BitcoinVoucher = createIcon(
  'BitcoinVoucher',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.333 3.05v9.9a.67.67 0 0 1-.332.577l-.66.383a.67.67 0 0 1-.665.002l-1.013-.578-.992.575a.67.67 0 0 1-.667.002L8 13.333l-1.004.578a.67.67 0 0 1-.667-.002l-.992-.575-1.013.578a.67.67 0 0 1-.665-.002l-.66-.383a.67.67 0 0 1-.332-.577v-9.9c0-.238.126-.457.332-.577l.66-.383a.67.67 0 0 1 .665-.002l1.013.578.992-.575c.206-.12.46-.12.667-.002L8 2.667l1.004-.578a.67.67 0 0 1 .667.002l.992.575 1.013-.578a.67.67 0 0 1 .665.002l.66.384c.206.119.332.338.332.576'
      clipRule='evenodd'
    />
    <path
      fill='currentColor'
      d='M10.352 7.412c.097-.63-.397-.97-1.073-1.195l.22-.855-.536-.129-.213.832q-.211-.051-.429-.098l.215-.837L8.001 5l-.22.854q-.175-.038-.34-.078v-.003l-.738-.179-.143.555s.397.089.389.094c.217.053.256.192.25.303l-.25.973.055.017-.056-.014-.35 1.363c-.027.064-.094.16-.246.124.006.007-.389-.095-.389-.095l-.265.595.696.17q.195.047.382.095l-.222.864.535.129.22-.854q.217.056.426.107l-.219.85.535.13.222-.862c.912.168 1.599.1 1.888-.702.232-.645-.012-1.018-.492-1.26.35-.079.613-.302.683-.764M9.13 9.078c-.165.646-1.284.296-1.647.209l.294-1.145c.363.089 1.526.263 1.353.936m.166-1.675c-.151.587-1.082.289-1.384.215l.266-1.037c.302.073 1.275.21 1.118.822'
    />
  </svg>,
);
