import createIcon from '../../Components/Icon/createIcon';

/**
 * SettingsAlt icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:SettingsAlt Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { SettingsAlt } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <SettingsAlt />
 *
 * @example
 * // With custom size and className
 * <SettingsAlt size={40} className="text-warning" />
 */
export const SettingsAlt = createIcon(
  'SettingsAlt',
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
      d='M12 3.333h2m-12 0h5.333M8.667 8H14M2 8h2m8 4.667h2m-12 0h5.333m4.276-10.28c.52.52.52 1.36 0 1.88-.526.52-1.366.52-1.886 0a1.324 1.324 0 0 1 0-1.887 1.316 1.316 0 0 1 1.88 0m-5.33 4.677c.52.52.52 1.36 0 1.88-.526.52-1.366.52-1.886 0a1.324 1.324 0 0 1 0-1.886 1.316 1.316 0 0 1 1.88 0m5.342 4.673c.52.52.52 1.36 0 1.88-.526.52-1.366.52-1.886 0a1.324 1.324 0 0 1 0-1.887 1.316 1.316 0 0 1 1.88 0'
    />
  </svg>,
);
