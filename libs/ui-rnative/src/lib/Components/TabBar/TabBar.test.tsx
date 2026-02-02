import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { HomeFill, Settings, BasketPutIn } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { TabBar, TabBarItem } from './TabBar';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('TabBar', () => {
  it('should render tab items with labels', () => {
    const onTabPress = jest.fn();
    const { getByText } = renderWithProvider(
      <TabBar active='home' onTabPress={onTabPress}>
        <TabBarItem value='home' label='Home' icon={HomeFill} />
        <TabBarItem value='settings' label='Settings' icon={Settings} />
      </TabBar>,
    );

    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('should call onTabPress when tab is pressed', () => {
    const onTabPress = jest.fn();
    const { getByText } = renderWithProvider(
      <TabBar active='home' onTabPress={onTabPress}>
        <TabBarItem value='home' label='Home' icon={HomeFill} />
        <TabBarItem value='settings' label='Settings' icon={Settings} />
      </TabBar>,
    );

    fireEvent.press(getByText('Settings'));
    expect(onTabPress).toHaveBeenCalledWith('settings');
  });

  it('should fallback to value when label is not provided', () => {
    const onTabPress = jest.fn();
    const { getByText } = renderWithProvider(
      <TabBar active='tab1' onTabPress={onTabPress}>
        <TabBarItem value='tab1' icon={HomeFill} />
        <TabBarItem value='tab2' icon={Settings} />
      </TabBar>,
    );

    expect(getByText('tab1')).toBeTruthy();
    expect(getByText('tab2')).toBeTruthy();
  });

  it('should render multiple tabs correctly', () => {
    const onTabPress = jest.fn();
    const { getByText } = renderWithProvider(
      <TabBar active='home' onTabPress={onTabPress}>
        <TabBarItem value='home' label='Home' icon={HomeFill} />
        <TabBarItem value='shop' label='Shop' icon={BasketPutIn} />
        <TabBarItem value='settings' label='Settings' icon={Settings} />
      </TabBar>,
    );

    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Shop')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });
});
