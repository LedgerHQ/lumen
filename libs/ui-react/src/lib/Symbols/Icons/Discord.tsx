import createIcon from '../../Components/Icon/createIcon';

/**
 * Discord icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Discord Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Discord } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Discord />
 *
 * @example
 * // With custom size and className
 * <Discord size={40} className="text-warning" />
 */
export const Discord = createIcon(
  'Discord',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M12.628 4.115c-.876-.37-1.8-.633-2.75-.782q-.195.323-.353.662c-1.012-.14-2.041-.14-3.053 0a7 7 0 0 0-.352-.662c-.95.15-1.876.413-2.753.784-1.741 2.379-2.213 4.699-1.977 6.985 1.02.696 2.16 1.225 3.374 1.565q.41-.511.722-1.076a7.5 7.5 0 0 1-1.138-.502q.144-.097.28-.194A8.5 8.5 0 0 0 8 11.591a8.5 8.5 0 0 0 3.373-.696q.136.104.279.194a7.5 7.5 0 0 1-1.14.503q.312.565.722 1.075a11.4 11.4 0 0 0 3.376-1.564c.277-2.652-.473-4.95-1.982-6.988M5.785 9.696c-.657 0-1.2-.551-1.2-1.23 0-.677.524-1.233 1.198-1.233s1.213.556 1.202 1.234-.53 1.229-1.2 1.229m4.43 0c-.659 0-1.2-.551-1.2-1.23 0-.677.524-1.233 1.2-1.233s1.21.556 1.199 1.234c-.012.678-.529 1.229-1.2 1.229'
    />
  </svg>,
);
