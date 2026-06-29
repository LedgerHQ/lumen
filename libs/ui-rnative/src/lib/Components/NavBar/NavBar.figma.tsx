import figma from '@figma/code-connect';
import CryptoIcon from '@ledgerhq/crypto-icons/native';
import {
  IconButton,
  NavBarCoinCapsule,
  NavBarTrailing,
  TileDescription,
} from '@ledgerhq/lumen-ui-rnative';
import { Settings } from '../../Symbols';
import { NavBar, NavBarBackButton, NavBarContent, NavBarTitle } from './NavBar';

figma.connect(
  NavBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=1426-4697',
  {
    imports: [
      "import { NavBar, NavBarBackButton, NavBarContent, NavBarTitle } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      density: figma.enum('density', {
        compact: 'compact',
        expanded: 'expanded',
      }),
      backButton: figma.boolean('show-back', {
        true: <NavBarBackButton onPress={() => {}} />,
        false: undefined,
      }),
      title: figma.boolean('show-title', {
        true: <NavBarTitle>Title</NavBarTitle>,
        false: undefined,
      }),
      description: figma.boolean('show-description', {
        true: figma.boolean('show-network', {
          true: (
            <TileDescription>
              Description{' '}
              <CryptoIcon ledgerId='ethereum' ticker='ETH' size={20} />
            </TileDescription>
          ),
          false: <TileDescription>Description</TileDescription>,
        }),
        false: undefined,
      }),
      coinCapsule: figma.enum('content', {
        asset: (
          <NavBarCoinCapsule
            ticker='Bitcoin'
            leadingContent={
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />
            }
          />
        ),
      }),
      trailing: figma.boolean('show-trailing-icon', {
        true: (
          <NavBarTrailing>
            <IconButton icon={Settings} accessibilityLabel='Settings' />
          </NavBarTrailing>
        ),
        false: undefined,
      }),
      secondaryTrailing: figma.boolean('show-second-trailing-icon', {
        true: (
          <NavBarTrailing>
            <IconButton icon={Settings} accessibilityLabel='Settings' />
          </NavBarTrailing>
        ),
        false: undefined,
      }),
    },
    example: (props) => (
      <NavBar density={props.density}>
        {props.backButton}
        <NavBarContent>
          {props.title}
          {props.description}
        </NavBarContent>
        {props.coinCapsule}
        {props.trailing}
        {props.secondaryTrailing}
      </NavBar>
    ),
  },
);
