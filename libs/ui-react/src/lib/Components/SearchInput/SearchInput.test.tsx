import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders with search icon', () => {
    render(<SearchInput placeholder='Search' />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    // Check that the search icon is present (it should be in the DOM as an SVG)
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('displays placeholder correctly', () => {
    render(<SearchInput placeholder='Search products' />);

    const input = screen.getByPlaceholderText('Search products');
    expect(input).toBeInTheDocument();
  });

  it('handles controlled input', () => {
    const handleChange = vi.fn();
    render(
      <SearchInput
        placeholder='Search'
        value='test query'
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test query');

    fireEvent.change(input, { target: { value: 'new query' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows clear button when input has content', () => {
    render(<SearchInput placeholder='Search' defaultValue='some text' />);

    const clearButton = screen.getByLabelText(
      'components.baseInput.clearInputAriaLabel',
    );
    expect(clearButton).toBeInTheDocument();
  });

  it('hides clear button when hideClearButton is true', () => {
    render(
      <SearchInput
        placeholder='Search'
        defaultValue='some text'
        hideClearButton={true}
      />,
    );

    const clearButton = screen.queryByLabelText(
      'components.baseInput.clearInputAriaLabel',
    );
    expect(clearButton).not.toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    const handleClear = vi.fn();
    render(
      <SearchInput
        placeholder='Search'
        defaultValue='test content'
        onClear={handleClear}
      />,
    );

    const clearButton = screen.getByLabelText(
      'components.baseInput.clearInputAriaLabel',
    );
    fireEvent.click(clearButton);

    expect(handleClear).toHaveBeenCalled();
  });

  it('displays helper text when provided with error status', () => {
    render(
      <SearchInput
        placeholder='Search'
        helperText='Search failed'
        status='error'
        aria-invalid={true}
      />,
    );

    const errorMessage = screen.getByText('Search failed');
    expect(errorMessage).toBeInTheDocument();

    // The role="alert" is on the error container, not the text span
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<SearchInput placeholder='Search' disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders with fixed icon styling', () => {
    const { container } = render(<SearchInput placeholder='Search' />);

    // The search icon should have fixed styling
    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveClass('text-muted');
  });
});
