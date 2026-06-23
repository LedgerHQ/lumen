import createIcon from '../../Components/Icon/createIcon';

/**
 * Question icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Question Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Question } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Question />
 *
 * @example
 * // With custom size and className
 * <Question size={40} className="text-warning" />
 */
export const Question = createIcon(
  'Question',
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
      d='M6.453 6.453a1.444 1.444 0 0 1 1.474-1.126 1.42 1.42 0 0 1 1.5 1.333c0 1-1.434 1.333-1.434 2M8 10.4a.083.083 0 0 0-.083.083c0 .045.036.084.083.084a.085.085 0 0 0 .083-.084.084.084 0 0 0-.085-.083M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2'
    />
  </svg>,
);
