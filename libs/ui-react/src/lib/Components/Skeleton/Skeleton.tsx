import { cn } from '@ledgerhq/lumen-utils-shared';

import { forwardRef } from 'react';
import type { SkeletonProps } from './types';

type BaseSkeletonProps = React.ComponentProps<'div'>;

/** Internal base skeleton element */
const BaseSkeleton = forwardRef<HTMLDivElement, BaseSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-muted-transparent',
          className,
        )}
        {...props}
      />
    );
  },
);
BaseSkeleton.displayName = 'BaseSkeleton';

const ListItemSkeleton = forwardRef<HTMLDivElement, BaseSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='skeleton'
        className={cn('flex w-full items-center gap-16 py-8', className)}
        {...props}
      >
        <BaseSkeleton className='size-48 shrink-0 rounded-full' />
        <div className='flex flex-1 flex-col gap-10'>
          <BaseSkeleton className='h-12 w-176 rounded-full' />
          <BaseSkeleton className='h-12 w-112 rounded-full' />
        </div>
      </div>
    );
  },
);
ListItemSkeleton.displayName = 'ListItemSkeleton';

const TileSkeleton = forwardRef<HTMLDivElement, BaseSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='skeleton'
        className={cn(
          'flex w-112 flex-col items-center gap-12 rounded-md px-8 py-16',
          className,
        )}
        {...props}
      >
        <BaseSkeleton className='size-48 shrink-0 rounded-full' />
        <div className='flex w-full flex-col items-center gap-8'>
          <BaseSkeleton className='h-12 w-48 rounded-full' />
          <BaseSkeleton className='h-12 w-64 rounded-full' />
        </div>
      </div>
    );
  },
);
TileSkeleton.displayName = 'TileSkeleton';

const TableSkeleton = forwardRef<HTMLDivElement, BaseSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot='skeleton'
        className={cn('flex w-full flex-col', className)}
        {...props}
      >
        <div className='flex h-40 w-full items-center'>
          <BaseSkeleton className='h-12 w-full' />
        </div>
        <div className='flex h-64 items-center gap-14 opacity-90'>
          <BaseSkeleton className='size-40 rounded-full' />
          <div className='grow'>
            <BaseSkeleton className='h-12 w-11/12' />
          </div>
        </div>
        <div className='flex h-64 items-center gap-14 opacity-80'>
          <BaseSkeleton className='size-40 rounded-full' />
          <div className='grow'>
            <BaseSkeleton className='h-12 w-10/12' />
          </div>
        </div>
        <div className='flex h-64 items-center gap-14 opacity-70'>
          <BaseSkeleton className='size-40 rounded-full' />
          <div className='grow'>
            <BaseSkeleton className='h-12 w-9/12' />
          </div>
        </div>
      </div>
    );
  },
);

const componentsMap = {
  'list-item': ListItemSkeleton,
  tile: TileSkeleton,
  table: TableSkeleton,
};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, component, ...props }, ref) => {
    /**
     * Check if the component is a valid pre-built variant and return the corresponding component.
     */
    if (component && componentsMap[component]) {
      const Component = componentsMap[component];
      return <Component {...props} ref={ref} className={className} />;
    }

    return (
      <BaseSkeleton
        ref={ref}
        data-testid='skeleton'
        className={className}
        data-slot='skeleton'
        {...props}
      />
    );
  },
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
