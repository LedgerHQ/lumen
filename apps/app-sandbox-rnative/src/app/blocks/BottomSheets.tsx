import type { BottomSheetProps } from '@ledgerhq/lumen-ui-rnative';
import {
  BottomSheet,
  BottomSheetHeader,
  Box,
  Button,
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetView,
  Text,
} from '@ledgerhq/lumen-ui-rnative';

export const BottomSheetsButton = ({ onPress }: any) => {
  return (
    <Button appearance='base' onPress={onPress}>
      Open
    </Button>
  );
};

export const BottomSheetFlatLists = ({ ref, ...props }: BottomSheetProps) => {
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i.toString(),
    title: `Item ${i + 1}`,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  }));

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
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => {
          const typedItem = item as any;
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
                {typedItem.title}
              </Text>
              <Text typography='body3' lx={{ color: 'muted' }}>
                {typedItem.description}
              </Text>
            </Box>
          );
        }}
      />
    </BottomSheet>
  );
};

export const BottomSheetDynamicSize = ({ ref, ...props }: BottomSheetProps) => {
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
      <BottomSheetView>
        <BottomSheetHeader
          title='Dynamic Sizing'
          density='compact'
          description='This bottom sheet adapts to its content height'
        />
      </BottomSheetView>
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
