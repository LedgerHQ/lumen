import createIcon from '../../Components/Icon/createIcon';

/**
 * RecoveryKey icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:RecoveryKey Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { RecoveryKey } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <RecoveryKey />
 *
 * @example
 * // With custom size and className
 * <RecoveryKey size={40} className="text-warning" />
 */
export const RecoveryKey = createIcon(
  'RecoveryKey',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <g clipPath='url(#clip0_7062_10)'>
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.3}
        d='M6.333 4.667H4.667v1m1.666 5.666H4.667v-1m5-5.666h1.666v1m-1.666 5.666h1.666v-1m-8 4.334h9.334a2 2 0 0 0 2-2V3.333a2 2 0 0 0-2-2H3.333a2 2 0 0 0-2 2v9.334a2 2 0 0 0 2 2'
      />
    </g>
    <defs>
      <clipPath id='clip0_7062_10'>
        <path fill='#fff' d='M0 0h16v16H0z' />
      </clipPath>
    </defs>
  </svg>,
);
