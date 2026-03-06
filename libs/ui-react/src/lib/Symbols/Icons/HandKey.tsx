import createIcon from '../../Components/Icon/createIcon';

/**
 * HandKey icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:HandKey Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { HandKey } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <HandKey />
 *
 * @example
 * // With custom size and className
 * <HandKey size={40} className="text-warning" />
 */
export const HandKey = createIcon(
  'HandKey',
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
      d='M4.647 13.307h1.008c.214 0 .434.026.647.08l1.767.446c.386.1.78.107 1.173.034l1.953-.387c.52-.107.994-.36 1.367-.727l1.387-1.38a1.01 1.01 0 0 0-1.32-1.52l-1.607 1.214a1.34 1.34 0 0 1-.8.266H8.667h.986c.554 0 1.007-.453 1.007-1.013v-.207c0-.466-.32-.873-.767-.98l-1.528-.386a3.152 3.152 0 0 0-2.5.427l-1.213.806m4.308-7.2H5.877a.66.66 0 0 0-.474.193l-.553.547a.663.663 0 0 0 0 .94l.547.547c.12.12.293.193.466.193l3.08-.007h.007a2.66 2.66 0 0 0 2.353 1.449 2.68 2.68 0 0 0 2.66-2.672 2.658 2.658 0 0 0-5.026-1.211m2.398 1.414c.093 0 .173-.08.173-.18s-.08-.18-.18-.18a.174.174 0 1 0-.007.347M4 14H2.667A.67.67 0 0 1 2 13.333v-4a.66.66 0 0 1 .667-.666H4c.367 0 .667.293.667.666v4c0 .367-.3.667-.667.667'
    />
  </svg>,
);
