import createIcon from '../../Components/Icon/createIcon';

/**
 * CurveDown icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:CurveDown Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CurveDown } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CurveDown />
 *
 * @example
 * // With custom size and className
 * <CurveDown size={40} className="text-warning" />
 */
export const CurveDown = createIcon(
  'CurveDown',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 17 16'
  >
    <path
      stroke='currentColor'
      strokeDasharray='1 2.2'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M1.52 11.793H10.2'
    />
    <path
      stroke='currentColor'
      strokeDasharray='1 2'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.235 11.793h2.393'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2.264 2.099C2.156 3.302 2.711 5.404 5.5 6.03c2.719.611 5.44 1.397 5.912 4.106'
    />
    <circle
      cx={2.108}
      cy={2.108}
      r={1.458}
      stroke='currentColor'
      strokeWidth={1.3}
      transform='matrix(1 0 0 -1 9.601 13.901)'
    />
  </svg>,
);
