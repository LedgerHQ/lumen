import createIcon from '../../Components/Icon/createIcon';

/**
 * BookOpen icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:BookOpen Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { BookOpen } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <BookOpen />
 *
 * @example
 * // With custom size and className
 * <BookOpen size={40} className="text-warning" />
 */
export const BookOpen = createIcon(
  'BookOpen',
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
      d='M12.667 3.333h.666c.734 0 1.334.594 1.334 1.334v8c0 .733-.6 1.333-1.334 1.333H2.667c-.737 0-1.334-.6-1.334-1.333v-8c0-.74.597-1.334 1.334-1.334h.666M8 4a2 2 0 0 0-2-2H4a.66.66 0 0 0-.667.667v8.666c0 .367.294.667.667.667h2a2 2 0 0 1 2 2M8 4a2 2 0 0 1 2-2h2c.367 0 .667.299.667.667v8.666c0 .367-.3.667-.667.667h-2a2 2 0 0 0-2 2M8 4v10'
    />
  </svg>,
);
