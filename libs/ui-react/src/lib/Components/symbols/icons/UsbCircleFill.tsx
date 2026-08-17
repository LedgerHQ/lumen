import createIcon from '../Icon/createIcon';

/**
 * UsbCircleFill icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:UsbCircleFill Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { UsbCircleFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <UsbCircleFill />
 *
 * @example
 * // With custom size and className
 * <UsbCircleFill size={40} className="text-warning" />
 */
export const UsbCircleFill = createIcon(
  'UsbCircleFill',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M8 10.4a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2M5.8 6.6a.3.3 0 0 1 .045.595.4.4 0 0 0-.096 0A.3.3 0 0 1 5.8 6.6M10.5 6v.6h-.223a.4.4 0 0 0-.162 0H9.9V6z'
    />
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M8 1.6a6.4 6.4 0 1 1 0 12.8A6.4 6.4 0 0 1 8 1.6m.283 2.117a.4.4 0 0 0-.535-.027l-.03.027-.9.9a.4.4 0 0 0 .565.566l.217-.217v3.823l-1.089-.243a.404.404 0 0 1-.315-.394v-.227a1.099 1.099 0 1 0-1.174-1.803 1.1 1.1 0 0 0 .374 1.8v.23c0 .564.391 1.049.94 1.174L7.6 9.61v.05a1.4 1.4 0 1 0 .8 0v-.702l1.344-.406.002-.001c.502-.155.85-.621.85-1.15v-.007A.8.8 0 0 0 11.3 6.6V6a.8.8 0 0 0-.8-.8h-.6a.8.8 0 0 0-.8.8v.6a.8.8 0 0 0 .696.792V7.4a.41.41 0 0 1-.286.386L8.4 8.12V4.966l.217.217.03.027a.4.4 0 0 0 .563-.562l-.027-.03z'
      clipRule='evenodd'
    />
  </svg>,
);
