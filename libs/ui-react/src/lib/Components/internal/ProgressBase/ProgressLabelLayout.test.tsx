import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressLabelLayout } from './ProgressLabelLayout';

const Bar = () => <div data-testid='bar' />;

describe('ProgressLabelLayout', () => {
  it('should render the children alone when there is no label', () => {
    const { container } = render(
      <ProgressLabelLayout>
        <Bar />
      </ProgressLabelLayout>,
    );

    expect(container.children).toHaveLength(1);
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });

  it.each([
    ['start-top', 'flex-col', 'items-start'],
    ['start-bottom', 'flex-col-reverse', 'items-start'],
    ['end-top', 'flex-col', 'items-end'],
    ['end-bottom', 'flex-col-reverse', 'items-end'],
  ] as const)(
    'should lay out the %s position with %s and %s',
    (labelPosition, direction, alignment) => {
      const { container } = render(
        <ProgressLabelLayout label='Syncing' labelPosition={labelPosition}>
          <Bar />
        </ProgressLabelLayout>,
      );

      expect(container.firstElementChild).toHaveClass(direction, alignment);
    },
  );

  it('should place the label below the bar by default', () => {
    const { container } = render(
      <ProgressLabelLayout label='Syncing'>
        <Bar />
      </ProgressLabelLayout>,
    );

    expect(container.firstElementChild).toHaveClass('flex-col-reverse');
  });

  it('should align the label text to the end edge for an end position', () => {
    render(
      <ProgressLabelLayout label='Syncing' labelPosition='end-bottom'>
        <Bar />
      </ProgressLabelLayout>,
    );

    expect(screen.getByText('Syncing')).toHaveClass('text-end');
  });

  it('should give the label the provided id', () => {
    render(
      <ProgressLabelLayout label='Syncing' labelId='label-id'>
        <Bar />
      </ProgressLabelLayout>,
    );

    expect(screen.getByText('Syncing')).toHaveAttribute('id', 'label-id');
  });
});
