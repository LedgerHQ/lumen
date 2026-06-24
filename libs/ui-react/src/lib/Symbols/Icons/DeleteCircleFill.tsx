import createIcon from '../../Components/Icon/createIcon';

/**
 * DeleteCircleFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:DeleteCircleFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { DeleteCircleFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <DeleteCircleFill />
 *
 * @example
 * // With custom size and className
 * <DeleteCircleFill size={40} className="text-warning" />
 */
export const DeleteCircleFill = createIcon(
  'DeleteCircleFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M1.5 8c0-3.596 2.91-6.5 6.5-6.5a6.5 6.5 0 1 1 0 13c-3.596 0-6.5-2.91-6.5-6.5m4.967-2.24a.5.5 0 0 0-.707.707L7.293 8 5.76 9.533a.5.5 0 0 0 .707.707L8 8.707l1.533 1.533a.5.5 0 0 0 .707-.707L8.707 8l1.533-1.533a.5.5 0 0 0-.707-.707L8 7.293z'
      clipRule='evenodd'
    />
  </svg>,
);
