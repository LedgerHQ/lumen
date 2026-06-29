import figma from '@figma/code-connect';
import CryptoIcon from '@ledgerhq/crypto-icons/native';
import { Placeholder, Settings } from '../../Symbols';
import { Spot } from '../Spot';
import { Tag } from '../Tag';
import { Trend } from '../Trend';
import {
  Tile,
  TileContent,
  TileDescription,
  TileTitle,
  TileTrailingContent,
} from './Tile';

const sharedProps = {
  title: figma.string('title'),
  description: figma.boolean('show-description', {
    true: figma.boolean('show-network', {
      true: (
        <TileDescription>
          Description <CryptoIcon ledgerId='ethereum' ticker='ETH' size={20} />
        </TileDescription>
      ),
      false: <TileDescription>Description</TileDescription>,
    }),
    false: undefined,
  }),
  appearance: figma.enum('appearance', {
    'no-background': 'no-background',
    card: 'card',
  }),
  disabled: figma.enum('state', {
    disabled: true,
  }),
  leadingContent: figma.enum('leading-icon', {
    coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={48} />,
    spot: <Spot appearance='icon' icon={Settings} />,
    'interface-icon': <Placeholder size={24} />,
  }),
};

const sharedImports = [
  "import { Tile, Spot, TileContent, TileTitle, TileDescription, TileTrailingContent } from '@ledgerhq/lumen-ui-rnative'",
  "import { Tag } from '@ledgerhq/lumen-ui-rnative'",
  "import { Text } from '@ledgerhq/lumen-ui-rnative'",
  "import { Placeholder, Settings } from '@ledgerhq/lumen-ui-rnative/symbols'",
  "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
];

figma.connect(
  Tile,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=5783-1328',
  {
    imports: sharedImports,
    variant: { 'show-additionnal-content': false },
    props: sharedProps,
    example: (props) => (
      <Tile
        appearance={props.appearance}
        disabled={props.disabled}
        onPress={() => {}}
      >
        {props.leadingContent}
        <TileContent>
          <TileTitle>{props.title}</TileTitle>
          {props.description}
        </TileContent>
      </Tile>
    ),
  },
);

figma.connect(
  Tile,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=5783-1328',
  {
    imports: sharedImports,
    variant: { 'show-additionnal-content': true },
    props: {
      ...sharedProps,
      tag: figma.boolean('show-tag', {
        true: <Tag label='Label' appearance='base' />,
        false: undefined,
      }),
      subInfo: figma.boolean('show-sub-info', {
        true: <Tag icon={Settings} label='Label' appearance='base' />,
        false: undefined,
      }),
      trend: figma.boolean('show-trend', {
        true: <Trend value={7.87} size='sm' />,
        false: undefined,
      }),
    },
    example: (props) => (
      <Tile
        appearance={props.appearance}
        disabled={props.disabled}
        onPress={() => {}}
      >
        {props.leadingContent}
        <TileContent>
          <TileTitle>{props.title}</TileTitle>
          {props.description}
          <TileTrailingContent>
            {props.tag}
            {props.subInfo}
            {props.trend}
          </TileTrailingContent>
        </TileContent>
      </Tile>
    ),
  },
);
