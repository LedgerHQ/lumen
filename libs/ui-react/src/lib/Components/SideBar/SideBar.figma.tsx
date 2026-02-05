import React from 'react';
import {
  SideBar,
  SideBarLeading,
  SideBarTrailing,
  SideBarItem,
  SideBarCollapseToggle,
} from './SideBar';
import {
  Home,
  HomeFill,
  Wallet,
  SettingsAlt,
  SettingsAlt2,
} from '../../Symbols';

import figma from '@figma/code-connect';

figma.connect(
  SideBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=10860-398',
  {
    imports: [
      "import { SideBar, SideBarLeading, SideBarTrailing, SideBarItem, SideBarCollapseToggle } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      appearance: figma.enum('appearance', {
        compact: true,
        expanded: false,
      }),
    },

    example: (props) => (
      <SideBar collapsed={props.appearance} active='home'>
        <SideBarLeading>
          <SideBarItem
            value='home'
            icon={Home}
            activeIcon={HomeFill}
            label='Home'
          />
          <SideBarItem
            value='wallet'
            icon={Wallet}
            activeIcon={Wallet}
            label='Wallet'
          />
        </SideBarLeading>
        <SideBarTrailing>
          <SideBarItem
            value='settings'
            icon={SettingsAlt}
            activeIcon={SettingsAlt2}
            label='Settings'
          />
          <SideBarCollapseToggle />
        </SideBarTrailing>
      </SideBar>
    ),
  },
);
