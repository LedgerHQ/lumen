import { cn } from '@ledgerhq/lumen-utils-shared';

type DoVsDontRowProps = {
  children: React.ReactNode;
  className?: string;
};

export const DoVsDontRow: React.FC<DoVsDontRowProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-16', className)}>
      <div className='-mb-16! grid grid-cols-1 gap-16 md:grid-cols-2'>
        {children}
      </div>
    </div>
  );
};
