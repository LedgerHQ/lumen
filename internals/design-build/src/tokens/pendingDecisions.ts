type PendingDecision = {
  /** Path in the generated React Native theme. */
  path: string[];
  /** What React Native ships today, kept until design decides. */
  value: string | number;
  reason: string;
};

/**
 * Where React Native deliberately keeps a value that differs from the token,
 * because changing it is a visible change waiting for a design decision. Each
 * entry is a known web/mobile drift: delete it once design has decided, and
 * the theme follows the token. The CSS/JS parity test allows exactly these.
 */
export const REACT_NATIVE_PENDING_DECISIONS: PendingDecision[] = [
  {
    path: ['blur', 'lg'],
    value: 64,
    reason:
      'Figma `backdrop-blur.lg` is 16 (the web value); the RN TabBar uses 64 (DLS-1181).',
  },
  {
    path: ['shadows', '2xl', '0', 'color'],
    value: '#00000033',
    reason:
      '`shadow-2xl` is 25% black on web and 20% on React Native (DLS-1181).',
  },
];
