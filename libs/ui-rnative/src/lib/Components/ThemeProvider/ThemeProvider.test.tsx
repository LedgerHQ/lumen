import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from './ThemeProvider';

const themes: any = {
  light: {
    typographies: {
      sm: {},
    },
  },
  dark: {
    typographies: {
      sm: {},
    },
  },
};

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider themes={themes}>
        <Text testID='child'>Hello World</Text>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('child'));
    expect(screen.getByText('Hello World'));
  });
});
