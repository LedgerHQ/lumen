import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectSearch,
  SelectTrigger,
  SelectTriggerButton,
} from './Select';

const options = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
];

describe('Select', () => {
  it('renders with floating label', () => {
    render(
      <Select items={options}>
        <SelectTrigger label='Choose an option' />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    render(
      <Select items={options}>
        <SelectTrigger />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(
      <Select items={options} disabled>
        <SelectTrigger label='Choose an option' />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });

  it('works with default value', () => {
    render(
      <Select items={options} defaultValue='opt2'>
        <SelectTrigger label='Choose an option' />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onValueChange when a value is selected', () => {
    const handleChange = vi.fn();

    render(
      <Select items={options} onValueChange={handleChange}>
        <SelectTrigger label='Label' />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Option 1'));

    expect(handleChange).toHaveBeenCalledWith('opt1');
  });

  it('reflects controlled value changes', () => {
    const { rerender } = render(
      <Select items={options} value='opt1'>
        <SelectTrigger label='Label' />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();

    rerender(
      <Select items={options} value='opt2'>
        <SelectTrigger label='Label' />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});

describe('SelectTrigger render prop', () => {
  it('renders custom trigger via render prop', () => {
    render(
      <Select items={options}>
        <SelectTrigger
          render={() => <button data-testid='custom-trigger'>Custom</button>}
        />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
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
      <Select items={options} defaultValue='opt1'>
        <SelectTrigger render={renderSpy} />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    expect(renderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedValue: 'opt1',
        selectedContent: expect.anything(),
      }),
    );
  });

  it('provides null as selectedValue when nothing is selected', () => {
    const renderSpy = vi.fn(() => <button>Trigger</button>);

    render(
      <Select items={options}>
        <SelectTrigger render={renderSpy} />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    expect(renderSpy).toHaveBeenCalledWith(
      expect.objectContaining({ selectedValue: null }),
    );
  });
});

describe('SelectTriggerButton', () => {
  it('renders the label when no value is selected', () => {
    render(
      <Select items={options}>
        <SelectTrigger
          render={(renderProps) => (
            <SelectTriggerButton {...renderProps} label='Pick one' />
          )}
        />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('renders selected content when a value is selected', () => {
    render(
      <Select items={options} defaultValue='opt1'>
        <SelectTrigger
          render={(renderProps) => (
            <SelectTriggerButton {...renderProps} label='Pick one' />
          )}
        />
        <SelectContent>
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Pick one')).not.toBeInTheDocument();
  });
});

describe('SelectSearch', () => {
  it('renders a search input with the given placeholder', () => {
    render(
      <Select items={options}>
        <SelectTrigger label='Label' />
        <SelectContent>
          <SelectSearch placeholder='Find option' />
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByPlaceholderText('Find option')).toBeInTheDocument();
  });

  it('uses default placeholder when none is provided', () => {
    render(
      <Select items={options}>
        <SelectTrigger label='Label' />
        <SelectContent>
          <SelectSearch />
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('filters items when typing in search', () => {
    render(
      <Select items={options}>
        <SelectTrigger label='Label' />
        <SelectContent>
          <SelectSearch placeholder='Search' />
          <SelectList>
            {(item) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          </SelectList>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole('combobox'));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Option 1' } });

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
  });
});
