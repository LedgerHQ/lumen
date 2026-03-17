import {
  Box,
  Spot,
  Tag,
  Tile,
  TileContent,
  TileDescription,
  TileTitle,
  TileTrailingContent,
} from '@ledgerhq/lumen-ui-rnative';
import { ChevronRight, Settings } from '@ledgerhq/lumen-ui-rnative/symbols';

export const Tiles = () => {
  return (
    <Box lx={{ width: 'full', alignItems: 'center', gap: 's8' }}>
      <Box lx={{ flexDirection: 'row', gap: 's8', alignItems: 'stretch' }}>
        <Tile lx={{ width: 's112' }}>
          <Spot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Tile 1</TileTitle>
            <TileDescription>Tile description</TileDescription>
            <TileTrailingContent>
              <Tag label='Tag' appearance='accent' />
            </TileTrailingContent>
          </TileContent>
        </Tile>
        <Tile lx={{ width: 's112' }}>
          <Spot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Tile 2</TileTitle>
            <TileDescription>Tile description</TileDescription>
            <TileTrailingContent>
              <Tag label='Tag' appearance='accent' />
            </TileTrailingContent>
          </TileContent>
        </Tile>
        <Tile lx={{ width: 's112' }} centered>
          <Spot appearance='icon' icon={ChevronRight} />
          <TileContent>
            <TileTitle>See more</TileTitle>
          </TileContent>
        </Tile>
      </Box>

      <Tile>
        <Spot appearance='info' />
        <TileContent>
          <TileTitle>
            Long Title that should truncate appropriately and not be break off
          </TileTitle>
          <TileDescription>
            lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, quos.
          </TileDescription>
        </TileContent>
      </Tile>
    </Box>
  );
};
