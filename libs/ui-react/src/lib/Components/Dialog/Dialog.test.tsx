import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
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
