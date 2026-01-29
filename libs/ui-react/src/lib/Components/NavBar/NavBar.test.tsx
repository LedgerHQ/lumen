import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import {
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarTitle,
  NavBarTrailing,
} from './NavBar';

describe('NavBar', () => {
  it('renders with all components', () => {
    render(
      <NavBar>
        <NavBarBackButton onClick={vi.fn()} />
        <NavBarTitle>Test Title</NavBarTitle>
        <NavBarTrailing>
          <button>Action</button>
        </NavBarTrailing>
      </NavBar>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders title correctly', () => {
    render(
      <NavBar>
        <NavBarTitle>Page Title</NavBarTitle>
      </NavBar>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Page Title',
    );
  });

  it('renders title with custom heading level using as prop', () => {
    render(
      <NavBar>
        <NavBarTitle as='h2'>Page Title</NavBarTitle>
      </NavBar>,
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Page Title',
    );
  });

  it('renders title as div when as="div"', () => {
    render(
      <NavBar>
        <NavBarTitle as='div'>Page Title</NavBarTitle>
      </NavBar>,
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });

  it('calls onClick when back button is clicked', () => {
    const handleBack = vi.fn();
    render(
      <NavBar>
        <NavBarBackButton onClick={handleBack} />
        <NavBarTitle>Title</NavBarTitle>
      </NavBar>,
    );

    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders with custom aria-label on back button', () => {
    render(
      <NavBar>
        <NavBarBackButton onClick={vi.fn()} aria-label='Custom back label' />
        <NavBarTitle>Title</NavBarTitle>
      </NavBar>,
    );

    expect(
      screen.getByRole('button', { name: 'Custom back label' }),
    ).toBeInTheDocument();
  });

  it('renders trailing content', () => {
    render(
      <NavBar>
        <NavBarTitle>Title</NavBarTitle>
        <NavBarTrailing>
          <button>Settings</button>
          <button>More</button>
        </NavBarTrailing>
      </NavBar>,
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('applies custom className to NavBar', () => {
    render(
      <NavBar className='bg-accent' data-testid='navbar'>
        <NavBarTitle>Title</NavBarTitle>
      </NavBar>,
    );

    expect(screen.getByTestId('navbar')).toHaveClass('bg-accent');
  });

  it('applies custom className to NavBarTitle', () => {
    render(
      <NavBar>
        <NavBarTitle className='bg-accent'>Title</NavBarTitle>
      </NavBar>,
    );

    expect(screen.getByRole('heading')).toHaveClass('bg-accent');
  });

  it('applies custom className to NavBarTrailing', () => {
    render(
      <NavBar>
        <NavBarTitle>Title</NavBarTitle>
        <NavBarTrailing className='bg-accent' data-testid='trailing'>
          <button>Action</button>
        </NavBarTrailing>
      </NavBar>,
    );

    expect(screen.getByTestId('trailing')).toHaveClass('bg-accent');
  });
});

describe('NavBarCoinCapsule', () => {
  it('renders ticker and icon correctly', () => {
    const MockIcon = () => <svg data-testid='coin-icon' />;
    render(<NavBarCoinCapsule ticker='BTC' icon={<MockIcon />} />);

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByTestId('coin-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const MockIcon = () => <svg />;
    render(
      <NavBarCoinCapsule
        ticker='ETH'
        icon={<MockIcon />}
        className='bg-accent'
      />,
    );

    expect(
      screen.getByText('ETH').closest('[data-slot="coin-capsule"]'),
    ).toHaveClass('bg-accent');
  });

  it('renders different tickers', () => {
    const MockIcon = () => <svg />;
    const { rerender } = render(
      <NavBarCoinCapsule ticker='BTC' icon={<MockIcon />} />,
    );
    expect(screen.getByText('BTC')).toBeInTheDocument();

    rerender(<NavBarCoinCapsule ticker='ETH' icon={<MockIcon />} />);
    expect(screen.getByText('ETH')).toBeInTheDocument();

    rerender(<NavBarCoinCapsule ticker='USDT' icon={<MockIcon />} />);
    expect(screen.getByText('USDT')).toBeInTheDocument();
  });
});

describe('NavBar with NavBarCoinCapsule', () => {
  it('renders NavBar with NavBarCoinCapsule', () => {
    const MockIcon = () => <svg data-testid='btc-icon' />;
    render(
      <NavBar>
        <NavBarBackButton onClick={vi.fn()} />
        <NavBarCoinCapsule ticker='BTC' icon={<MockIcon />} />
        <NavBarTrailing>
          <button>More</button>
        </NavBarTrailing>
      </NavBar>,
    );

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByTestId('btc-icon')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
