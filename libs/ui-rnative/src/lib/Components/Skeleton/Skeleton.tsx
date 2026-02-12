import { Pulse } from '../../Animations/Pulse';
import { Box } from '../Utility';
import type { SkeletonProps } from './types';

/** Internal base skeleton element */
const BaseSkeleton = ({ lx, ...props }: SkeletonProps) => {
  return (
    <Box
      lx={{
        borderRadius: 'md',
        backgroundColor: 'mutedTransparent',
        ...lx,
      }}
      {...props}
    />
  );
};
BaseSkeleton.displayName = 'BaseSkeleton';

const ListItemSkeleton = ({ lx, ...props }: SkeletonProps) => {
  return (
    <Box
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
};
ListItemSkeleton.displayName = 'ListItemSkeleton';

const TileSkeleton = ({ lx, ...props }: SkeletonProps) => {
  return (
    <Box
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
};
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
const Skeleton = ({ lx, component, ...props }: SkeletonProps) => {
  /**
   * Check if the component is a valid pre-built variant and return the corresponding component.
   */
  if (component && componentsMap[component]) {
    const Component = componentsMap[component];
    return (
      <Pulse animate>
        <Component {...props} lx={lx} />
      </Pulse>
    );
  }

  return (
    <Pulse animate>
      <BaseSkeleton testID='skeleton' lx={lx} {...props} />
    </Pulse>
  );
};
Skeleton.displayName = 'Skeleton';

export { Skeleton };
