import createIcon from '../../Components/Icon/createIcon';

/**
 * DatabaseLock icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:DatabaseLock Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { DatabaseLock } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <DatabaseLock />
 *
 * @example
 * // With custom size and className
 * <DatabaseLock size={40} className="text-warning" />
 */
export const DatabaseLock = createIcon(
  'DatabaseLock',
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
      d='M2.667 9.407c0 .973 2.246 1.76 5.02 1.76m4.98-7.407c0 .973-2.24 1.76-5 1.76-2.767 0-5-.793-5-1.767m10 2.834c0 .973-2.24 1.76-5 1.76-2.767 0-5-.794-5-1.767M13.149 12v-.853c0-.607-.52-1.154-1.154-1.154-.64 0-1.153.514-1.153 1.147v.847M7.691 14c-2.775 0-5.024-.793-5.024-1.767V3.76c0-.98 2.233-1.767 5-1.767 2.76 0 5 .787 5 1.76v4.234m.684 6.68h-2.702a.654.654 0 0 1-.653-.654V12.64c0-.36.287-.653.647-.653h2.701c.353 0 .647.286.647.646V14a.653.653 0 0 1-.654.647z'
    />
  </svg>,
);
