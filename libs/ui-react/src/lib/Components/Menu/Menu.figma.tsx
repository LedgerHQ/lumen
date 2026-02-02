import React from 'react';
import { figma } from '@figma/code-connect';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuCheckboxItem,
} from './Menu';

// Menu Item Component
figma.connect(
  MenuItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=7897-7037',
  {
    props: {
      children: figma.boolean('show-description', {
        true: figma.enum('state', {
          disabled: (
            <div className='flex flex-col'>
              <span>Title</span>
              <span className='text-disabled body-3'>Description</span>
            </div>
          ),
          default: (
            <div className='flex flex-col'>
              <span>Title</span>
              <span className='text-muted body-3'>Description</span>
            </div>
          ),
        }),
        false: figma.string('title'),
      }),
      icon: figma.boolean('show-icon', {
        true: figma.instance('icon'),
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: ({ children, icon, disabled }) => (
      <MenuItem disabled={disabled}>
        {icon}
        {children}
      </MenuItem>
    ),
  },
);

// Menu Content
figma.connect(
  MenuContent,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=7983-4755',
  {
    props: {
      section2: figma.boolean('show-section-2', {
        true: figma.boolean('show-divider', {
          true: figma.boolean('show-section-title', {
            true: (
              <>
                <MenuSeparator />
                <MenuLabel>Section 2</MenuLabel>
                <MenuItem>Item 3</MenuItem>
              </>
            ),
            false: (
              <>
                <MenuSeparator />
                <MenuItem>Item 3</MenuItem>
              </>
            ),
          }),
          false: figma.boolean('show-section-title', {
            true: (
              <>
                <MenuLabel>Section 2</MenuLabel>
                <MenuItem>Item 3</MenuItem>
              </>
            ),
            false: <MenuItem>Item 3</MenuItem>,
          }),
        }),
        false: undefined,
      }),
      section3: figma.boolean('show-section-3', {
        true: figma.boolean('show-divider', {
          true: figma.boolean('show-section-title', {
            true: (
              <>
                <MenuSeparator />
                <MenuLabel>Section 3</MenuLabel>
                <MenuItem>Item 4</MenuItem>
              </>
            ),
            false: (
              <>
                <MenuSeparator />
                <MenuItem>Item 4</MenuItem>
              </>
            ),
          }),
          false: figma.boolean('show-section-title', {
            true: (
              <>
                <MenuLabel>Section 3</MenuLabel>
                <MenuItem>Item 4</MenuItem>
              </>
            ),
            false: <MenuItem>Item 4</MenuItem>,
          }),
        }),
        false: undefined,
      }),
      section4: figma.boolean('show-section-4', {
        true: figma.boolean('show-divider', {
          true: figma.boolean('show-section-title', {
            true: (
              <>
                <MenuSeparator />
                <MenuLabel>Section 4</MenuLabel>
                <MenuItem>Item 5</MenuItem>
              </>
            ),
            false: (
              <>
                <MenuSeparator />
                <MenuItem>Item 5</MenuItem>
              </>
            ),
          }),
          false: figma.boolean('show-section-title', {
            true: (
              <>
                <MenuLabel>Section 4</MenuLabel>
                <MenuItem>Item 5</MenuItem>
              </>
            ),
            false: <MenuItem>Item 5</MenuItem>,
          }),
        }),
        false: undefined,
      }),
    },
    example: ({ section2, section3, section4 }) => (
      <MenuContent className='w-64'>
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        {section2}
        {section3}
        {section4}
      </MenuContent>
    ),
  },
);

// Menu with Checkboxes and Radio
figma.connect(
  Menu,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=10211-1993',
  {
    example: () => (
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent className='w-64'>
          <MenuCheckboxItem checked>Item 1</MenuCheckboxItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
          <MenuItem>Item 4</MenuItem>
          <MenuItem>Item 5</MenuItem>
        </MenuContent>
      </Menu>
    ),
  },
);
