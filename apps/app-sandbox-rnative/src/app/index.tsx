import { Box, SearchInput, TileButton } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { Eye } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { blocks } from '../blocks';

export default function SandboxScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();

  const filteredBlocks = search
    ? blocks.filter((block) =>
        block.title.toLowerCase().includes(normalizedSearch),
      )
    : blocks;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg.canvas }}>
      <Box
        lx={{
          backgroundColor: 'canvas',
          paddingHorizontal: 's16',
          paddingBottom: 's16',
        }}
      >
        <SearchInput value={search} onChangeText={setSearch} />
      </Box>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: theme.spacings.s8,
        }}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        <Box
          lx={{
            paddingHorizontal: 's8',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 's8',
          }}
        >
          {filteredBlocks.map(({ slug, title }) => (
            <TileButton
              key={slug}
              icon={Eye}
              lx={{ flexGrow: 1 }}
              onPress={() => router.push(`/${slug}`)}
            >
              {title}
            </TileButton>
          ))}
        </Box>
      </ScrollView>
    </View>
  );
}
