import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { Button } from '../Button/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from './Dialog';

describe('Dialog', () => {
  it('renders trigger element', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens dialog on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogBody>
            <p>Dialog Content</p>
          </DialogBody>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open Dialog'));

    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <p>Controlled Content</p>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByText('Controlled Content')).not.toBeInTheDocument();

    rerender(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <p>Controlled Content</p>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Controlled Content')).toBeInTheDocument();
  });

  it('applies fit height variant by default (max-h-560)', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <p>Fit Height Content</p>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open Dialog'));

    const content = document.querySelector('[data-slot="dialog-content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('max-h-560');
    expect(content).not.toHaveClass('h-560');
  });

  it('applies fixed height variant (h-560)', async () => {
    const user = userEvent.setup();
    render(
      <Dialog height='fixed'>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <p>Fixed Height Content</p>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open Dialog'));

    const content = document.querySelector('[data-slot="dialog-content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('h-560');
    expect(content).not.toHaveClass('max-h-560');
  });

  describe('animated', () => {
    let notifyResize: () => void;
    let animate: ReturnType<typeof vi.fn>;
    let offsetHeight: ReturnType<typeof vi.spyOn>;
    let animations: { onfinish?: () => void; cancel: () => void }[];

    beforeEach(() => {
      animations = [];
      notifyResize = () => undefined;
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(callback: () => void) {
            notifyResize = callback;
          }
          observe = vi.fn();
          disconnect = vi.fn();
        },
      );
      animate = vi.fn(() => {
        const animation = { cancel: vi.fn() };
        animations.push(animation);
        return animation;
      });
      HTMLElement.prototype.animate = animate as never;
      offsetHeight = vi
        .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
        .mockReturnValue(200);
    });

    afterEach(() => {
      offsetHeight.mockRestore();
      vi.unstubAllGlobals();
      // @ts-expect-error restore jsdom's lack of Element.animate
      delete HTMLElement.prototype.animate;
    });

    const renderDialog = async (
      props: { animated?: boolean; height?: 'fit' | 'fixed' } = {},
      bodyClassName?: string,
    ) => {
      const user = userEvent.setup();
      render(
        <Dialog {...props}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogBody className={bodyClassName}>
              <p>Animated Content</p>
            </DialogBody>
          </DialogContent>
        </Dialog>,
      );
      await user.click(screen.getByText('Open Dialog'));
      return document.querySelector<HTMLElement>('[data-slot="dialog-body"]');
    };

    it('animates the body height from the previous to the new size', async () => {
      await renderDialog({ animated: true });
      act(() => notifyResize());
      expect(animate).not.toHaveBeenCalled();

      offsetHeight.mockReturnValue(320);
      act(() => notifyResize());

      expect(animate).toHaveBeenCalledTimes(1);
      expect(animate.mock.calls[0][0]).toMatchObject({
        height: ['200px', '320px'],
      });
    });

    it('ignores resizes caused by its own animation', async () => {
      await renderDialog({ animated: true });
      act(() => notifyResize());

      offsetHeight.mockReturnValue(320);
      act(() => notifyResize());
      offsetHeight.mockReturnValue(260);
      act(() => notifyResize());

      expect(animate).toHaveBeenCalledTimes(1);
    });

    it('animates again once the previous animation has finished', async () => {
      await renderDialog({ animated: true });
      act(() => notifyResize());

      offsetHeight.mockReturnValue(320);
      act(() => notifyResize());
      act(() => animations[0].onfinish?.());
      offsetHeight.mockReturnValue(100);
      act(() => notifyResize());

      expect(animate).toHaveBeenCalledTimes(2);
      expect(animate.mock.calls[1][0]).toMatchObject({
        height: ['320px', '100px'],
      });
    });

    it('animates from the settled height when content changed mid-animation', async () => {
      await renderDialog({ animated: true });
      act(() => notifyResize());

      offsetHeight.mockReturnValue(320);
      act(() => notifyResize());
      offsetHeight.mockReturnValue(260);
      act(() => notifyResize());
      act(() => animations[0].onfinish?.());
      offsetHeight.mockReturnValue(100);
      act(() => notifyResize());

      expect(animate).toHaveBeenCalledTimes(2);
      expect(animate.mock.calls[1][0]).toMatchObject({
        height: ['260px', '100px'],
      });
    });

    it('keeps the children and className directly on the body', async () => {
      const body = await renderDialog({ animated: true }, 'gap-32 pb-0');

      expect(body).toHaveClass('gap-32', 'pb-0');
      expect(body?.firstElementChild?.tagName).toBe('P');
    });

    it('does not animate by default', async () => {
      await renderDialog();
      offsetHeight.mockReturnValue(320);
      act(() => notifyResize());
      expect(animate).not.toHaveBeenCalled();
    });

    it('does not animate with fixed height', async () => {
      await renderDialog({ animated: true, height: 'fixed' });
      offsetHeight.mockReturnValue(320);
      act(() => notifyResize());
      expect(animate).not.toHaveBeenCalled();
    });

    it('does nothing when ResizeObserver is unavailable', async () => {
      vi.stubGlobal('ResizeObserver', undefined);
      await renderDialog({ animated: true });
      expect(animate).not.toHaveBeenCalled();
    });
  });

  it('applies basis-auto to DialogBody in fit mode', async () => {
    const user = userEvent.setup();
    render(
      <Dialog height='fit'>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogBody>
            <p>Body Content</p>
          </DialogBody>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open Dialog'));

    const body = document.querySelector('[data-slot="dialog-body"]');
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass('basis-auto');
  });

  it('applies basis-0 to DialogBody in fixed mode', async () => {
    const user = userEvent.setup();
    render(
      <Dialog height='fixed'>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogBody>
            <p>Body Content</p>
          </DialogBody>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open Dialog'));

    const body = document.querySelector('[data-slot="dialog-body"]');
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass('basis-0');
  });

  it('renders DialogFooter with children', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogBody>
            <p>Content</p>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open Dialog'));

    expect(screen.getByText('Done')).toBeInTheDocument();
    const footer = document.querySelector('[data-slot="dialog-footer"]');
    expect(footer).toBeInTheDocument();
  });

  it('calls onOpenChange when toggling', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open Dialog'));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('renders overlay when open', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open Dialog'));

    expect(
      document.querySelector('[data-slot="dialog-overlay"]'),
    ).toBeInTheDocument();
  });

  it('renders DialogHeader inside DialogContent', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader density='compact' title='Test Title' />
          <DialogBody>
            <p>Content</p>
          </DialogBody>
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByText('Open Dialog'));

    expect(screen.getAllByText('Test Title').length).toBeGreaterThanOrEqual(1);
  });
});
