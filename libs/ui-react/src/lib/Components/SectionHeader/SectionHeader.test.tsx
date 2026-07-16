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

  it('renders with plain appearance', () => {
    const { container } = render(
      <SectionHeader appearance='plain'>
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

  it('renders all subcomponents together with plain appearance', () => {
    const { container } = render(
      <SectionHeader appearance='plain'>
        <SectionHeaderLeading>
          <span data-testid='leading-icon'>icon</span>
        </SectionHeaderLeading>
        <SectionHeaderTitle>Accounts</SectionHeaderTitle>
      </SectionHeader>,
    );
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('rounded-xs');
  });

  it('truncates long titles', () => {
    render(
      <div className='w-80'>
        <SectionHeader>
          <SectionHeaderLeading>
            <span data-testid='leading-icon'>icon</span>
          </SectionHeaderLeading>
          <SectionHeaderTitle>
            Very long section header label that should truncate
          </SectionHeaderTitle>
        </SectionHeader>
      </div>,
    );

    expect(screen.getByText(/Very long section header label/)).toHaveClass(
      'truncate',
    );
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
  });
});
