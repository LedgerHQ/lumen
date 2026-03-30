import { cn } from '@ledgerhq/lumen-utils-shared';

type ComponentCardProps = {
  title: string;
  description: string;
  href: string;
  emoji?: string;
  className?: string;
};

export const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  description,
  href,
  emoji,
  className,
}) => {
  const handleClick = () => {
    // Navigate using window.parent to escape iframe context
    if (window.parent && window.parent !== window) {
      window.parent.location.href =
        window.parent.location.origin + window.parent.location.pathname + href;
    } else {
      window.location.href = href;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group relative flex flex-col gap-16 overflow-hidden rounded-md border-2 border-[#F4F4F4] px-8 pt-8 transition-all duration-200',
        'hover:-translate-y-1 hover:border-[#B380DD] hover:shadow-lg',
        'cursor-pointer',
        className,
      )}
    >
      {/* Content area */}
      <div className='flex flex-1 flex-col items-center justify-between'>
        <div>
          <h4 className='mb-0! block cursor-pointer! heading-4 text-base group-hover:text-[#B380DD] md:hidden'>
            {emoji && <div>{emoji}</div>}
            {title}
          </h4>
          <h3 className='mb-0! hidden cursor-pointer! heading-4 text-base group-hover:text-[#B380DD] md:block'>
            {emoji && <div>{emoji}</div>}
            {title}
          </h3>
          <p className='line-clamp-2 hidden body-3 text-muted md:block'>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

type ComponentCardGridProps = {
  children: React.ReactNode;
  className?: string;
};

export const ComponentCardGrid: React.FC<ComponentCardGridProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-2 gap-8 lg:grid-cols-3', className)}>
      {children}
    </div>
  );
};
