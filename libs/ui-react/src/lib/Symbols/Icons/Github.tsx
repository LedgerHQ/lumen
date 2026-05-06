import createIcon from '../../Components/Icon/createIcon';

/**
 * Github icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Github Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Github } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Github />
 *
 * @example
 * // With custom size and className
 * <Github size={40} className="text-warning" />
 */
export const Github = createIcon(
  'Github',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <g clipPath='url(#clip0_3_426)'>
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M8.006.8C4.021.8.8 4.1.8 8.183c0 3.263 2.064 6.025 4.927 7.003.358.073.49-.159.49-.354 0-.171-.012-.758-.012-1.37-2.005.44-2.422-.88-2.422-.88-.323-.855-.8-1.075-.8-1.075-.656-.452.048-.452.048-.452.728.049 1.11.758 1.11.758.644 1.124 1.682.806 2.1.61.059-.476.25-.806.453-.99-1.6-.17-3.281-.806-3.281-3.642 0-.806.286-1.466.74-1.98-.072-.183-.323-.94.071-1.955 0 0 .608-.196 1.98.757a6.8 6.8 0 0 1 1.802-.244c.608 0 1.229.086 1.801.244 1.372-.953 1.98-.757 1.98-.757.395 1.014.144 1.772.072 1.955.466.514.74 1.174.74 1.98 0 2.836-1.682 3.46-3.293 3.643.263.232.49.672.49 1.369 0 .99-.012 1.784-.012 2.029 0 .195.13.427.489.354 2.863-.978 4.927-3.74 4.927-7.003C15.212 4.1 11.979.8 8.006.8'
        clipRule='evenodd'
      />
    </g>
    <defs>
      <clipPath id='clip0_3_426'>
        <path fill='#fff' d='M0 0h16v16H0z' />
      </clipPath>
    </defs>
  </svg>,
);
