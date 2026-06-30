import type { FC, ReactNode } from 'react';

type SetupNoteProps = {
  children?: ReactNode;
};

export const SetupNote: FC<SetupNoteProps> = ({ children }) => {
  return (
    <blockquote>
      <strong>Note</strong>: <code>@ledgerhq/lumen-design-core</code> and other
      peer dependencies (<code>react</code>, <code>tailwindcss</code>,{' '}
      <code>clsx</code>, etc.) are required. See our{' '}
      <a href='?path=/docs/getting-started-setup-tailwind--docs#1-tailwind-config'>
        Setup Guide →
      </a>{' '}
      for complete installation and Tailwind configuration.
      {children}
    </blockquote>
  );
};
