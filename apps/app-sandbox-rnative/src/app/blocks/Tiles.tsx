import {
  Box,
  Spot,
  Tag,
  Tile,
  TileContent,
  TileDescription,
  TileHeader,
  TileLeading,
  TileTitle,
  TileTrailing,
} from '@ledgerhq/lumen-ui-rnative';
import { ChevronRight, Settings } from '@ledgerhq/lumen-ui-rnative/symbols';

export const Tiles = () => {
  return (
    <Box lx={{ width: 'full', alignItems: 'center', gap: 's8' }}>
      <Box lx={{ flexDirection: 'row', gap: 's8', alignItems: 'stretch' }}>
        <Tile lx={{ width: 's112' }}>
          <TileHeader>
            <TileLeading>
              <Spot appearance='icon' icon={Settings} />
              <TileContent>
                <TileTitle>Tile 1</TileTitle>
                <TileDescription>Tile description</TileDescription>
              </TileContent>
            </TileLeading>
            <TileTrailing>
              <Tag label='Tag' appearance='accent' />
            </TileTrailing>
          </TileHeader>
        </Tile>
        <Tile lx={{ width: 's112' }}>
          <TileHeader>
            <TileLeading>
              <Spot appearance='icon' icon={Settings} />
              <TileContent>
                <TileTitle>Tile 2</TileTitle>
                <TileDescription>Tile description</TileDescription>
              </TileContent>
            </TileLeading>
            <TileTrailing>
              <Tag label='Tag' appearance='accent' />
            </TileTrailing>
          </TileHeader>
        </Tile>
        <Tile lx={{ width: 's112' }} centered>
          <TileHeader>
            <TileLeading>
              <Spot appearance='icon' icon={ChevronRight} />
              <TileContent>
                <TileTitle>See more</TileTitle>
              </TileContent>
            </TileLeading>
          </TileHeader>
        </Tile>
      </Box>

      <Tile>
        <TileHeader>
          <TileLeading>
            <Spot appearance='info' />
            <TileContent>
              <TileTitle>
                Long Title that should truncate appropriately and not be break
                off
              </TileTitle>
              <TileDescription>
                lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam, quos.
              </TileDescription>
            </TileContent>
          </TileLeading>
        </TileHeader>
      </Tile>
    </Box>
  );
};
