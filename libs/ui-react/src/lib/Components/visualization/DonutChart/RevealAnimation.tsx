import type { ReactNode } from 'react';

const REVEAL_CSS = `
  @property --donut-reveal {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 100%;
  }
  @keyframes donut-reveal {
    from { --donut-reveal: 0%; }
    to { --donut-reveal: 100%; }
  }
  @media (prefers-reduced-motion: no-preference) {
    .donut-ring-reveal {
      mask-image: conic-gradient(from 0deg, black var(--donut-reveal), transparent var(--donut-reveal));
      -webkit-mask-image: conic-gradient(from 0deg, black var(--donut-reveal), transparent var(--donut-reveal));
      animation: donut-reveal 1000ms ease-out forwards;
    }
  }
`;

type RevealAnimationProps = { children: ReactNode };

export const RevealAnimation = ({ children }: RevealAnimationProps) => (
  // eslint-disable-next-line better-tailwindcss/no-unknown-classes
  <div className='donut-ring-reveal'>
    <style>{REVEAL_CSS}</style>
    {children}
  </div>
);
