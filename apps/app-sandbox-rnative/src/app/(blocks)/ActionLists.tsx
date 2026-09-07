import {
  ActionList,
  ActionListItem,
  Box,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetView,
  Text,
  useBottomSheetRef,
  Button,
} from '@ledgerhq/lumen-ui-rnative';
import { Devices, Trash, Unlink } from '@ledgerhq/lumen-ui-rnative/symbols';

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    typography='body3'
    lx={{
      color: 'muted',
      marginTop: 's16',
      marginBottom: 's4',
    }}
  >
    {children}
  </Text>
);

export default function ActionLists() {
  const ref = useBottomSheetRef();

  return (
    <Box lx={{ width: 'full', gap: 's8' }}>
      <SectionLabel>Standalone list</SectionLabel>
      <ActionList>
        <ActionListItem icon={Unlink} label='Unlink' onPress={() => ''} />
        <ActionListItem
          icon={Trash}
          label='Remove'
          appearance='destructive'
          onPress={() => ''}
        />
      </ActionList>

      <SectionLabel>Disabled items</SectionLabel>
      <ActionList>
        <ActionListItem
          icon={Unlink}
          label='Unlink'
          disabled
          onPress={() => ''}
        />
        <ActionListItem
          icon={Trash}
          label='Remove'
          appearance='destructive'
          disabled
          onPress={() => ''}
        />
      </ActionList>

      <SectionLabel>Inside BottomSheet</SectionLabel>
      <Box lx={{ alignItems: 'flex-start' }}>
        <Button
          icon={Devices}
          appearance='transparent'
          onPress={() => ref.current?.present()}
        >
          Open device settings
        </Button>
      </Box>

      <BottomSheet ref={ref} enableDynamicSizing snapPoints={null}>
        <BottomSheetView>
          <BottomSheetHeader />
          <Box lx={{ paddingBottom: 's16' }}>
            <ActionList>
              <ActionListItem
                icon={Unlink}
                label='Unlink'
                onPress={() => {
                  ref.current?.dismiss();
                }}
              />
              <ActionListItem
                icon={Trash}
                label='Remove'
                appearance='destructive'
                onPress={() => {
                  ref.current?.dismiss();
                }}
              />
            </ActionList>
          </Box>
        </BottomSheetView>
      </BottomSheet>
    </Box>
  );
}
