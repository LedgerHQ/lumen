import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { MediaTag } from './MediaTag';

describe('MediaTag', () => {
  it('should render the label and the provided ReactNode leadingContent as-is', () => {
    render(
      <MediaTag
        label='Bitcoin'
        leadingContent={<span data-testid='media-icon'>bitcoin-icon</span>}
      />,
    );
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByTestId('media-icon')).toBeInTheDocument();
    expect(screen.getByText('bitcoin-icon')).toBeInTheDocument();
  });
});
