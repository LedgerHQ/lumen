import { cn } from '@ledgerhq/lumen-utils-shared';

type DoBlockItemProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export const DoBlockItem: React.FC<DoBlockItemProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div
      className={cn('flex flex-col gap-12', className)}
      {...{ 'data-type': 'do-item' }}
    >
      {/* Header */}
      {(title || description) && (
        <div className='-mb-16! flex flex-col gap-4'>
          {title && (
            <div className='flex items-center gap-8'>
              <span className='text-[#10B981]'>✓</span>
              <h4 className='m-0! body-2-semi-bold text-base'>{title}</h4>
            </div>
          )}
          {description && (
            <p className='m-0! body-3 text-muted'>{description}</p>
          )}
        </div>
      )}

      {/* Code Block */}
      <div className='[&>*:first-child_pre]:m-0! [&>*:first-child_pre]:rounded-xs! [&>*:first-child_pre]:border-2! [&>*:first-child_pre]:border-[#10B981]! [&>*:first-child_pre]:bg-[#F0FDF4]!'>
        {children}
      </div>
    </div>
  );
};
