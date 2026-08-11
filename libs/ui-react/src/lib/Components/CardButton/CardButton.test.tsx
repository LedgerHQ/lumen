import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Settings, Wallet } from '../../Symbols';
import { CardButton } from './CardButton';

describe('CardButton Component', () => {
  it('should render correctly with only title', () => {
    render(<CardButton title='Basic Card' />);
    const buttonElement = screen.getByRole('button', { name: /basic card/i });
    expect(buttonElement).toBeInTheDocument();
    expect(screen.getByText('Basic Card')).toBeInTheDocument();
  });

  it('should render with title and description', () => {
    render(
      <CardButton title='Card Title' description='Card description text' />,
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description text')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    render(<CardButton title='Settings Card' icon={Settings} />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(screen.getByText('Settings Card')).toBeInTheDocument();
  });

  it('should render without chevron when hideChevron prop is true', () => {
    render(<CardButton title='Navigation Card' hideChevron />);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(screen.getByText('Navigation Card')).toBeInTheDocument();
  });

  it('should render with all props: icon, title, description, and hideChevron', () => {
    render(
      <CardButton
        title='Complete Card'
        description='This card has everything'
        icon={Wallet}
      />,
    );

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(screen.getByText('Complete Card')).toBeInTheDocument();
    expect(screen.getByText('This card has everything')).toBeInTheDocument();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<CardButton title='Disabled Card' disabled />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  it('should call the onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<CardButton title='Clickable Card' onClick={handleClick} />);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call the onClick handler when disabled', () => {
    const handleClick = vi.fn();
    render(<CardButton title='Disabled Card' onClick={handleClick} disabled />);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<CardButton title='Custom Card' className='mt-1' />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('mt-1');
  });

  it('should handle long title text with truncation', () => {
    const longTitle =
      'This is a very long title that should be truncated when it exceeds the available space';
    render(<CardButton title={longTitle} />);

    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toHaveClass('truncate');
  });

  it('should handle long description text with truncation', () => {
    const longDescription =
      'This is a very long description that should be truncated when it exceeds the available space in the card button component';
    render(<CardButton title='Title' description={longDescription} />);

    const descriptionElement = screen.getByText(longDescription);
    expect(descriptionElement).toHaveClass('line-clamp-2');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<CardButton title='Ref Test' ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should default to type="button" so it does not submit a form', () => {
    render(<CardButton title='Default type' />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should let the caller override the type', () => {
    render(<CardButton title='Submit' type='submit' />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
