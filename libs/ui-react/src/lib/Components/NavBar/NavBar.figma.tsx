import React from 'react';
import {
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarTitle,
  NavBarTrailing,
} from './NavBar';
import { IconButton } from '../IconButton';
import { CryptoIcon } from '@ledgerhq/crypto-icons';

import figma from '@figma/code-connect';
import { Settings } from '../../Symbols';

figma.connect(
  NavBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=1426-4697',
  {
    imports: [
      "import { NavBar, NavBarBackButton, NavBarTitle, NavBarTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { IconButton } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      backButton: figma.boolean('show-back', {
        true: <NavBarBackButton onClick={() => {}} />,
        false: undefined,
      }),
      title: figma.string('title'),
      coinCapsule: figma.enum('appearance', {
        'with-asset':
        <NavBarCoinCapsule
          ticker='Bitcoin'
          icon={<CryptoIcon ledgerId="bitcoin" ticker="BTC" size="24px" />}
        />,
      }),
      trailing: figma.boolean('show-trailing-icon', {
        true:
          <NavBarTrailing>
            <IconButton
              appearance='gray'
              size='sm'
              icon={Settings}
              aria-label='Action'
            />
          </NavBarTrailing>,
        false: undefined,
      }),
    },
    example: (props) => (
      <NavBar>
        {props.backButton}
        {props.coinCapsule}
        <NavBarTitle>
          {props.title}
        </NavBarTitle>
        {props.trailing}
      </NavBar>
    ),
  },
);
