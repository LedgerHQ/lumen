import createIcon from '../../Components/Icon/createIcon';

/**
 * BluetoothCircleFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:BluetoothCircleFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { BluetoothCircleFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <BluetoothCircleFill />
 *
 * @example
 * // With custom size and className
 * <BluetoothCircleFill size={40} className="text-warning" />
 */
export const BluetoothCircleFill = createIcon(
  'BluetoothCircleFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='m9.29 9.576-1.032-.871v1.627zM8.258 5.668v1.627l1.031-.87z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M8 14.4A6.4 6.4 0 1 0 8 1.6a6.4 6.4 0 0 0 0 12.8m.078-9.955a.44.44 0 0 0-.7.355v2.01l-1.094-.924a.44.44 0 1 0-.568.672l1.662 1.404v.076L5.716 9.442a.44.44 0 1 0 .568.672l1.094-.924v2.01a.44.44 0 0 0 .7.355l2.182-1.6a.44.44 0 0 0 .024-.691L8.787 8l1.497-1.264a.44.44 0 0 0-.024-.69z'
      clipRule='evenodd'
    />
  </svg>,
);
