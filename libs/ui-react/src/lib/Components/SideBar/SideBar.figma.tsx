import React from 'react';
import {
  SideBar,
  SideBarLeading,
  SideBarTrailing,
  SideBarItem,
} from './SideBar';
import {
  Home,
  HomeFill,
  Wallet,
  SettingsAlt,
  SettingsAlt2,
} from '../../Symbols';

import figma from '@figma/code-connect';

// SideBar root component
figma.connect(
  SideBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=10860-398',
  {
    imports: [
      "import { SideBar, SideBarLeading, SideBarTrailing, SideBarItem } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      appearance: figma.enum('appearance', {
        compact: true,
        expanded: false,
      }),
    },
    links: [
      {
        name: '*',
        url: 'https://ldls.vercel.app/?path=/docs/navigation-sidebar--docs',
      },
    ],
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
        </SideBarTrailing>
      </SideBar>
    ),
  },
);

// SideBarItem component
figma.connect(
  SideBarItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=10857-283',
  {
    imports: ["import { SideBarItem } from '@ledgerhq/lumen-ui-react'"],
    props: {
      label: figma.string('label'),
      showLabel: figma.boolean('show-label'),
      state: figma.enum('state', {
        enabled: undefined,
        hovered: undefined,
        pressed: undefined,
      }),
    },
    links: [
      {
        name: '*',
        url: 'https://ldls.vercel.app/?path=/docs/navigation-sidebar--docs',
      },
    ],
    example: (props) => (
      <SideBarItem
        value='item'
        icon={Home}
        activeIcon={HomeFill}
        label={props.label}
      />
    ),
  },
);
