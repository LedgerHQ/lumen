import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  DescriptionItem,
  DescriptionItemLabel,
  DescriptionItemLeading,
  DescriptionItemTrailing,
  DescriptionItemValue,
} from './DescriptionItem';
import type { DescriptionItemProps, DescriptionItemSize } from './types';

const typographyTokens = ledgerLiveThemes.dark.typographies.sm;
const typographies = {
  ...typographyTokens.heading,
  ...typographyTokens.body,
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const renderDescriptionItem = (props: Partial<DescriptionItemProps> = {}) =>
  render(
    <TestWrapper>
      <DescriptionItem testID='description-item' {...props}>
        <DescriptionItemLeading testID='leading'>
          <DescriptionItemLabel>Label</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing testID='trailing'>
          <DescriptionItemValue>Value</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>
    </TestWrapper>,
  );

describe('DescriptionItem', () => {
  describe('Rendering', () => {
    it('renders label and value', () => {
      renderDescriptionItem();

      expect(screen.getByText('Label')).toBeTruthy();
      expect(screen.getByText('Value')).toBeTruthy();
    });

    it('forwards testID to sub-components', () => {
      renderDescriptionItem();

      expect(screen.getByTestId('description-item')).toBeTruthy();
      expect(screen.getByTestId('leading')).toBeTruthy();
      expect(screen.getByTestId('trailing')).toBeTruthy();
    });
  });

  describe('DescriptionItemLabel', () => {
    it.each([
      ['md', typographies.body2],
      ['sm', typographies.body3],
    ])('applies %s size typography', (size, expectedTypography) => {
      renderDescriptionItem({ size: size as DescriptionItemSize });

      const labelStyle = screen.getByText('Label').props.style;
      expect(labelStyle.fontSize).toBe(expectedTypography.fontSize);
      expect(labelStyle.fontWeight).toBe(expectedTypography.fontWeight);
    });

    it('defaults to md typography when no size is provided', () => {
      renderDescriptionItem();

      const labelStyle = screen.getByText('Label').props.style;
      expect(labelStyle.fontSize).toBe(typographies.body2.fontSize);
      expect(labelStyle.fontWeight).toBe(typographies.body2.fontWeight);
    });

    it('truncates label to two lines by default', () => {
      renderDescriptionItem();

      expect(screen.getByText('Label').props.numberOfLines).toBe(2);
    });
  });

  describe('DescriptionItemValue', () => {
    it.each([
      ['md', typographies.body2SemiBold],
      ['sm', typographies.body3SemiBold],
    ])('applies %s size typography', (size, expectedTypography) => {
      renderDescriptionItem({ size: size as DescriptionItemSize });

      const valueStyle = screen.getByText('Value').props.style;
      expect(valueStyle.fontSize).toBe(expectedTypography.fontSize);
      expect(valueStyle.fontWeight).toBe(expectedTypography.fontWeight);
    });

    it('defaults to md typography when no size is provided', () => {
      renderDescriptionItem();

      const valueStyle = screen.getByText('Value').props.style;
      expect(valueStyle.fontSize).toBe(typographies.body2SemiBold.fontSize);
      expect(valueStyle.fontWeight).toBe(typographies.body2SemiBold.fontWeight);
    });

    it('truncates value to one line by default', () => {
      renderDescriptionItem();

      expect(screen.getByText('Value').props.numberOfLines).toBe(1);
    });
  });
});
