import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import {
  DescriptionItem,
  DescriptionItemLabel,
  DescriptionItemLeading,
  DescriptionItemTrailing,
  DescriptionItemValue,
} from './DescriptionItem';

const BaseItem = ({ size }: { size?: 'sm' | 'md' }) => (
  <DescriptionItem size={size}>
    <DescriptionItemLeading>
      <DescriptionItemLabel>Label</DescriptionItemLabel>
    </DescriptionItemLeading>
    <DescriptionItemTrailing>
      <DescriptionItemValue>Value</DescriptionItemValue>
    </DescriptionItemTrailing>
  </DescriptionItem>
);

describe('DescriptionItem', () => {
  it('renders children', () => {
    render(<BaseItem />);
    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('forwards extra props to the root div', () => {
    render(
      <DescriptionItem data-testid='description-item'>
        <DescriptionItemLeading>
          <DescriptionItemLabel>Label</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>Value</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>,
    );
    expect(screen.getByTestId('description-item')).toBeInTheDocument();
  });

  describe('DescriptionItemLabel', () => {
    it('applies body-2 class for md size', () => {
      render(<BaseItem size='md' />);
      expect(screen.getByText('Label')).toHaveClass('body-2');
    });

    it('applies body-3 class for sm size', () => {
      render(<BaseItem size='sm' />);
      expect(screen.getByText('Label')).toHaveClass('body-3');
    });

    it('defaults to md (body-2) when no size is provided', () => {
      render(<BaseItem />);
      expect(screen.getByText('Label')).toHaveClass('body-2');
    });
  });

  describe('DescriptionItemValue', () => {
    it('applies body-2-semi-bold class for md size', () => {
      render(<BaseItem size='md' />);
      expect(screen.getByText('Value')).toHaveClass('body-2-semi-bold');
    });

    it('applies body-3-semi-bold class for sm size', () => {
      render(<BaseItem size='sm' />);
      expect(screen.getByText('Value')).toHaveClass('body-3-semi-bold');
    });

    it('defaults to md (body-2-semi-bold) when no size is provided', () => {
      render(<BaseItem />);
      expect(screen.getByText('Value')).toHaveClass('body-2-semi-bold');
    });
  });
});
