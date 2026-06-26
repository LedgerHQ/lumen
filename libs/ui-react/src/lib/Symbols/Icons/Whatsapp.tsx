import createIcon from '../../Components/Icon/createIcon';

/**
 * Whatsapp icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Whatsapp Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Whatsapp } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Whatsapp />
 *
 * @example
 * // With custom size and className
 * <Whatsapp size={40} className="text-warning" />
 */
export const Whatsapp = createIcon(
  'Whatsapp',
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
      d='M7.285 7.288a4.4 4.4 0 0 0 1.427 1.427l.548-.328a.67.67 0 0 1 .76.05l1.063.851a.667.667 0 0 1 .051.996l-.48.473a2 2 0 0 1-2.474.267A10.8 10.8 0 0 1 4.976 7.82a2 2 0 0 1 .267-2.473l.473-.481a.667.667 0 0 1 .996.05l.85 1.064c.174.218.195.52.051.76z'
      clipRule='evenodd'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m4.578 13.324-1.798.3a.352.352 0 0 1-.405-.404l.3-1.798a6.345 6.345 0 1 1 1.903 1.902'
      clipRule='evenodd'
    />
  </svg>,
);
