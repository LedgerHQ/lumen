import createIcon from '../Icon/createIcon';

/**
 * DollarFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:DollarFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { DollarFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <DollarFill />
 *
 * @example
 * // With custom size and className
 * <DollarFill size={40} className="text-warning" />
 */
export const DollarFill = createIcon(
  'DollarFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M8.127 1.019a6.982 6.982 0 1 1 0 13.963 6.982 6.982 0 0 1 0-13.963m-.116 2.434a.65.65 0 0 0-.65.65v.328a2.015 2.015 0 0 0-1.958 2.01c0 .923.63 1.725 1.516 1.955l.007.001 1.826.453h.002c.31.075.533.354.533.693 0 .392-.32.713-.722.714H7.497a.815.815 0 0 1-.809-.768.65.65 0 0 0-1.296.093 2.114 2.114 0 0 0 1.97 1.968v.348a.65.65 0 0 0 1.3 0v-.346a2.015 2.015 0 0 0 .4-3.965H9.06l-1.819-.45a.724.724 0 0 1-.539-.696c0-.392.32-.713.722-.713h1.068c.422 0 .772.327.803.76a.65.65 0 0 0 1.296-.092 2.11 2.11 0 0 0-1.93-1.96v-.332a.65.65 0 0 0-.651-.65'
    />
  </svg>,
);
