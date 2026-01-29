import React from 'react';
import {
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarTitle,
  NavBarTrailing,
} from './NavBar';
import { IconButton } from '../IconButton';
import figma from '@figma/code-connect';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onBack = () => {};

figma.connect(
  NavBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=1426-4697',
  {
    imports: [
      "import { NavBar, NavBarBackButton, NavBarTitle, NavBarTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { IconButton } from '@ledgerhq/lumen-ui-react'",
      "// import { YourIconName } from '@ledgerhq/lumen-ui-react/symbols'",
    ],
    props: {
      showBackButton: figma.boolean('show-back-button', {
        true: true,
        false: false,
      }),
      title: figma.string('title'),
      showCoinCapsule: figma.boolean('show-coin-capsule', {
        true: true,
        false: false,
      }),
      coinTicker: figma.string('ticker'),
      trailingIcon: figma.instance('trailing-icon'),
      showTrailing: figma.boolean('show-trailing', {
        true: true,
        false: false,
      }),
    },
    links: [
      {
        name: 'Documentation',
        url: 'https://ldls.vercel.app/?path=/docs/navigation-navbar--docs',
      },
    ],
    example: (props) => (
      <NavBar>
        {props.showBackButton && <NavBarBackButton onClick={onBack} />}
        {props.showCoinCapsule ? (
          <NavBarCoinCapsule
            ticker={props.coinTicker}
            icon={/* CryptoIcon component */ null}
          />
        ) : (
          <NavBarTitle>{props.title}</NavBarTitle>
        )}
        {props.showTrailing && (
          <NavBarTrailing>
            <IconButton
              appearance='gray'
              size='sm'
              icon={props.trailingIcon}
              aria-label='Action'
            />
          </NavBarTrailing>
        )}
      </NavBar>
    ),
  },
);
