import createIcon from '../Icon/createIcon';

/**
 * Nested icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Nested Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Nested } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Nested />
 *
 * @example
 * // With custom size and className
 * <Nested size={40} className="text-warning" />
 */
export const Nested = createIcon(
  'Nested',
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
      d='M12.125 11.111c-1.036 0-1.875.87-1.875 1.945 0 1.073.84 1.944 1.875 1.944S14 14.13 14 13.056s-.84-1.945-1.875-1.945m0 0v-.778c0-1.074-.84-1.944-1.875-1.944h-4.5c-.497 0-.974.205-1.326.57-.351.364-.549.859-.549 1.374v.778m0 0c-1.036 0-1.875.87-1.875 1.945C2 14.129 2.84 15 3.875 15s1.875-.87 1.875-1.944-.84-1.945-1.875-1.945M8 4.89c1.036 0 1.875-.87 1.875-1.945C9.875 1.871 9.035 1 8 1s-1.875.87-1.875 1.944S6.965 4.89 8 4.89m0 0v3.5'
    />
  </svg>,
);
