export const SetupNote = () => {
  return (
    <blockquote>
      <strong>Note</strong>:{' '}
      <code style={{ fontSize: 'inherit' }}>@ledgerhq/lumen-design-core</code>{' '}
      and other peer dependencies (
      <code style={{ fontSize: 'inherit' }}>react</code>,{' '}
      <code style={{ fontSize: 'inherit' }}>tailwindcss</code>,{' '}
      <code style={{ fontSize: 'inherit' }}>clsx</code>, etc.) are required. See
      our{' '}
      <a href='?path=/docs/getting-started-setup-tailwind--docs#1-tailwind-config'>
        Setup Guide →
      </a>{' '}
      for complete installation and Tailwind configuration.
    </blockquote>
  );
};
