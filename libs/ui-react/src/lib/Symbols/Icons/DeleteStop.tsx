import createIcon from '../../Components/Icon/createIcon';

/**
 * DeleteStop icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:DeleteStop Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { DeleteStop } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <DeleteStop />
 *
 * @example
 * // With custom size and className
 * <DeleteStop size={40} className="text-warning" />
 */
export const DeleteStop = createIcon(
  'DeleteStop',
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
      d='m12.243 3.757-8.487 8.48 8.48-8.486z'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 2C4.68 2 2 4.686 2 8a6 6 0 1 0 12 0c0-3.32-2.686-6-6-6'
    />
  </svg>,
);
