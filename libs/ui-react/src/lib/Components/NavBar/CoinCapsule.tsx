import { cn } from '@ledgerhq/lumen-utils-shared';
import type { CoinCapsuleProps } from './types';

/**
 * @internal
 * Internal component for displaying a cryptocurrency coin capsule with icon and ticker.
 * This component is not exported publicly. Use NavBarCoinCapsule instead for NavBar usage.
 * Kept as a separate component for potential future extraction as a standalone component.
 */
export const CoinCapsule = ({
  ref,
  ticker,
  leadingContent,
  className,
}: CoinCapsuleProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-8 rounded-full bg-muted-transparent p-8 pr-12',
        className,
      )}
      data-slot='coin-capsule'
    >
      <span className='flex size-24 shrink-0 items-center justify-center'>
        {leadingContent}
      </span>
      <span className='body-1 text-base select-none'>{ticker}</span>
    </div>
  );
};
