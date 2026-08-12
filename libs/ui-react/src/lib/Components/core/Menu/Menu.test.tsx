import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  createMenuRadioGroup,
} from './Menu';

const openMenu = (trigger: HTMLElement) => {
  fireEvent.mouseDown(trigger);
  fireEvent.click(trigger);
};

describe('Menu', () => {
  it('renders trigger element', () => {
    render(
      <Menu>
        <MenuTrigger render={<button type='button'>Open Menu</button>} />
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
        </MenuContent>
      </Menu>,
    );

    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    render(
      <Menu>
        <MenuTrigger render={<button type='button'>Open Menu</button>} />
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
        </MenuContent>
      </Menu>,
    );

    openMenu(screen.getByRole('button', { name: 'Open Menu' }));

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  it('opens menu when trigger uses render prop', async () => {
    render(
      <Menu>
        <MenuTrigger render={<button type='button'>Custom trigger</button>} />
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
        </MenuContent>
      </Menu>,
    );

    openMenu(screen.getByRole('button', { name: 'Custom trigger' }));

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  it('calls onClick when menu item is clicked', async () => {
    const onClick = vi.fn();

    render(
      <Menu>
        <MenuTrigger render={<button type='button'>Open Menu</button>} />
        <MenuContent>
          <MenuItem onClick={onClick}>Item 1</MenuItem>
        </MenuContent>
      </Menu>,
    );

    openMenu(screen.getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Item 1'));

    expect(onClick).toHaveBeenCalled();
  });

  it('handles checkbox items', async () => {
    const onCheckedChange = vi.fn();

    render(
      <Menu>
        <MenuTrigger render={<button type='button'>Open Menu</button>} />
        <MenuContent>
          <MenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
            Checkbox Item
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>,
    );

    openMenu(screen.getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => {
      expect(screen.getByText('Checkbox Item')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Checkbox Item'));

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.any(Object));
  });

  it('handles radio items', async () => {
    const onValueChange = vi.fn();

    render(
      <Menu>
        <MenuTrigger render={<button type='button'>Open Menu</button>} />
        <MenuContent>
          <MenuRadioGroup value='option1' onValueChange={onValueChange}>
            <MenuRadioItem value='option1'>Option 1</MenuRadioItem>
            <MenuRadioItem value='option2'>Option 2</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>,
    );

    openMenu(screen.getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => {
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Option 2'));

    expect(onValueChange).toHaveBeenCalledWith('option2');
  });

  it('disables menu items when disabled prop is true', async () => {
    render(
      <Menu>
        <MenuTrigger render={<button type='button'>Open Menu</button>} />
        <MenuContent>
          <MenuItem disabled>Disabled Item</MenuItem>
        </MenuContent>
      </Menu>,
    );

    openMenu(screen.getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => {
      expect(screen.getByText('Disabled Item')).toBeInTheDocument();
    });

    expect(screen.getByText('Disabled Item')).toHaveAttribute('data-disabled');
  });

  describe('createMenuRadioGroup', () => {
    it('returns typed radio components that render and select', async () => {
      const { MenuRadioGroup: TypedGroup, MenuRadioItem: TypedItem } =
        createMenuRadioGroup<'option1' | 'option2'>();
      const onValueChange = vi.fn();

      render(
        <Menu>
          <MenuTrigger render={<button type='button'>Open Menu</button>} />
          <MenuContent>
            <TypedGroup value='option1' onValueChange={onValueChange}>
              <TypedItem value='option1'>Option 1</TypedItem>
              <TypedItem value='option2'>Option 2</TypedItem>
            </TypedGroup>
          </MenuContent>
        </Menu>,
      );

      openMenu(screen.getByRole('button', { name: 'Open Menu' }));
      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Option 2'));

      expect(onValueChange).toHaveBeenCalledWith('option2');
    });
  });
});
