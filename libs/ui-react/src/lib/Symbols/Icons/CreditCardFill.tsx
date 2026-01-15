import createIcon from '../../Components/Icon/createIcon';

/**
 * CreditCardFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:CreditCardFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CreditCardFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CreditCardFill />
 *
 * @example
 * // With custom size and className
 * <CreditCardFill size={40} className="text-warning" />
 */
export const CreditCardFill = createIcon(
  'CreditCardFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='m1.376 6.646 13.248.002v4.167a2.5 2.5 0 0 1-2.5 2.5H3.876a2.5 2.5 0 0 1-2.5-2.5zm3.085 1.386a.651.651 0 0 0 0 1.301h1.713a.65.65 0 0 0 0-1.3zM14.625 5.35l-.001 1.298V5.385l-.002-.036zm-2.7-2.665a2.7 2.7 0 0 1 2.697 2.664L1.377 5.346a2.7 2.7 0 0 1 2.698-2.661z'
    />
  </svg>,
);
