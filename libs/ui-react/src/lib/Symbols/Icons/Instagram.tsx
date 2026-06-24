import createIcon from '../../Components/Icon/createIcon';

/**
 * Instagram icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Instagram Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Instagram } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Instagram />
 *
 * @example
 * // With custom size and className
 * <Instagram size={40} className="text-warning" />
 */
export const Instagram = createIcon(
  'Instagram',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M5.1 1.049c-.744.035-1.252.154-1.697.329-.46.179-.85.42-1.238.81a3.4 3.4 0 0 0-.806 1.24c-.172.445-.289.955-.322 1.7s-.04.984-.036 2.885c.003 1.901.012 2.14.048 2.886.036.745.154 1.254.329 1.698.18.46.42.85.81 1.239.389.388.779.626 1.241.805.445.172.954.289 1.7.322.745.032.984.04 2.885.036s2.14-.012 2.886-.047c.747-.036 1.252-.155 1.697-.329.46-.18.85-.42 1.239-.81.388-.39.627-.78.804-1.241.173-.445.29-.954.322-1.7s.04-.985.037-2.885c-.004-1.901-.012-2.14-.047-2.886s-.154-1.253-.329-1.698c-.18-.46-.42-.85-.81-1.239a3.4 3.4 0 0 0-1.24-.804c-.446-.173-.955-.29-1.7-.322S9.888.998 7.987 1s-2.14.012-2.886.048m.083 12.654c-.683-.03-1.053-.143-1.3-.238a2.2 2.2 0 0 1-.806-.522 2.16 2.16 0 0 1-.525-.804c-.096-.247-.212-.617-.244-1.3-.035-.737-.042-.958-.046-2.827-.004-1.87.003-2.09.036-2.828.029-.682.143-1.053.238-1.3.126-.327.277-.56.522-.806a2.16 2.16 0 0 1 .804-.525c.246-.096.616-.211 1.299-.243.738-.035.96-.042 2.828-.047s2.09.003 2.829.036c.682.03 1.053.143 1.3.238.326.126.56.277.805.522.246.245.398.477.525.804.097.246.211.616.244 1.299.035.738.043.96.046 2.828s-.003 2.09-.035 2.828c-.03.682-.143 1.053-.238 1.3a2.2 2.2 0 0 1-.523.806 2.2 2.2 0 0 1-.804.525c-.246.096-.617.211-1.298.244-.739.034-.96.042-2.83.046-1.868.004-2.089-.004-2.827-.036m5.706-9.444a.84.84 0 1 0 1.68-.003.84.84 0 0 0-1.68.003M4.406 8.007a3.594 3.594 0 1 0 7.188-.014 3.594 3.594 0 0 0-7.188.014m1.26-.003a2.333 2.333 0 1 1 4.667-.009 2.333 2.333 0 0 1-4.666.01'
    />
  </svg>,
);
