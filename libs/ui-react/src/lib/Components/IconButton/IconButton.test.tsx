import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings } from '../../Symbols/Icons/Settings';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders with required props', () => {
    render(<IconButton aria-label='Settings' icon={Settings} />);
    expect(screen.getByLabelText('Settings')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <IconButton aria-label='Settings' icon={Settings} className='mt-4' />,
    );
    expect(screen.getByLabelText('Settings')).toHaveClass('mt-4');
  });

  it('handles disabled state', () => {
    render(<IconButton aria-label='Settings' icon={Settings} disabled />);
    expect(screen.getByLabelText('Settings')).toBeDisabled();
  });

  it('handles click events when not disabled', async () => {
    const handleClick = vi.fn();
    render(
      <IconButton
        aria-label='Settings'
        icon={Settings}
        onClick={handleClick}
      />,
    );

    await userEvent.click(screen.getByLabelText('Settings'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle click events when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <IconButton
        aria-label='Settings'
        icon={Settings}
        onClick={handleClick}
        disabled
      />,
    );

    await userEvent.click(screen.getByLabelText('Settings'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <IconButton aria-label='Settings' icon={Settings} size='xs' />,
    );
    expect(screen.getByLabelText('Settings')).toHaveClass('p-8');

    rerender(<IconButton aria-label='Settings' icon={Settings} size='lg' />);
    expect(screen.getByLabelText('Settings')).toHaveClass('p-16');
  });

  it('renders with different appearances', () => {
    const { rerender } = render(
      <IconButton aria-label='Settings' icon={Settings} appearance='accent' />,
    );
    expect(screen.getByLabelText('Settings')).toHaveClass(
      'bg-accent text-on-accent',
    );

    rerender(
      <IconButton aria-label='Settings' icon={Settings} appearance='gray' />,
    );
    expect(screen.getByLabelText('Settings')).toHaveClass('bg-muted text-base');
  });

  it('does not call onTooltipOpenChange when tooltip is not enabled', async () => {
    const handleTooltipShow = vi.fn();
    render(
      <IconButton
        aria-label='Settings'
        icon={Settings}
        onTooltipOpenChange={handleTooltipShow}
      />,
    );

    await userEvent.hover(screen.getByLabelText('Settings'));

    expect(handleTooltipShow).not.toHaveBeenCalled();
  });
});
