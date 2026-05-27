import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { Settings, Plus } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { InteractiveIcon } from './InteractiveIcon';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('InteractiveIcon Component', () => {
  it('should render correctly with icon prop', () => {
    renderWithProvider(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        accessibilityLabel='Settings'
        testID='icon-button'
      />,
    );
    const buttonElement = screen.getByTestId('icon-button');
    expect(buttonElement).toBeTruthy();
  });

  it('should render with filled iconType variant', () => {
    renderWithProvider(
      <InteractiveIcon
        iconType='filled'
        icon={Plus}
        accessibilityLabel='Add item'
        testID='filled-icon'
      />,
    );
    const buttonElement = screen.getByTestId('filled-icon');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.props.accessibilityRole).toBe('button');
  });

  it('should render with stroked iconType variant', () => {
    renderWithProvider(
      <InteractiveIcon
        iconType='stroked'
        icon={Settings}
        accessibilityLabel='Settings'
        testID='stroked-icon'
      />,
    );
    const buttonElement = screen.getByTestId('stroked-icon');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.props.accessibilityRole).toBe('button');
  });

  it('should have correct accessibility label', () => {
    renderWithProvider(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        accessibilityLabel='Open menu'
        testID='menu-icon'
      />,
    );
    const buttonElement = screen.getByTestId('menu-icon');
    expect(buttonElement.props.accessibilityLabel).toBe('Open menu');
  });

  it('should be disabled when the disabled prop is true', () => {
    renderWithProvider(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        accessibilityLabel='Disabled button'
        disabled
        testID='disabled-icon'
      />,
    );
    const buttonElement = screen.getByTestId('disabled-icon');
    expect(buttonElement.props.accessibilityState.disabled).toBe(true);
  });

  it('should call the onPress handler when pressed', () => {
    const handlePress = jest.fn();
    renderWithProvider(
      <InteractiveIcon
        iconType='filled'
        icon={Plus}
        accessibilityLabel='Pressable'
        onPress={handlePress}
        testID='pressable-icon'
      />,
    );

    const buttonElement = screen.getByTestId('pressable-icon');
    fireEvent.press(buttonElement);

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('should not call the onPress handler when disabled', () => {
    const handlePress = jest.fn();
    renderWithProvider(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        accessibilityLabel='Disabled'
        onPress={handlePress}
        disabled
        testID='disabled-pressable'
      />,
    );

    const buttonElement = screen.getByTestId('disabled-pressable');
    fireEvent.press(buttonElement);

    expect(handlePress).not.toHaveBeenCalled();
  });

  it('should call the onLongPress handler when long pressed', () => {
    const handleLongPress = jest.fn();
    renderWithProvider(
      <InteractiveIcon
        iconType='stroked'
        icon={Plus}
        accessibilityLabel='Long pressable'
        onLongPress={handleLongPress}
        testID='long-pressable-icon'
      />,
    );

    const buttonElement = screen.getByTestId('long-pressable-icon');
    fireEvent(buttonElement, 'onLongPress');

    expect(handleLongPress).toHaveBeenCalledTimes(1);
  });

  it('should apply custom style', () => {
    const customStyle = { marginTop: 8 };
    renderWithProvider(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        accessibilityLabel='Custom'
        style={customStyle}
        testID='custom-icon'
      />,
    );
    const buttonElement = screen.getByTestId('custom-icon');
    expect(buttonElement.props.style).toMatchObject(customStyle);
  });

  it('should render with custom size', () => {
    renderWithProvider(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        size={24}
        accessibilityLabel='Custom size'
        testID='custom-size-icon'
      />,
    );
    const buttonElement = screen.getByTestId('custom-size-icon');
    expect(buttonElement).toBeTruthy();
  });
});
