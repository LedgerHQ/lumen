import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import {
  Home,
  HomeFill,
  Wallet,
  SettingsAlt,
  SettingsAlt2,
} from '../../Symbols';
import {
  SideBar,
  SideBarLeading,
  SideBarTrailing,
  SideBarFooter,
  SideBarItem,
  SideBarCollapseToggle,
} from './SideBar';

vi.mock('i18next', () => ({
  t: (key: string) => key,
}));

describe('SideBar Component', () => {
  describe('Basic Rendering', () => {
    it('should render correctly with composite API', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
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
        </SideBar>,
      );

      const navElement = screen.getByRole('navigation');
      expect(navElement).toBeInTheDocument();
      expect(navElement).toHaveAttribute(
        'aria-label',
        'components.sideBar.navigationAriaLabel',
      );
    });

    it('should render all items', () => {
      render(
        <SideBar>
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
        </SideBar>,
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Wallet')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render collapse toggle in footer', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
          <SideBarFooter>
            <SideBarCollapseToggle data-testid='sidebar-collapse' />
          </SideBarFooter>
        </SideBar>,
      );

      expect(screen.getByTestId('sidebar-collapse')).toBeInTheDocument();
    });

    it('should render SideBarFooter at bottom', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
          <SideBarFooter data-testid='sidebar-footer'>
            <SideBarCollapseToggle />
          </SideBarFooter>
        </SideBar>,
      );

      expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument();
    });

    it('should have SideBarTrailing with mt-auto to push to bottom', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
          <SideBarTrailing data-testid='sidebar-trailing'>
            <SideBarItem
              value='settings'
              icon={SettingsAlt}
              activeIcon={SettingsAlt2}
              label='Settings'
            />
          </SideBarTrailing>
          <SideBarFooter>
            <SideBarCollapseToggle />
          </SideBarFooter>
        </SideBar>,
      );

      expect(screen.getByTestId('sidebar-trailing')).toHaveClass('mt-auto');
    });
  });

  describe('Collapsed State', () => {
    it('should start expanded by default', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      const navElement = screen.getByRole('navigation');
      expect(navElement).toHaveClass('w-208');
    });

    it('should start collapsed when defaultCollapsed is true', () => {
      render(
        <SideBar defaultCollapsed={true}>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      const navElement = screen.getByRole('navigation');
      expect(navElement).toHaveClass('w-72');
    });

    it('should hide labels when collapsed', () => {
      render(
        <SideBar defaultCollapsed={true}>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      // Label is still in DOM but visually hidden with CSS
      const buttons = screen.getAllByRole('button');
      const homeButton = buttons.find((btn) => btn.querySelector('svg'));
      expect(homeButton).toBeInTheDocument();
      const homeLabel = homeButton?.querySelector('span');
      expect(homeLabel).toHaveTextContent('Home');
      expect(homeLabel).toHaveClass('opacity-0', 'w-0');
    });

    it('should toggle collapsed state when collapse button is clicked', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
          <SideBarFooter>
            <SideBarCollapseToggle data-testid='sidebar-collapse' />
          </SideBarFooter>
        </SideBar>,
      );

      const navElement = screen.getByRole('navigation');
      expect(navElement).toHaveClass('w-208');

      const collapseButton = screen.getByTestId('sidebar-collapse');
      fireEvent.click(collapseButton);

      expect(navElement).toHaveClass('w-72');
    });

    it('should call onCollapsedChange when state changes', () => {
      const handleCollapsedChange = vi.fn();
      render(
        <SideBar onCollapsedChange={handleCollapsedChange}>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
          <SideBarFooter>
            <SideBarCollapseToggle data-testid='sidebar-collapse' />
          </SideBarFooter>
        </SideBar>,
      );

      const collapseButton = screen.getByTestId('sidebar-collapse');
      fireEvent.click(collapseButton);

      expect(handleCollapsedChange).toHaveBeenCalledWith(true);
    });

    it('should respect controlled collapsed state', () => {
      const { rerender } = render(
        <SideBar collapsed={false}>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      const navElement = screen.getByRole('navigation');
      expect(navElement).toHaveClass('w-208');

      rerender(
        <SideBar collapsed={true}>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      expect(navElement).toHaveClass('w-72');
    });
  });

  describe('SideBarItem', () => {
    it('should call onActiveChange when clicked', () => {
      const handleActiveChange = vi.fn();
      render(
        <SideBar onActiveChange={handleActiveChange}>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      const homeButton = screen.getByText('Home').closest('button');
      fireEvent.click(homeButton!);

      expect(handleActiveChange).toHaveBeenCalledWith('home');
    });

    it('should have active styling when active', () => {
      render(
        <SideBar active='home'>
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
        </SideBar>,
      );

      const homeButton = screen.getByText('Home').closest('button');
      const walletButton = screen.getByText('Wallet').closest('button');

      expect(homeButton).toHaveClass('bg-muted-transparent');
      expect(walletButton).toHaveClass('bg-base-transparent');
    });

    it('should use activeIcon when active', () => {
      const { container } = render(
        <SideBar active='home'>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      // Check that the SVG element is rendered (activeIcon should be used)
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    it('should render icon only when label is omitted', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              tooltipContent='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
              disabled
            />
          </SideBarLeading>
        </SideBar>,
      );

      const homeButton = screen.getByText('Home').closest('button');
      expect(homeButton).toBeDisabled();
      expect(homeButton).toHaveClass('text-disabled');
    });

    it('should not call onActiveChange when disabled', () => {
      const handleActiveChange = vi.fn();
      render(
        <SideBar onActiveChange={handleActiveChange}>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
              disabled
            />
          </SideBarLeading>
        </SideBar>,
      );

      const homeButton = screen.getByText('Home').closest('button');
      fireEvent.click(homeButton!);

      expect(handleActiveChange).not.toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to SideBar', () => {
      const customClass = 'custom-sidebar-class';
      render(
        <SideBar className={customClass}>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      const navElement = screen.getByRole('navigation');
      expect(navElement).toHaveClass(customClass);
    });

    it('should apply custom className to SideBarItem', () => {
      const customClass = 'custom-item-class';
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
              className={customClass}
            />
          </SideBarLeading>
        </SideBar>,
      );

      const homeButton = screen.getByText('Home').closest('button');
      expect(homeButton).toHaveClass(customClass);
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-label on navigation', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      const navElement = screen.getByRole('navigation');
      expect(navElement).toHaveAttribute(
        'aria-label',
        'components.sideBar.navigationAriaLabel',
      );
    });

    it('should have correct aria-label on collapse toggle', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
          <SideBarFooter>
            <SideBarCollapseToggle data-testid='sidebar-collapse' />
          </SideBarFooter>
        </SideBar>,
      );

      const collapseToggle = screen.getByTestId('sidebar-collapse');
      expect(collapseToggle).toBeInTheDocument();
      expect(collapseToggle).toHaveAttribute(
        'aria-label',
        'components.sideBar.collapseAriaLabel',
      );
    });

    it('should update collapse toggle aria-label when collapsed', () => {
      render(
        <SideBar defaultCollapsed={true}>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
          <SideBarFooter>
            <SideBarCollapseToggle />
          </SideBarFooter>
        </SideBar>,
      );

      expect(
        screen.getByLabelText('components.sideBar.expandAriaLabel'),
      ).toBeInTheDocument();
    });

    it('should support keyboard navigation on items', () => {
      render(
        <SideBar>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
          </SideBarLeading>
        </SideBar>,
      );

      const homeButton = screen.getByText('Home').closest('button');
      homeButton?.focus();
      expect(document.activeElement).toBe(homeButton);
    });

    it('should have aria-current on active item', () => {
      render(
        <SideBar active='home'>
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
        </SideBar>,
      );

      const homeButton = screen.getByText('Home').closest('button');
      const walletButton = screen.getByText('Wallet').closest('button');

      expect(homeButton).toHaveAttribute('aria-current', 'page');
      expect(walletButton).not.toHaveAttribute('aria-current');
    });
  });

  describe('Active State', () => {
    it('should call onActiveChange when item is clicked', () => {
      const handleActiveChange = vi.fn();
      render(
        <SideBar active='home' onActiveChange={handleActiveChange}>
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
        </SideBar>,
      );

      const walletButton = screen.getByText('Wallet').closest('button');
      fireEvent.click(walletButton!);

      expect(handleActiveChange).toHaveBeenCalledWith('wallet');
    });

    it('should use defaultActive for initial state', () => {
      render(
        <SideBar defaultActive='wallet'>
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
        </SideBar>,
      );

      const homeButton = screen.getByText('Home').closest('button');
      const walletButton = screen.getByText('Wallet').closest('button');

      expect(homeButton).toHaveClass('bg-base-transparent');
      expect(walletButton).toHaveClass('bg-muted-transparent');
    });

    it('should respect controlled active state', () => {
      const { rerender } = render(
        <SideBar active='home'>
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
        </SideBar>,
      );

      const homeButton = screen.getByText('Home').closest('button');
      const walletButton = screen.getByText('Wallet').closest('button');

      expect(homeButton).toHaveClass('bg-muted-transparent');
      expect(walletButton).toHaveClass('bg-base-transparent');

      rerender(
        <SideBar active='wallet'>
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
        </SideBar>,
      );

      expect(homeButton).toHaveClass('bg-base-transparent');
      expect(walletButton).toHaveClass('bg-muted-transparent');
    });
  });
});
