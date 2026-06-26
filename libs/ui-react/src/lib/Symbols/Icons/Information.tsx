import createIcon from '../../Components/Icon/createIcon';

/**
 * Information icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Information Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Information } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Information />
 *
 * @example
 * // With custom size and className
 * <Information size={40} className="text-warning" />
 */
export const Information = createIcon(
  'Information',
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
      d='M7.993 5.333a.165.165 0 0 0-.166.167.17.17 0 0 0 .166.167c.087 0 .167-.08.167-.167a.17.17 0 0 0-.173-.167M8 8v3.333M8 14c-3.32 0-6-2.686-6-6 0-3.32 2.686-6 6-6a6 6 0 1 1 0 12'
    />
  </svg>,
);
