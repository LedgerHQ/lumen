import {
  SectionHeader,
  SectionHeaderLeading,
  SectionHeaderTitle,
} from '@ledgerhq/lumen-ui-rnative';
import { Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
import { View } from 'react-native';

export default function SectionHeaders() {
  return (
    <View style={{ gap: 24 }}>
      <SectionHeader>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>

      <SectionHeader appearance='card'>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>

      <SectionHeader appearance='card'>
        <SectionHeaderLeading>
          <Settings size={16} />
        </SectionHeaderLeading>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>
    </View>
  );
}
