import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
} from './Select';
import { SelectButtonTrigger } from './SelectButtonTrigger';

describe('Select', () => {
  it('renders with floating label', () => {
    render(
      <Select>
        <SelectTrigger label='Choose an option' />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    render(
      <Select>
        <SelectTrigger label='Choose an option' />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(
      <Select disabled>
        <SelectTrigger label='Choose an option' />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });

  it('works with default value', () => {
    render(
      <Select defaultValue='option2'>
        <SelectTrigger label='Choose an option' />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
          <SelectItem value='option2'>
            <SelectItemText>Option 2</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onValueChange when a value is selected', () => {
    const handleChange = vi.fn();

    render(
      <Select onValueChange={handleChange}>
        <SelectTrigger label='Label' />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Option 1'));

    expect(handleChange).toHaveBeenCalledWith('option1');
  });

  it('reflects controlled value changes', () => {
    const { rerender } = render(
      <Select value='option1'>
        <SelectTrigger label='Label' />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
          <SelectItem value='option2'>
            <SelectItemText>Option 2</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();

    rerender(
      <Select value='option2'>
        <SelectTrigger label='Label' />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
          <SelectItem value='option2'>
            <SelectItemText>Option 2</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});

describe('SelectTrigger render prop', () => {
  it('renders custom trigger via render prop', () => {
    render(
      <Select>
        <SelectTrigger
          render={() => <button data-testid='custom-trigger'>Custom</button>}
        />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
  });

  it('passes selectedValue and selectedContent to render', () => {
    const renderSpy = vi.fn(({ selectedValue }) => (
      <button data-testid='custom-trigger'>
        {selectedValue || 'No selection'}
      </button>
    ));

    render(
      <Select defaultValue='option1'>
        <SelectTrigger render={renderSpy} />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(renderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedValue: 'option1',
        selectedContent: expect.anything(),
      }),
    );
  });

  it('provides empty string as selectedValue when nothing is selected', () => {
    const renderSpy = vi.fn(() => <button>Trigger</button>);

    render(
      <Select>
        <SelectTrigger render={renderSpy} />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(renderSpy).toHaveBeenCalledWith(
      expect.objectContaining({ selectedValue: '' }),
    );
  });
});

describe('SelectButtonTrigger', () => {
  it('renders the label when no value is selected', () => {
    render(
      <Select>
        <SelectTrigger
          render={(renderProps) => (
            <SelectButtonTrigger {...renderProps} label='Pick one' />
          )}
        />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('renders selected content when a value is selected', () => {
    render(
      <Select defaultValue='option1'>
        <SelectTrigger
          render={(renderProps) => (
            <SelectButtonTrigger {...renderProps} label='Pick one' />
          )}
        />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Pick one')).not.toBeInTheDocument();
  });
});
