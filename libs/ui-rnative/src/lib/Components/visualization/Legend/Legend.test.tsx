import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render, within } from '@testing-library/react-native';

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
    const { getAllByRole } = renderWithTheme(<Legend series={sampleItems} />);

    const items = getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(
      items.map((item) => within(item).getByText(/.+/).props.children),
    ).toEqual(['Bitcoin', 'Ethereum', 'Tether']);
  });

  it('renders nothing when series is empty', () => {
    const { toJSON, queryByLabelText } = renderWithTheme(
      <Legend series={[]} />,
    );
    expect(queryByLabelText('Legend')).toBeNull();
    expect(toJSON()).toBeNull();
  });

  it('falls back to id when label is omitted', () => {
    const { getByText } = renderWithTheme(
      <Legend series={[{ id: 'segment-a' }]} />,
    );
    expect(getByText('segment-a')).toBeTruthy();
  });

  it('truncates a label that does not fit on one line', () => {
    const { getByText } = renderWithTheme(
      <Legend series={[{ id: 'a', label: 'A very long series label' }]} />,
    );
    expect(getByText('A very long series label').props.numberOfLines).toBe(1);
  });

  it('uses the item color on the swatch', () => {
    const { getByTestId } = renderWithTheme(
      <Legend series={[{ id: 'a', label: 'A', color: 'rgb(255, 0, 0)' }]} />,
    );
    expect(getByTestId('legend-swatch').props.style).toEqual(
      expect.objectContaining({ backgroundColor: 'rgb(255, 0, 0)' }),
    );
  });

  it('uses the default swatch color when color is omitted', () => {
    const { getByTestId } = renderWithTheme(
      <Legend series={[{ id: 'a', label: 'A' }]} />,
    );
    expect(getByTestId('legend-swatch').props.style).toEqual(
      expect.objectContaining({
        backgroundColor: ledgerLiveThemes.light.colors.bg.mutedStrong,
      }),
    );
  });

  it('does not expose pressable legend items', () => {
    const { getAllByRole } = renderWithTheme(<Legend series={sampleItems} />);
    getAllByRole('listitem').forEach((item) => {
      expect(item.props.onPress).toBeUndefined();
    });
  });

  it('exposes the legend group with an accessible label', () => {
    const { getByLabelText } = renderWithTheme(
      <Legend series={sampleItems} accessibilityLabel='Portfolio allocation' />,
    );
    expect(getByLabelText('Portfolio allocation')).toBeTruthy();
  });

  it('merges consumer styles into the root', () => {
    const { getByLabelText } = renderWithTheme(
      <Legend series={sampleItems} style={{ maxWidth: 176 }} />,
    );
    expect(getByLabelText('Legend').props.style).toEqual(
      expect.objectContaining({ maxWidth: 176, flexWrap: 'wrap' }),
    );
  });
});
