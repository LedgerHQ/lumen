import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetView,
  Box,
  Button,
  MenuList,
  MenuListItem,
  Text,
  useBottomSheetRef,
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

export default function MenuLists() {
  const ref = useBottomSheetRef();

  return (
    <Box lx={{ width: 'full', gap: 's8' }}>
      <SectionLabel>Standalone list</SectionLabel>
      <MenuList>
        <MenuListItem icon={Unlink} label='Unlink' onPress={() => ''} />
        <MenuListItem
          icon={Trash}
          label='Remove'
          appearance='destructive'
          onPress={() => ''}
        />
      </MenuList>

      <SectionLabel>Disabled items</SectionLabel>
      <MenuList>
        <MenuListItem
          icon={Unlink}
          label='Unlink'
          disabled
          onPress={() => ''}
        />
        <MenuListItem
          icon={Trash}
          label='Remove'
          appearance='destructive'
          disabled
          onPress={() => ''}
        />
      </MenuList>

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
            <MenuList>
              <MenuListItem
                icon={Unlink}
                label='Unlink'
                onPress={() => {
                  ref.current?.dismiss();
                }}
              />
              <MenuListItem
                icon={Trash}
                label='Remove'
                appearance='destructive'
                onPress={() => {
                  ref.current?.dismiss();
                }}
              />
            </MenuList>
          </Box>
        </BottomSheetView>
      </BottomSheet>
    </Box>
  );
}
