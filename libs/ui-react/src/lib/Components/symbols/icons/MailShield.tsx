import createIcon from '../Icon/createIcon';

/**
 * MailShield icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:MailShield Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { MailShield } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <MailShield />
 *
 * @example
 * // With custom size and className
 * <MailShield size={40} className="text-warning" />
 */
export const MailShield = createIcon(
  'MailShield',
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
      d='M13.114 7.073V3.88m-5.757 7.033H3.52a1.28 1.28 0 0 1-1.279-1.28V3.862m0 0c0-.71.576-1.287 1.286-1.287h8.302a1.287 1.287 0 0 1 .722 2.352L9.124 7.251a2.58 2.58 0 0 1-2.893 0L2.804 4.927a1.29 1.29 0 0 1-.564-1.065m11.927 6.183v1.598c0 1.124-1.412 1.953-2.04 2.267a.65.65 0 0 1-.587 0c-.628-.314-2.04-1.144-2.04-2.267v-1.598a.34.34 0 0 1 .315-.33 3.3 3.3 0 0 0 1.638-.612.65.65 0 0 1 .76 0 3.3 3.3 0 0 0 1.638.613c.174.013.31.155.316.33'
    />
  </svg>,
);
