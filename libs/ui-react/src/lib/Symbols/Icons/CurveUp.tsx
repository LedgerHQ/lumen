import createIcon from '../../Components/Icon/createIcon';

/**
 * CurveUp icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:CurveUp Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CurveUp } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CurveUp />
 *
 * @example
 * // With custom size and className
 * <CurveUp size={40} className="text-warning" />
 */
export const CurveUp = createIcon(
  'CurveUp',
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
      d='M1.52 4.208H10.2'
    />
    <path
      stroke='currentColor'
      strokeDasharray='1 2'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.235 4.207h2.393'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2.264 13.901c-.108-1.203.447-3.305 3.236-3.932 2.719-.611 5.44-1.397 5.912-4.106'
    />
    <circle
      cx={11.71}
      cy={4.207}
      r={1.458}
      stroke='currentColor'
      strokeWidth={1.3}
    />
  </svg>,
);
