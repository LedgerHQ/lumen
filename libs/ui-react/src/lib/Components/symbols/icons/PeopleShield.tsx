import createIcon from '../Icon/createIcon';

/**
 * PeopleShield icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:PeopleShield Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { PeopleShield } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <PeopleShield />
 *
 * @example
 * // With custom size and className
 * <PeopleShield size={40} className="text-warning" />
 */
export const PeopleShield = createIcon(
  'PeopleShield',
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
      d='M2.667 13.333c0-1.666 1.333-3 3-3H7.4m3.8-.133c.267-.133.6-.133.933 0l1.2.467v1.4c0 1.2-1.666 2-1.666 2s-1.667-.8-1.667-2v-1.4zM10 3.467c1.133 1.133 1.133 2.933 0 4-1.133 1.066-2.933 1.133-4 0s-1.133-2.934 0-4a2.9 2.9 0 0 1 4 0'
    />
  </svg>,
);
