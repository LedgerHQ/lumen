import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button/Button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  createPopoverHandle,
} from './Popover';

describe('Popover', () => {
  it('renders trigger element', () => {
    render(
      <Popover>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent>
          <p>Content</p>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByText('Open Popover')).toBeInTheDocument();
  });

  it('opens popover on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent>
          <p>Popover Content</p>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByText('Open Popover'));

    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
  });

  it('supports controlled open state', async () => {
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent>
          <p>Controlled Content</p>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText('Controlled Content')).not.toBeInTheDocument();

    rerender(
      <Popover open={true} onOpenChange={onOpenChange}>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent>
          <p>Controlled Content</p>
        </PopoverContent>
      </Popover>,
    );

    await waitFor(() => {
      expect(screen.getByText('Controlled Content')).toBeInTheDocument();
    });
  });

  it('supports defaultOpen', async () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent>
          <p>Default Open Content</p>
        </PopoverContent>
      </Popover>,
    );

    await waitFor(() => {
      expect(screen.getByText('Default Open Content')).toBeInTheDocument();
    });
  });

  it('renders overlay when overlay prop is true', async () => {
    const user = userEvent.setup();
    render(
      <Popover overlay>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent>
          <p>With Overlay</p>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByText('Open Popover'));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="popover-overlay"]'),
      ).toBeInTheDocument();
    });
  });

  it('does not render overlay when overlay prop is false', async () => {
    const user = userEvent.setup();
    render(
      <Popover overlay={false}>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent>
          <p>Without Overlay</p>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByText('Open Popover'));

    await waitFor(() => {
      expect(screen.getByText('Without Overlay')).toBeInTheDocument();
    });
    expect(
      document.querySelector('[data-slot="popover-overlay"]'),
    ).not.toBeInTheDocument();
  });

  it('applies fixed width variant', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent width='fixed'>
          <p>Fixed Width Content</p>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByText('Open Popover'));

    await waitFor(() => {
      const popup = document.querySelector('[data-slot="popover-content"]');
      expect(popup).toBeInTheDocument();
      expect(popup).toHaveClass('w-400');
    });
  });

  it('applies fit width variant by default', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent className='w-256'>
          <p>Fit Width Content</p>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByText('Open Popover'));

    await waitFor(() => {
      const popup = document.querySelector('[data-slot="popover-content"]');
      expect(popup).toBeInTheDocument();
      expect(popup).toHaveClass('w-256');
    });
  });

  it('applies custom className to PopoverContent', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent className='min-w-320'>
          <p>Custom Class</p>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByText('Open Popover'));

    await waitFor(() => {
      const popup = document.querySelector('[data-slot="popover-content"]');
      expect(popup).toHaveClass('min-w-320');
    });
  });

  it('calls onOpenChange when toggling', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Popover onOpenChange={onOpenChange} overlay={false}>
        <PopoverTrigger
          render={<Button appearance='gray'>Open Popover</Button>}
        />
        <PopoverContent>
          <p>Content</p>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByText('Open Popover'));

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(Object));
  });

  describe('initialFocus', () => {
    it('does not move focus into the popup by default', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger
            render={<Button appearance='gray'>Open Popover</Button>}
          />
          <PopoverContent>
            <button>Inside</button>
          </PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByRole('button', { name: 'Open Popover' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Inside')).toBeInTheDocument();
      });
      expect(trigger).toHaveFocus();
    });

    it('keeps focus on the trigger when initialFocus={false}', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger
            render={<Button appearance='gray'>Open Popover</Button>}
          />
          <PopoverContent initialFocus={false}>
            <button>Inside</button>
          </PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByRole('button', { name: 'Open Popover' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Inside')).toBeInTheDocument();
      });
      expect(trigger).toHaveFocus();
    });

    it('moves focus to the first tabbable element when initialFocus={true}', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger
            render={<Button appearance='gray'>Open Popover</Button>}
          />
          <PopoverContent initialFocus>
            <button>First</button>
            <button>Second</button>
          </PopoverContent>
        </Popover>,
      );

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        expect(screen.getByText('First')).toHaveFocus();
      });
    });

    it('moves focus to the element passed via a ref', async () => {
      const user = userEvent.setup();

      const Wrapper = () => {
        const targetRef = useRef<HTMLButtonElement>(null);
        return (
          <Popover>
            <PopoverTrigger
              render={<Button appearance='gray'>Open Popover</Button>}
            />
            <PopoverContent initialFocus={targetRef}>
              <button>First</button>
              <button ref={targetRef}>Target</button>
            </PopoverContent>
          </Popover>
        );
      };

      render(<Wrapper />);
      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        expect(screen.getByText('Target')).toHaveFocus();
      });
    });
  });

  it('supports detached trigger with createPopoverHandle', async () => {
    const user = userEvent.setup();
    const handle = createPopoverHandle<{ label: string }>();

    render(
      <>
        <PopoverTrigger
          handle={handle}
          payload={{ label: 'external' }}
          render={<Button appearance='gray'>External Trigger</Button>}
        />
        <Popover handle={handle} overlay={false}>
          {({ payload }: { payload: { label: string } | undefined }) => (
            <PopoverContent>
              <p>Opened by: {payload?.label}</p>
            </PopoverContent>
          )}
        </Popover>
      </>,
    );

    await user.click(screen.getByText('External Trigger'));

    await waitFor(() => {
      expect(screen.getByText('Opened by: external')).toBeInTheDocument();
    });
  });
});
