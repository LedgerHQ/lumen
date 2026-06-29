import figma from '@figma/code-connect';
import { CryptoIcon } from '@ledgerhq/crypto-icons';
import { Settings } from '../../Symbols';
import { IconButton } from '../IconButton';
import { TileDescription } from '../Tile';
import {
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarTitle,
  NavBarTrailing,
} from './NavBar';

figma.connect(
  NavBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=1426-4697',
  {
    imports: [
      "import { NavBar, NavBarBackButton, NavBarCoinCapsule, NavBarTitle, NavBarTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { IconButton } from '@ledgerhq/lumen-ui-react'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Settings } from '@ledgerhq/lumen-ui-react/symbols'",
    ],
    props: {
      backButton: figma.boolean('show-back', {
        true: <NavBarBackButton onClick={() => {}} />,
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
            <IconButton
              appearance='gray'
              size='sm'
              icon={Settings}
              aria-label='Action'
            />
          </NavBarTrailing>
        ),
        false: undefined,
      }),
      secondaryTrailing: figma.boolean('show-second-trailing-icon', {
        true: (
          <NavBarTrailing>
            <IconButton
              appearance='gray'
              size='sm'
              icon={Settings}
              aria-label='Action'
            />
          </NavBarTrailing>
        ),
        false: undefined,
      }),
    },
    example: (props) => (
      <NavBar>
        {props.backButton}
        {props.coinCapsule}
        {props.title}
        {props.description}
        {props.trailing}
        {props.secondaryTrailing}
      </NavBar>
    ),
  },
);
