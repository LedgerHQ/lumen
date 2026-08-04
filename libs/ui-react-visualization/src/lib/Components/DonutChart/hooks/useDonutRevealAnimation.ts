import { useEffect } from 'react';

const STYLE_ID = 'donut-reveal-animation';

const CSS = `
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
      mask-image: conic-gradient(from -0deg, black var(--donut-reveal), transparent var(--donut-reveal));
      animation: donut-reveal 600ms ease-out forwards;
    }
  }
`;

export function useDonutRevealAnimation() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);
}
