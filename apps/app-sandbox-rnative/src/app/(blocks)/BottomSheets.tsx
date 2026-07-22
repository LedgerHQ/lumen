import type {
  BottomSheetBackgroundProps,
  BottomSheetProps,
} from '@ledgerhq/lumen-ui-rnative';
import {
  BottomSheet,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetScrollView,
  BottomSheetView,
  Box,
  Button,
  LinearGradient,
  Text,
  useBottomSheetRef,
} from '@ledgerhq/lumen-ui-rnative';

const BottomSheetFlatLists = ({ ref, ...props }: BottomSheetProps) => {
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i.toString(),
    title: `Item ${i + 1}`,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  }));
  type Data = (typeof data)[number];

  return (
    <BottomSheet
      {...props}
      ref={ref}
      backdropPressBehavior='close'
      snapPoints={['25%', '50%', '90%']}
    >
      <BottomSheetHeader
        spacing
        title='Virtual List'
        density='expanded'
        description='This bottom sheet contains a virtualized list'
      />
      <BottomSheetFlatList
        data={data}
        keyExtractor={(item: { id: Pick<Data, 'id'> }) => item.id}
        renderItem={({ item }: { item: Omit<Data, 'id'> }) => {
          return (
            <Box
              lx={{
                flexDirection: 'column',
                gap: 's4',
                borderBottomWidth: 's1',
                borderColor: 'base',
                paddingVertical: 's12',
              }}
            >
              <Text typography='body2SemiBold' lx={{ color: 'base' }}>
                {item.title}
              </Text>
              <Text typography='body3' lx={{ color: 'muted' }}>
                {item.description}
              </Text>
            </Box>
          );
        }}
      />
    </BottomSheet>
  );
};

const GradientBackground = ({
  style,
  pointerEvents,
}: BottomSheetBackgroundProps) => (
  <Box
    pointerEvents={pointerEvents}
    style={style}
    lx={{ backgroundColor: 'canvasSheet' }}
  >
    <LinearGradient
      direction='to-bottom'
      stops={[
        { color: 'accent', opacity: 0.3 },
        { color: 'activeSubtle', opacity: 0 },
      ]}
      style={{
        height: 256,
      }}
    />
  </Box>
);

const BottomSheetWithGradient = ({ ref, ...props }: BottomSheetProps) => {
  return (
    <BottomSheet
      {...props}
      ref={ref}
      snapPoints={null}
      enableDynamicSizing
      maxDynamicContentSize='full'
      backdropPressBehavior='close'
      backgroundComponent={GradientBackground}
    >
      <BottomSheetView>
        <BottomSheetHeader
          title='Gradient reaches the handle'
          density='compact'
          description='Gradient spans the full sheet.'
        />
        <Box lx={{ paddingHorizontal: 's4', gap: 's12' }}>
          <Text typography='body2' lx={{ color: 'base' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non
            eleifend erat. Etiam ac justo luctus massa hendrerit pellentesque.
            Vestibulum a dolor mi. Etiam sollicitudin dui quam, quis ultricies
            turpis efficitur sit amet.
          </Text>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

const BottomSheetDynamicSize = ({ ref, ...props }: BottomSheetProps) => {
  const data = Array.from(
    new Array(20).fill(0).map((_, i) => ({
      id: i.toString(),
      title: `Item ${i}`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    })),
  );

  return (
    <BottomSheet
      {...props}
      ref={ref}
      snapPoints={null}
      enableDynamicSizing
      maxDynamicContentSize='full'
      backdropPressBehavior='close'
    >
      <BottomSheetHeader
        spacing
        title='Dynamic Sizing'
        density='compact'
        description='This bottom sheet adapts to its content height'
      />
      <BottomSheetScrollView>
        <Box lx={{ flexDirection: 'column', gap: 's12' }}>
          {data.map((item) => (
            <Box
              key={item.id}
              lx={{
                flexDirection: 'column',
                gap: 's4',
                borderBottomWidth: 's1',
                borderColor: 'base',
                paddingVertical: 's12',
              }}
            >
              <Text typography='body2SemiBold' lx={{ color: 'base' }}>
                {item.title}
              </Text>
              <Text typography='body3' lx={{ color: 'muted' }}>
                {item.description}
              </Text>
            </Box>
          ))}
        </Box>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const BottomSheetWithFooter = ({ ref, ...props }: BottomSheetProps) => {
  return (
    <BottomSheet
      {...props}
      ref={ref}
      snapPoints={['40%']}
      maxDynamicContentSize='full'
      backdropPressBehavior='close'
      footerComponent={(props) => (
        <BottomSheetFooter {...props}>
          <Button appearance='base'>Confirm</Button>
          <Button appearance='no-background'>Cancel</Button>
        </BottomSheetFooter>
      )}
    >
      <BottomSheetView>
        <BottomSheetHeader
          title='With footer'
          density='compact'
          description='This bottom sheet has a sticky footer'
        />
        <Box lx={{ paddingHorizontal: 's16' }}>
          <Text typography='body2' lx={{ color: 'base' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non
            eleifend erat. Etiam ac justo luctus massa hendrerit pellentesque.
            Vestibulum a dolor mi. Etiam sollicitudin dui quam, quis ultricies
            turpis efficitur sit amet.
          </Text>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default function BottomSheets() {
  const flatListsRef = useBottomSheetRef();
  const dynamicSizeRef = useBottomSheetRef();
  const gradientRef = useBottomSheetRef();
  const withFooterRef = useBottomSheetRef();

  return (
    <>
      <Button appearance='base' onPress={() => flatListsRef.current?.present()}>
        Open
      </Button>
      <Button
        appearance='base'
        onPress={() => dynamicSizeRef.current?.present()}
      >
        Open
      </Button>
      <Button appearance='base' onPress={() => gradientRef.current?.present()}>
        Open
      </Button>
      <Button
        appearance='base'
        onPress={() => withFooterRef.current?.present()}
      >
        Open
      </Button>
      <BottomSheetFlatLists ref={flatListsRef} />
      <BottomSheetDynamicSize ref={dynamicSizeRef} />
      <BottomSheetWithGradient ref={gradientRef} />
      <BottomSheetWithFooter ref={withFooterRef} />
    </>
  );
}
