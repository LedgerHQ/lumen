import createIcon from '../../Components/Icon/createIcon';

/**
 * SparksFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:SparksFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { SparksFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <SparksFill />
 *
 * @example
 * // With custom size and className
 * <SparksFill size={40} className="text-warning" />
 */
export const SparksFill = createIcon(
  'SparksFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M8 1.333a.333.333 0 0 0-.667 0v.223c0 .39-.145.76-.398 1.029A1.28 1.28 0 0 1 6 3a.333.333 0 1 0 0 .667c.346 0 .683.146.935.415.253.27.398.64.398 1.03v.221a.333.333 0 1 0 .667 0v-.222c0-.39.145-.76.398-1.029.252-.269.589-.415.935-.415a.333.333 0 1 0 0-.667c-.346 0-.683-.147-.935-.415A1.5 1.5 0 0 1 8 1.555zM12 5.267a.333.333 0 1 0-.667 0c0 .55-.213 1.077-.589 1.464a1.97 1.97 0 0 1-1.41.602.333.333 0 0 0 0 .667c.527 0 1.034.215 1.41.602s.59.914.59 1.465a.333.333 0 0 0 .666 0c0-.551.213-1.078.59-1.465A1.97 1.97 0 0 1 14 8a.333.333 0 0 0 0-.667 1.97 1.97 0 0 1-1.41-.602A2.1 2.1 0 0 1 12 5.267M6 7.333a.333.333 0 0 0-.667 0A3.333 3.333 0 0 1 2 10.667a.333.333 0 1 0 0 .666 3.333 3.333 0 0 1 3.333 3.334.333.333 0 0 0 .667 0 3.334 3.334 0 0 1 3.333-3.334.333.333 0 1 0 0-.666A3.333 3.333 0 0 1 6 7.333'
    />
  </svg>,
);
