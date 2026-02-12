import { forwardRef, memo } from 'react';
import { View } from 'react-native';
import { Pulse } from '../../Animations/Pulse';
import { Box } from '../Utility';
import type { SkeletonProps } from './types';

type BaseSkeletonProps = SkeletonProps;

/** Internal base skeleton element */
const BaseSkeleton = memo(
  forwardRef<View, BaseSkeletonProps>(({ lx, ...props }, ref) => {
    return (
      <Pulse animate>
        <Box
          ref={ref}
          lx={{
            borderRadius: 'md',
            backgroundColor: 'mutedTransparent',
            ...lx,
          }}
          {...props}
        />
      </Pulse>
    );
  }),
);
BaseSkeleton.displayName = 'BaseSkeleton';

const ListItemSkeleton = memo(
  forwardRef<View, BaseSkeletonProps>(({ lx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        lx={{
          flexDirection: 'row',
          width: 'full',
          alignItems: 'center',
          gap: 's16',
          paddingVertical: 's8',
          ...lx,
        }}
        {...props}
      >
        <BaseSkeleton
          lx={{
            width: 's48',
            height: 's48',
            borderRadius: 'full',
            flexShrink: 0,
          }}
        />
        <Box lx={{ flex: 1, flexDirection: 'column', gap: 's10' }}>
          <BaseSkeleton
            lx={{ height: 's12', width: 's176', borderRadius: 'full' }}
          />
          <BaseSkeleton
            lx={{ height: 's12', width: 's112', borderRadius: 'full' }}
          />
        </Box>
      </Box>
    );
  }),
);
ListItemSkeleton.displayName = 'ListItemSkeleton';

const TileSkeleton = memo(
  forwardRef<View, BaseSkeletonProps>(({ lx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        lx={{
          flexDirection: 'column',
          width: 's112',
          alignItems: 'center',
          gap: 's12',
          borderRadius: 'md',
          paddingHorizontal: 's8',
          paddingVertical: 's16',
          ...lx,
        }}
        {...props}
      >
        <BaseSkeleton
          lx={{
            width: 's48',
            height: 's48',
            borderRadius: 'full',
            flexShrink: 0,
          }}
        />
        <Box
          lx={{
            width: 'full',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 's8',
          }}
        >
          <BaseSkeleton
            lx={{ height: 's12', width: 's48', borderRadius: 'full' }}
          />
          <BaseSkeleton
            lx={{ height: 's12', width: 's64', borderRadius: 'full' }}
          />
        </Box>
      </Box>
    );
  }),
);
TileSkeleton.displayName = 'TileSkeleton';

const componentsMap = {
  'list-item': ListItemSkeleton,
  tile: TileSkeleton,
};

/**
 * A skeleton component that displays a pulsing placeholder for loading content.
 *
 * @example
 * <Skeleton lx={{ height: 's16', width: 's256' }} />
 *
 * @example
 * // List item variant
 * <Skeleton component='list-item' lx={{ width: 's320' }} />
 *
 * @example
 * // Tile variant
 * <Skeleton component='tile' />
 */
const Skeleton = memo(
  forwardRef<View, SkeletonProps>(({ lx, component, ...props }, ref) => {
    /**
     * Check if the component is a valid pre-built variant and return the corresponding component.
     */
    if (component && componentsMap[component]) {
      const Component = componentsMap[component];
      return <Component {...props} ref={ref} lx={lx} />;
    }

    return <BaseSkeleton ref={ref} testID='skeleton' lx={lx} {...props} />;
  }),
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
