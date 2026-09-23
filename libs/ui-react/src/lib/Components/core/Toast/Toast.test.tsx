import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Toast } from './Toast';

describe('Toast', () => {
  describe('Rendering', () => {
    it('should render the title', () => {
      render(<Toast title='Payment done' />);
      expect(screen.getByText('Payment done')).toBeInTheDocument();
    });

    it('should wrap the title over up to five lines', () => {
      render(<Toast title='A very long toast title' />);
      expect(screen.getByText('A very long toast title')).toHaveClass(
        'line-clamp-5',
      );
    });

    it('should not render a leading icon for the info appearance', () => {
      const { container } = render(<Toast title='Info' appearance='info' />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
      expect(container.firstChild).toHaveClass('pl-16');
    });

    it('should render a status icon for non-info appearances', () => {
      const { container } = render(
        <Toast title='Saved' appearance='success' />,
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('pl-12');
    });

    it('should render a spinner while loading', () => {
      render(<Toast title='Uploading' loading />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should give the title right breathing room', () => {
      render(<Toast title='Report ready' />);
      expect(screen.getByText('Report ready')).toHaveClass('pr-16');
    });

    it('should not shift the action when there is no leading icon', () => {
      render(
        <Toast
          appearance='info'
          title='Report ready'
          action={{ label: 'Open', onAction: vi.fn() }}
        />,
      );
      expect(screen.getByRole('button', { name: 'Open' })).not.toHaveClass(
        '-ml-16',
      );
    });

    it('should shift the action to align its label with the title when there is a leading icon', () => {
      render(
        <Toast
          appearance='success'
          title='Report ready'
          action={{ label: 'Open', onAction: vi.fn() }}
        />,
      );
      expect(screen.getByRole('button', { name: 'Open' })).toHaveClass(
        '-ml-16',
      );
    });

    it('should shift the action to align its label with the title when loading', () => {
      render(
        <Toast
          loading
          title='Uploading'
          action={{ label: 'Cancel', onAction: vi.fn() }}
        />,
      );
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(
        '-ml-16',
      );
    });
  });

  describe('Accessibility', () => {
    it('should use role="status" for info and success', () => {
      const { rerender } = render(<Toast title='Info' appearance='info' />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<Toast title='Saved' appearance='success' />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should use role="alert" for warning and error', () => {
      const { rerender } = render(
        <Toast title='Careful' appearance='warning' />,
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();

      rerender(<Toast title='Failed' appearance='error' />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should render the close button and fire onClose', () => {
      const onClose = vi.fn();
      render(<Toast title='Dismiss me' onClose={onClose} />);

      const closeButton = screen.getByRole('button', {
        name: 'components.toast.closeAriaLabel',
      });
      fireEvent.click(closeButton);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not render a close button without onClose', () => {
      render(<Toast title='No close' />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should apply a custom close aria-label', () => {
      render(
        <Toast
          title='Dismiss me'
          onClose={vi.fn()}
          closeAriaLabel='Dismiss notification'
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Dismiss notification' }),
      ).toBeInTheDocument();
    });

    it('should render the action and fire onAction without closing', () => {
      const onAction = vi.fn();
      const onClose = vi.fn();
      render(
        <Toast
          title='Upload failed'
          onClose={onClose}
          action={{ label: 'Retry', onAction }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should apply a custom className', () => {
      const { container } = render(<Toast title='Styled' className='mb-16' />);
      expect(container.firstChild).toHaveClass('mb-16');
    });

    it('should forward ref', () => {
      const ref = vi.fn();
      render(<Toast title='Ref' ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
