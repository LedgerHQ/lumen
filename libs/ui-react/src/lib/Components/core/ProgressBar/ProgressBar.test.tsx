import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('should expose the progressbar role with the value range', () => {
    render(<ProgressBar value={40} aria-label='Upload' />);

    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
  });

  it('should clamp values outside the range', () => {
    const { rerender } = render(<ProgressBar value={-5} aria-label='Upload' />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );

    rerender(<ProgressBar value={140} aria-label='Upload' />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
  });

  it('should size the fill from the value', () => {
    render(<ProgressBar value={25} aria-label='Upload' />);

    const fill = screen.getByRole('progressbar').firstElementChild;
    expect(fill).toHaveStyle({ width: '25%' });
  });

  it.each([
    ['base', 'bg-interactive'],
    ['accent', 'bg-accent'],
    ['success', 'bg-success-strong'],
    ['error', 'bg-error-strong'],
    ['warning', 'bg-warning-strong'],
    ['decorative-purple', 'bg-decorative-purple'],
    ['decorative-turquoise', 'bg-decorative-turquoise'],
  ] as const)('should apply the %s appearance', (appearance, expectedClass) => {
    render(<ProgressBar value={50} appearance={appearance} aria-label='X' />);

    expect(screen.getByRole('progressbar').firstElementChild).toHaveClass(
      expectedClass,
    );
  });

  it('should use the base appearance by default', () => {
    render(<ProgressBar value={50} aria-label='X' />);

    expect(screen.getByRole('progressbar').firstElementChild).toHaveClass(
      'bg-interactive',
    );
  });

  it('should animate the fill for 200ms with ease-out', () => {
    render(<ProgressBar value={50} aria-label='X' />);

    expect(screen.getByRole('progressbar').firstElementChild).toHaveClass(
      'transition-[width]',
      'duration-200',
      'ease-out',
    );
  });

  it('should render a single element when there is no label', () => {
    const { container } = render(<ProgressBar value={50} aria-label='X' />);

    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(screen.getByRole('progressbar'));
  });

  it('should name the bar from the rendered label', () => {
    render(<ProgressBar value={50} label='Syncing accounts' />);

    expect(
      screen.getByRole('progressbar', { name: 'Syncing accounts' }),
    ).toBeInTheDocument();
  });

  it('should prefer aria-label over the rendered label', () => {
    render(
      <ProgressBar
        value={50}
        aria-label='Sync progress'
        label='Syncing accounts'
      />,
    );

    const bar = screen.getByRole('progressbar', { name: 'Sync progress' });
    expect(bar).not.toHaveAttribute('aria-labelledby');
  });

  it('should place the label above the bar for a top position', () => {
    const { container } = render(
      <ProgressBar value={50} label='Syncing' labelPosition='start-top' />,
    );

    expect(container.firstElementChild).toHaveClass('flex-col');
    expect(container.firstElementChild).not.toHaveClass('flex-col-reverse');
  });

  it('should place the label below the bar by default', () => {
    const { container } = render(<ProgressBar value={50} label='Syncing' />);

    expect(container.firstElementChild).toHaveClass('flex-col-reverse');
  });

  it('should forward the ref and className to the progressbar element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ProgressBar ref={ref} value={50} aria-label='X' className='mt-8' />,
    );

    expect(ref.current).toBe(screen.getByRole('progressbar'));
    expect(ref.current).toHaveClass('mt-8');
  });

  it('should apply className to the label wrapper rather than the bar', () => {
    const { container } = render(
      <ProgressBar value={50} label='Syncing' className='hidden' />,
    );

    expect(container.firstElementChild).toHaveClass('hidden');
    expect(screen.getByRole('progressbar')).not.toHaveClass('hidden');
  });

  it('should clamp NaN to zero', () => {
    render(<ProgressBar value={Number.NaN} aria-label='X' />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  });

  it('should not render a boolean label', () => {
    const { container } = render(
      <ProgressBar value={50} label={false} aria-label='X' />,
    );

    expect(container.children).toHaveLength(1);
  });

  it('should reject a boolean label without an aria-label', () => {
    // @ts-expect-error a boolean label does not name the bar
    render(<ProgressBar value={50} label={false} />);
  });

  it('should require a name through aria-label or label', () => {
    // @ts-expect-error a bar needs either `aria-label` or `label`
    render(<ProgressBar value={50} />);
  });
});
