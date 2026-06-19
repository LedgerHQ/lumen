import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
  title: 'Core/Menu',
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
      <MenuTrigger
        render={
          <IconButton
            onClick={() => console.log('Menu clicked')}
            icon={MoreVertical}
            aria-label='Open Menu'
            appearance='gray'
          />
        }
      />
      <MenuContent className='w-208'>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Billing</MenuItem>
        <MenuItem>Team</MenuItem>
        <MenuItem>Subscription</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const OpenByDefault: Story = {
  name: 'Open by Default',
  render: () => (
    <Menu defaultOpen>
      <MenuTrigger
        render={
          <IconButton
            icon={MoreVertical}
            aria-label='Open Menu'
            appearance='gray'
          />
        }
      />
      <MenuContent className='w-208'>
        <MenuGroup>
          <MenuLabel>My Account</MenuLabel>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuItem>Settings</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuLabel>Team</MenuLabel>
          <MenuItem>Invite Users</MenuItem>
          <MenuItem>Team Settings</MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  ),
};

export const WithGroups: Story = {
  name: 'With Groups and Labels',
  render: () => (
    <Menu>
      <MenuTrigger
        render={
          <IconButton
            icon={MoreVertical}
            aria-label='Open Menu'
            appearance='gray'
          />
        }
      />
      <MenuContent className='w-208'>
        <MenuGroup>
          <MenuLabel>My Account</MenuLabel>
          <MenuItem disabled>Profile</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuItem>Settings</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuLabel>Team</MenuLabel>
          <MenuItem>Invite Users</MenuItem>
          <MenuItem>Team Settings</MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => {
    const [showPanel, setShowPanel] = useState(false);
    const [showActivityBar, setShowActivityBar] = useState(true);
    const [showStatusBar, setShowStatusBar] = useState(true);

    return (
      <Menu>
        <MenuTrigger
          render={
            <Button size='md' appearance='gray'>
              View Options
            </Button>
          }
        />
        <MenuContent className='w-208'>
          <MenuGroup>
            <MenuLabel>Appearance</MenuLabel>
            <MenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
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
          </MenuGroup>
        </MenuContent>
      </Menu>
    );
  },
};

export const WithRadioItems: Story = {
  render: () => {
    const [position, setPosition] = useState('bottom');

    return (
      <Menu>
        <MenuTrigger
          render={
            <Button appearance='gray' size='md'>
              Panel Position
            </Button>
          }
        />
        <MenuContent className='w-208'>
          <MenuGroup>
            <MenuLabel>Panel Position</MenuLabel>
            <MenuRadioGroup value={position} onValueChange={setPosition}>
              <MenuRadioItem value='top'>Top</MenuRadioItem>
              <MenuRadioItem value='bottom'>Bottom</MenuRadioItem>
              <MenuRadioItem value='right'>Right</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        </MenuContent>
      </Menu>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger
        render={
          <Button appearance='gray' size='md'>
            Open Menu
          </Button>
        }
      />
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
      <MenuTrigger
        render={
          <Button appearance='gray' size='md'>
            Open Menu
          </Button>
        }
      />
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
        <MenuTrigger
          render={
            <Button appearance='gray' size='md'>
              Top
            </Button>
          }
        />
        <MenuContent side='top' className='w-48'>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger
          render={
            <Button appearance='gray' size='md'>
              Bottom
            </Button>
          }
        />
        <MenuContent side='bottom' className='w-48'>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger
          render={
            <Button appearance='gray' size='md'>
              Left
            </Button>
          }
        />
        <MenuContent side='left' className='w-48'>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger
          render={
            <Button appearance='gray' size='md'>
              Right
            </Button>
          }
        />
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
    const [showPanel, setShowPanel] = useState(false);
    const [showActivityBar, setShowActivityBar] = useState(true);
    const [position, setPosition] = useState('bottom');

    return (
      <Menu>
        <MenuTrigger
          render={
            <Button appearance='gray' size='md'>
              Settings
            </Button>
          }
        />
        <MenuContent className='w-208'>
          <MenuGroup>
            <MenuLabel>My Account</MenuLabel>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Billing</MenuItem>
            <MenuItem>Settings</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuLabel>Appearance</MenuLabel>
            <MenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              Show Panel
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={showActivityBar}
              onCheckedChange={setShowActivityBar}
            >
              Show Activity Bar
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuLabel>Position</MenuLabel>
            <MenuRadioGroup value={position} onValueChange={setPosition}>
              <MenuRadioItem value='top'>Top</MenuRadioItem>
              <MenuRadioItem value='bottom'>Bottom</MenuRadioItem>
              <MenuRadioItem value='right'>Right</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
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
