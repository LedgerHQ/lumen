import createIcon from '../../Components/Icon/createIcon';

/**
 * Linkedin icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Linkedin Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Linkedin } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Linkedin />
 *
 * @example
 * // With custom size and className
 * <Linkedin size={40} className="text-warning" />
 */
export const Linkedin = createIcon(
  'Linkedin',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M13.444 15H2.556C1.696 15 1 14.304 1 13.444V2.556C1 1.696 1.696 1 2.556 1h10.888C14.304 1 15 1.696 15 2.556v10.888c0 .86-.696 1.556-1.556 1.556m-2.466-1.944h2.078V8.788c0-1.806-1.024-2.68-2.454-2.68S8.57 7.224 8.57 7.224v-.908H6.568v6.74H8.57V9.518c0-.948.436-1.512 1.271-1.512.768 0 1.137.542 1.137 1.512zM2.944 4.188A1.24 1.24 0 0 0 4.18 5.432c.682 0 1.234-.557 1.234-1.244S4.861 2.944 4.18 2.944a1.24 1.24 0 0 0-1.235 1.244m2.289 8.868H3.145V6.315h2.088z'
      clipRule='evenodd'
    />
  </svg>,
);
