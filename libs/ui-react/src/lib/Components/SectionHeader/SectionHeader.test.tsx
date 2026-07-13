import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  SectionHeader,
  SectionHeaderLeading,
  SectionHeaderTitle,
} from './SectionHeader';
import '@testing-library/jest-dom';

describe('SectionHeader', () => {
  it('renders the title', () => {
    render(
      <SectionHeader>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>,
    );
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('renders with card appearance', () => {
    const { container } = render(
      <SectionHeader appearance='card'>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>,
    );
    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-surface');
  });

  it('renders with no-background appearance by default', () => {
    const { container } = render(
      <SectionHeader>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>,
    );
    expect(container.firstChild).not.toHaveClass('bg-surface');
  });

  it('renders leading content when provided', () => {
    render(
      <SectionHeader>
        <SectionHeaderLeading>
          <span data-testid='leading-icon'>icon</span>
        </SectionHeaderLeading>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>,
    );
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('renders all subcomponents together with card appearance', () => {
    const { container } = render(
      <SectionHeader appearance='card'>
        <SectionHeaderLeading>
          <span data-testid='leading-icon'>icon</span>
        </SectionHeaderLeading>
        <SectionHeaderTitle>Accounts</SectionHeaderTitle>
      </SectionHeader>,
    );
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('rounded');
  });
});
