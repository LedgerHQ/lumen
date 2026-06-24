import createIcon from '../../Components/Icon/createIcon';

/**
 * Facebook icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Facebook Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Facebook } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Facebook />
 *
 * @example
 * // With custom size and className
 * <Facebook size={40} className="text-warning" />
 */
export const Facebook = createIcon(
  'Facebook',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M15 8.044C15 4.155 11.864 1 8 1S1 4.155 1 8.044C1 11.562 3.56 14.478 6.911 15v-4.925H5.124V8.044H6.91V6.49C6.911 4.73 7.95 3.75 9.55 3.75c.764 0 1.557.145 1.557.145v1.72h-.88c-.872 0-1.146.55-1.146 1.102v1.32h1.947l-.31 2.031H9.08v4.926c3.36-.515 5.919-3.431 5.919-6.95'
    />
  </svg>,
);
