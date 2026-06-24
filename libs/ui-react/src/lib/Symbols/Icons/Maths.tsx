import createIcon from '../../Components/Icon/createIcon';

/**
 * Maths icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Maths Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Maths } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Maths />
 *
 * @example
 * // With custom size and className
 * <Maths size={40} className="text-warning" />
 */
export const Maths = createIcon(
  'Maths',
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
      d='M9.867 12h2m-2-2h2M2 8h12m-4-3h2M4 5h2M5 6V4m-.707 6.293 1.414 1.414m-1.414 0 1.414-1.414M8 2v12m6-1.565c0 .86-.707 1.56-1.567 1.56H3.56a1.57 1.57 0 0 1-1.567-1.567V3.553c0-.866.7-1.566 1.566-1.566h8.866c.86 0 1.56.7 1.56 1.565v8.867z'
    />
  </svg>,
);
