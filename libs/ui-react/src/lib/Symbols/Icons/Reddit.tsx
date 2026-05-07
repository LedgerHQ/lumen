import createIcon from '../../Components/Icon/createIcon';

/**
 * Reddit icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Reddit Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Reddit } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Reddit />
 *
 * @example
 * // With custom size and className
 * <Reddit size={40} className="text-warning" />
 */
export const Reddit = createIcon(
  'Reddit',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M6.395 8.08a.734.734 0 0 0-.728.737c0 .405.327.736.728.736.402 0 .73-.33.73-.736a.734.734 0 0 0-.73-.736M8.008 11.298c.279 0 1.228-.033 1.728-.538a.214.214 0 0 0 .016-.273.19.19 0 0 0-.27 0c-.32.315-.982.43-1.465.43s-1.155-.115-1.466-.43a.19.19 0 0 0-.27 0 .196.196 0 0 0 0 .273c.491.497 1.449.538 1.727.538M8.876 8.817c0 .405.328.736.729.736s.729-.33.729-.736a.734.734 0 0 0-.73-.736.734.734 0 0 0-.728.736'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M15 8.08c0 3.906-3.134 7.072-7 7.072S1 11.986 1 8.08s3.134-7.07 7-7.07 7 3.165 7 7.07m-3.357-1.033c.565 0 1.024.463 1.024 1.034 0 .422-.254.786-.59.95q.025.148.025.307c0 1.588-1.826 2.87-4.085 2.87S3.93 10.926 3.93 9.337q0-.164.025-.314a1.03 1.03 0 0 1-.606-.943c0-.57.458-1.034 1.023-1.034.27 0 .524.116.704.29.704-.521 1.679-.844 2.768-.877l.515-2.464a.2.2 0 0 1 .082-.116q.063-.037.14-.025l1.694.364a.71.71 0 0 1 .647-.414c.401 0 .729.331.729.736a.734.734 0 0 1-.729.736.733.733 0 0 1-.729-.703L8.68 4.252 8.213 6.46c1.064.041 2.03.372 2.726.877a.98.98 0 0 1 .704-.29'
      clipRule='evenodd'
    />
  </svg>,
);
