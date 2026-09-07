import {
  ActionList,
  ActionListItem,
  Box,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetView,
  Text,
  useBottomSheetRef,
} from '@ledgerhq/lumen-ui-rnative';
import { Copy, Delete, Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';

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
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <Box lx={{ width: 's320', gap: 's8' }}>
      <SectionLabel>Standalone list</SectionLabel>
      <ActionList>
        <ActionListItem icon={Copy} label='Copy address' onPress={() => ''} />
        <ActionListItem
          icon={Settings}
          label='Manage account'
          onPress={() => ''}
        />
        <ActionListItem
          icon={Delete}
          label='Remove account'
          appearance='destructive'
          onPress={() => ''}
        />
      </ActionList>

      <SectionLabel>With disabled items</SectionLabel>
      <ActionList>
        <ActionListItem icon={Copy} label='Copy address' onPress={() => ''} />
        <ActionListItem
          icon={Settings}
          label='Manage account (disabled)'
          disabled
          onPress={() => ''}
        />
        <ActionListItem
          icon={Delete}
          label='Remove account (disabled)'
          appearance='destructive'
          disabled
          onPress={() => ''}
        />
      </ActionList>

      <SectionLabel>Inside BottomSheet</SectionLabel>
      <Box lx={{ alignItems: 'flex-start' }}>
        <ActionListItem
          icon={Settings}
          label={`Open sheet${lastAction ? ` · last: ${lastAction}` : ''}`}
          onPress={() => ref.current?.present()}
        />
      </Box>

      <BottomSheet ref={ref} enableDynamicSizing snapPoints={null}>
        <BottomSheetHeader title='Account actions' />
        <BottomSheetView>
          <Box lx={{ paddingBottom: 's16' }}>
            <ActionList>
              <ActionListItem
                icon={Copy}
                label='Copy address'
                onPress={() => {
                  setLastAction('copy');
                  ref.current?.dismiss();
                }}
              />
              <ActionListItem
                icon={Settings}
                label='Manage account'
                onPress={() => {
                  setLastAction('manage');
                  ref.current?.dismiss();
                }}
              />
              <ActionListItem
                icon={Delete}
                label='Remove account'
                appearance='destructive'
                onPress={() => {
                  setLastAction('remove');
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
