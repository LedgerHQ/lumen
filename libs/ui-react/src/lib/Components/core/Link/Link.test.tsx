import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Link } from './Link';

describe('Link Component', () => {
  it('should render correctly with children', () => {
    render(<Link href='/'>Home</Link>);
    const linkElement = screen.getByRole('link', { name: /home/i });
    expect(linkElement).toBeInTheDocument();
  });

  it('should handle external links', () => {
    render(
      <Link href='https://example.com' isExternal>
        External
      </Link>,
    );
    const linkElement = screen.getByRole('link', { name: /external/i });
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should not add external attributes when asChild is true', () => {
    render(
      <Link asChild isExternal>
        <a href='https://example.com'>External Child</a>
      </Link>,
    );
    const linkElement = screen.getByRole('link', { name: /external child/i });
    expect(linkElement).not.toHaveAttribute('target');
    expect(linkElement).not.toHaveAttribute('rel');
  });

  it('should call the onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <Link href='/' onClick={handleClick}>
        Clickable
      </Link>,
    );

    const linkElement = screen.getByRole('link');
    fireEvent.click(linkElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply correct classes for accent appearance and small size', () => {
    render(
      <Link href='/' appearance='accent' size='sm'>
        Accent Small
      </Link>,
    );
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('gap-4');
    expect(linkElement).toHaveClass('body-2-semi-bold');
    expect(linkElement).toHaveClass('text-interactive');
  });

  it('should render as child with merged props', () => {
    render(
      <Link asChild appearance='base' size='md'>
        <a href='/dashboard'>Dashboard</a>
      </Link>,
    );
    const linkElement = screen.getByRole('link', { name: /dashboard/i });
    expect(linkElement).toHaveClass('gap-8');
    expect(linkElement).toHaveClass('body-1-semi-bold');
    expect(linkElement).toHaveClass('text-base');
  });

  it('should apply underline by default', () => {
    render(
      <Link href='/' appearance='base'>
        Default Link
      </Link>,
    );
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('underline');
    expect(linkElement).toHaveClass('underline-offset-2');
  });

  it('should apply underline when underline prop is true', () => {
    render(
      <Link href='/' appearance='base' underline>
        Underlined Link
      </Link>,
    );
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('underline');
    expect(linkElement).toHaveClass('underline-offset-2');
  });

  it('should not apply underline when underline prop is false', () => {
    render(
      <Link href='/' appearance='base' underline={false}>
        No Underline
      </Link>,
    );
    const linkElement = screen.getByRole('link');
    expect(linkElement).not.toHaveClass('underline');
  });

  it('should apply inherit appearance correctly', () => {
    render(
      <Link href='/' appearance='inherit' size='md'>
        Inherit Appearance
      </Link>,
    );
    const linkElement = screen.getByRole('link');
    expect(linkElement).not.toHaveClass('text-base');
    expect(linkElement).not.toHaveClass('text-interactive');
  });

  it('should apply inherit size correctly', () => {
    render(
      <Link href='/' appearance='base' size='inherit'>
        Inherit Size
      </Link>,
    );
    const linkElement = screen.getByRole('link');
    expect(linkElement).not.toHaveClass('body-1-semi-bold');
    expect(linkElement).not.toHaveClass('body-2-semi-bold');
    expect(linkElement).not.toHaveClass('gap-4');
    expect(linkElement).not.toHaveClass('gap-8');
  });

  it('should combine underline with different appearances', () => {
    render(
      <Link href='/' appearance='accent' underline>
        Accent with Underline
      </Link>,
    );
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('text-interactive');
    expect(linkElement).toHaveClass('underline');
  });
});
