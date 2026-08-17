import createIcon from '../Icon/createIcon';

/**
 * CodeShield icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:CodeShield Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CodeShield } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CodeShield />
 *
 * @example
 * // With custom size and className
 * <CodeShield size={40} className="text-warning" />
 */
export const CodeShield = createIcon(
  'CodeShield',
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
      d='m10.345 6.633.988.994-1 1.006m-2.333 5a6 6 0 1 1 6-6m-8.345-1-.988.995 1 1.005M8.5 5.971l-1 3.325m4.2 1.204c.267-.133.6-.133.933 0l1.2.467v1.4c0 1.2-1.666 2-1.666 2s-1.667-.8-1.667-2v-1.4z'
    />
  </svg>,
);
