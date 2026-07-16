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

      <SectionHeader appearance='plain'>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>

      <SectionHeader appearance='plain'>
        <SectionHeaderLeading>
          <Settings size={16} />
        </SectionHeaderLeading>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>

      <SectionHeader appearance='plain'>
        <SectionHeaderLeading>
          <Settings size={16} />
        </SectionHeaderLeading>
        <SectionHeaderTitle>
          Very long section header label that should truncate with an ellipsis
        </SectionHeaderTitle>
      </SectionHeader>
    </View>
  );
}
