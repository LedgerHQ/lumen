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
import {
  ChevronRight,
  InformationFill,
  Settings,
} from '@ledgerhq/lumen-ui-rnative/symbols';

export default function Tiles() {
  return (
    <Box lx={{ width: 'full', alignItems: 'center', gap: 's8' }}>
      <Box lx={{ flexDirection: 'row', gap: 's8', alignItems: 'stretch' }}>
        <Tile lx={{ width: 's112' }}>
          <Spot icon={Settings} />
          <TileContent>
            <TileTitle>Tile 1</TileTitle>
            <TileDescription>Tile description</TileDescription>
            <TileTrailingContent>
              <Tag label='Tag' appearance='accent' />
            </TileTrailingContent>
          </TileContent>
        </Tile>
        <Tile lx={{ width: 's112' }}>
          <Spot icon={Settings} />
          <TileContent>
            <TileTitle>Tile 2</TileTitle>
            <TileDescription>Tile description</TileDescription>
            <TileTrailingContent>
              <Tag label='Tag' appearance='accent' />
            </TileTrailingContent>
          </TileContent>
        </Tile>
        <Tile lx={{ width: 's112' }} verticalAlignment='center'>
          <Spot icon={ChevronRight} />
          <TileContent>
            <TileTitle>See more</TileTitle>
          </TileContent>
        </Tile>
      </Box>

      <Box lx={{ flexDirection: 'row', gap: 's8', alignItems: 'stretch' }}>
        <Tile
          appearance='card'
          lx={{ width: 's112' }}
          horizontalAlignment='start'
        >
          <Spot icon={Settings} />
          <TileContent>
            <TileTitle>Start</TileTitle>
            <TileDescription>Tile description</TileDescription>
            <TileTrailingContent>
              <Tag label='Tag' appearance='accent' />
            </TileTrailingContent>
          </TileContent>
        </Tile>
        <Tile appearance='card' lx={{ width: 's112' }}>
          <Spot icon={Settings} />
          <TileContent>
            <TileTitle>Center</TileTitle>
          </TileContent>
        </Tile>
        <Tile
          appearance='card'
          lx={{ width: 's112' }}
          horizontalAlignment='start'
          verticalAlignment='center'
        >
          <Spot icon={ChevronRight} />
          <TileContent>
            <TileTitle>Start, centered</TileTitle>
          </TileContent>
        </Tile>
      </Box>

      <Tile appearance='card' horizontalAlignment='start'>
        <Spot appearance='muted' icon={InformationFill} />
        <TileContent>
          <TileTitle>Full-width tile aligned to the start</TileTitle>
          <TileDescription>
            Title, description and trailing content follow the tile alignment.
          </TileDescription>
          <TileTrailingContent>
            <Tag label='Tag' appearance='base' />
          </TileTrailingContent>
        </TileContent>
      </Tile>

      <Tile>
        <Spot appearance='muted' icon={InformationFill} />
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
}
