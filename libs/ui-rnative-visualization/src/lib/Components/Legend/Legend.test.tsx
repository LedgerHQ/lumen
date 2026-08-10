import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';

import { Legend } from './Legend';

const sampleItems = [
  { id: 'bitcoin', label: 'Bitcoin', color: '#F7931A' },
  { id: 'ethereum', label: 'Ethereum', color: '#627EEA' },
  { id: 'tether', label: 'Tether', color: '#26A17B' },
];

const renderWithTheme = (children: React.ReactNode) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      {children}
    </ThemeProvider>,
  );

describe('Legend', () => {
  it('renders one item per entry in order', () => {
    const { getAllByTestId } = renderWithTheme(<Legend items={sampleItems} />);

    const items = getAllByTestId('legend-item');
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.props.nativeID)).toEqual([
      'bitcoin',
      'ethereum',
      'tether',
    ]);
  });

  it('renders nothing when items is empty', () => {
    const { toJSON, queryByTestId } = renderWithTheme(<Legend items={[]} />);
    expect(queryByTestId('legend')).toBeNull();
    expect(toJSON()).toBeNull();
  });

  it('falls back to id when label is omitted', () => {
    const { getByText } = renderWithTheme(
      <Legend items={[{ id: 'segment-a' }]} />,
    );
    expect(getByText('segment-a')).toBeTruthy();
  });

  it('uses the item color on the swatch', () => {
    const { getByTestId } = renderWithTheme(
      <Legend items={[{ id: 'a', label: 'A', color: 'rgb(255, 0, 0)' }]} />,
    );
    expect(getByTestId('legend-swatch').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: 'rgb(255, 0, 0)' }),
      ]),
    );
  });

  it('uses the default swatch color when color is omitted', () => {
    const { getByTestId } = renderWithTheme(
      <Legend items={[{ id: 'a', label: 'A' }]} />,
    );
    expect(getByTestId('legend-swatch').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: ledgerLiveThemes.light.colors.bg.mutedStrong,
        }),
      ]),
    );
  });

  it('does not expose pressable legend items', () => {
    const { getAllByTestId } = renderWithTheme(<Legend items={sampleItems} />);
    getAllByTestId('legend-item').forEach((item) => {
      expect(item.props.onPress).toBeUndefined();
      expect(item.props.accessibilityRole).not.toBe('button');
    });
  });

  it('exposes the legend group with an accessible label', () => {
    const { getByLabelText } = renderWithTheme(
      <Legend items={sampleItems} accessibilityLabel='Portfolio allocation' />,
    );
    expect(getByLabelText('Portfolio allocation')).toBeTruthy();
  });
});
