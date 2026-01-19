import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { MoreVertical } from '../../Symbols/Icons/MoreVertical';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuLabel,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuRadioGroup,
  MenuGroup,
} from './Menu';

const meta: Meta<typeof Menu> = {
  title: 'Selection/Menu',
  component: Menu,
  subcomponents: {
    MenuTrigger,
    MenuContent,
    MenuItem,
    MenuCheckboxItem,
    MenuRadioItem,
    MenuLabel,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuRadioGroup,
    MenuGroup,
  },
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const Base: Story = {
  args: {
    open: undefined,
  },
  render: (args) => (
    <Menu {...args}>
      <MenuTrigger asChild>
        <IconButton
          onClick={() => console.log('Menu clicked')}
          icon={MoreVertical}
          aria-label='Open Menu'
          appearance='gray'
        />
      </MenuTrigger>
      <MenuContent className='w-208'>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Billing</MenuItem>
        <MenuItem>Team</MenuItem>
        <MenuItem>Subscription</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithGroups: Story = {
  name: 'With Groups and Labels',
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <IconButton
          icon={MoreVertical}
          aria-label='Open Menu'
          appearance='gray'
        />
      </MenuTrigger>
      <MenuContent className='w-208'>
        <MenuLabel>My Account</MenuLabel>
        <MenuGroup>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuItem>Settings</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuLabel>Team</MenuLabel>
        <MenuGroup>
          <MenuItem>Invite Users</MenuItem>
          <MenuItem>Team Settings</MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => {
    const [showPanel, setShowPanel] = React.useState(false);
    const [showActivityBar, setShowActivityBar] = React.useState(true);
    const [showStatusBar, setShowStatusBar] = React.useState(true);

    return (
      <Menu>
        <MenuTrigger asChild>
          <Button size='md' appearance='gray'>
            View Options
          </Button>
        </MenuTrigger>
        <MenuContent className='w-208'>
          <MenuLabel>Appearance</MenuLabel>
          <MenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
            Show Panel
          </MenuCheckboxItem>
          <MenuCheckboxItem
            checked={showActivityBar}
            onCheckedChange={setShowActivityBar}
          >
            Show Activity Bar
          </MenuCheckboxItem>
          <MenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Show Status Bar
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
    );
  },
};

export const WithRadioItems: Story = {
  render: () => {
    const [position, setPosition] = React.useState('bottom');

    return (
      <Menu>
        <MenuTrigger asChild>
          <Button appearance='gray' size='md'>
            Panel Position
          </Button>
        </MenuTrigger>
        <MenuContent className='w-208'>
          <MenuLabel>Panel Position</MenuLabel>
          <MenuRadioGroup value={position} onValueChange={setPosition}>
            <MenuRadioItem value='top'>Top</MenuRadioItem>
            <MenuRadioItem value='bottom'>Bottom</MenuRadioItem>
            <MenuRadioItem value='right'>Right</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <Button appearance='gray' size='md'>
          Open Menu
        </Button>
      </MenuTrigger>
      <MenuContent className='w-208'>
        <MenuItem>New Tab</MenuItem>
        <MenuItem>New Window</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Share</MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Email</MenuItem>
            <MenuItem>Messages</MenuItem>
            <MenuItem>Notes</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuItem>Print</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const Disabled: Story = {
  name: 'With Disabled Items',
  render: () => (
    <Menu>
      <MenuTrigger asChild>
        <Button appearance='gray' size='md'>
          Open Menu
        </Button>
      </MenuTrigger>
      <MenuContent className='w-208'>
        <MenuItem>New Tab</MenuItem>
        <MenuItem disabled>New Window (disabled)</MenuItem>
        <MenuItem>New Private Window</MenuItem>
        <MenuSeparator />
        <MenuItem disabled>Print... (disabled)</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const PositionShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-16'>
      <Menu>
        <MenuTrigger asChild>
          <Button appearance='gray' size='md'>
            Top
          </Button>
        </MenuTrigger>
        <MenuContent side='top' className='w-48'>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger asChild>
          <Button appearance='gray' size='md'>
            Bottom
          </Button>
        </MenuTrigger>
        <MenuContent side='bottom' className='w-48'>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger asChild>
          <Button appearance='gray' size='md'>
            Left
          </Button>
        </MenuTrigger>
        <MenuContent side='left' className='w-48'>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger asChild>
          <Button appearance='gray' size='md'>
            Right
          </Button>
        </MenuTrigger>
        <MenuContent side='right' className='w-48'>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};

export const CompleteExample: Story = {
  render: () => {
    const [showPanel, setShowPanel] = React.useState(false);
    const [showActivityBar, setShowActivityBar] = React.useState(true);
    const [position, setPosition] = React.useState('bottom');

    return (
      <Menu>
        <MenuTrigger asChild>
          <Button appearance='gray' size='md'>
            Settings
          </Button>
        </MenuTrigger>
        <MenuContent className='w-208'>
          <MenuLabel>My Account</MenuLabel>
          <MenuGroup>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Billing</MenuItem>
            <MenuItem>Settings</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuLabel>Appearance</MenuLabel>
          <MenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
            Show Panel
          </MenuCheckboxItem>
          <MenuCheckboxItem
            checked={showActivityBar}
            onCheckedChange={setShowActivityBar}
          >
            Show Activity Bar
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuLabel>Position</MenuLabel>
          <MenuRadioGroup value={position} onValueChange={setPosition}>
            <MenuRadioItem value='top'>Top</MenuRadioItem>
            <MenuRadioItem value='bottom'>Bottom</MenuRadioItem>
            <MenuRadioItem value='right'>Right</MenuRadioItem>
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger>More Tools</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Save Page As...</MenuItem>
              <MenuItem>Create Shortcut...</MenuItem>
              <MenuItem>Developer Tools</MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator />
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Menu>
    );
  },
};
