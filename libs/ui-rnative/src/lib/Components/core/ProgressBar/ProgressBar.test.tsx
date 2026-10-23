import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { ProgressBar } from './ProgressBar';
import type { ProgressAppearance, ProgressLabelPosition } from './types';

const { colors } = ledgerLiveThemes.dark;

const renderWithProvider = (component: React.ReactElement) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );

const getFill = () => {
  const bar = screen.getByLabelText('Upload');
  const fill = bar.children[0];
  if (typeof fill === 'string') throw new Error('fill not found');
  return StyleSheet.flatten(fill.props.style);
};

const appearanceCases: [ProgressAppearance, string][] = [
  ['accent', colors.bg.accent],
  ['success', colors.bg.successStrong],
  ['error', colors.bg.errorStrong],
  ['warning', colors.bg.warningStrong],
  ['decorative-purple', colors.bg.decorativePurple],
  ['decorative-turquoise', colors.bg.decorativeTurquoise],
];

const positionCases: [
  ProgressLabelPosition,
  ViewStyle['flexDirection'],
  ViewStyle['alignItems'],
][] = [
  ['start-top', 'column', 'flex-start'],
  ['start-bottom', 'column-reverse', 'flex-start'],
  ['end-top', 'column', 'flex-end'],
  ['end-bottom', 'column-reverse', 'flex-end'],
];

describe('ProgressBar', () => {
  it('should expose the progressbar role with the value range', () => {
    renderWithProvider(<ProgressBar value={40} accessibilityLabel='Upload' />);

    const bar = screen.getByLabelText('Upload');
    expect(bar.props.accessibilityRole).toBe('progressbar');
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 40 });
  });

  it('should clamp values outside the range', () => {
    const { rerender } = renderWithProvider(
      <ProgressBar value={-5} accessibilityLabel='Upload' />,
    );
    expect(screen.getByLabelText('Upload').props.accessibilityValue.now).toBe(
      0,
    );

    rerender(
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
        <ProgressBar value={140} accessibilityLabel='Upload' />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText('Upload').props.accessibilityValue.now).toBe(
      100,
    );
  });

  it('should size the fill from the value', () => {
    renderWithProvider(<ProgressBar value={25} accessibilityLabel='Upload' />);

    expect(getFill().width).toBe('25%');
  });

  it('should use the base appearance by default', () => {
    renderWithProvider(<ProgressBar value={50} accessibilityLabel='Upload' />);

    expect(getFill().backgroundColor).toBe(colors.bg.interactive);
  });

  it.each(appearanceCases)(
    'should apply the %s appearance',
    (appearance, expected) => {
      renderWithProvider(
        <ProgressBar
          value={50}
          appearance={appearance}
          accessibilityLabel='Upload'
        />,
      );

      expect(getFill().backgroundColor).toBe(expected);
    },
  );

  it('should render the label when label is provided', () => {
    renderWithProvider(
      <ProgressBar
        value={50}
        accessibilityLabel='Upload'
        label='Syncing accounts'
      />,
    );

    expect(screen.getByText('Syncing accounts')).toBeTruthy();
  });

  it('should not render a label by default', () => {
    renderWithProvider(<ProgressBar value={50} accessibilityLabel='Upload' />);

    expect(screen.toJSON()).toMatchObject({
      props: { accessibilityRole: 'progressbar' },
    });
  });

  it.each(positionCases)(
    'should lay out the %s position as %s aligned to %s',
    (labelPosition, direction, alignment) => {
      renderWithProvider(
        <ProgressBar
          value={50}
          accessibilityLabel='Upload'
          label='Syncing'
          labelPosition={labelPosition}
        />,
      );

      const tree = screen.toJSON() as { props: { style: ViewStyle } };
      const layout = StyleSheet.flatten(tree.props.style);
      expect(layout.flexDirection).toBe(direction);
      expect(layout.alignItems).toBe(alignment);
    },
  );

  it('should place the label below the bar by default', () => {
    renderWithProvider(
      <ProgressBar value={50} accessibilityLabel='Upload' label='Syncing' />,
    );

    const tree = screen.toJSON() as { props: { style: ViewStyle } };
    expect(StyleSheet.flatten(tree.props.style).flexDirection).toBe(
      'column-reverse',
    );
  });
});
