import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { HomeFill, Settings, BasketPutIn } from '../../symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { TabBar, TabBarItem, createTabBar } from './TabBar';

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

  describe('density', () => {
    const renderTabBar = (
      density: 'compact' | 'expanded',
      onTabPress = jest.fn(),
    ) => (
      <TabBar active='home' onTabPress={onTabPress} density={density}>
        <TabBarItem value='home' label='Home' icon={HomeFill} />
        <TabBarItem value='settings' label='Settings' icon={Settings} />
      </TabBar>
    );

    const getLabelWrapper = (text: ReturnType<typeof screen.getByText>) =>
      text.parent?.parent;

    it('hides labels but keeps tabs named, selected and pressable when compact', () => {
      const onTabPress = jest.fn();
      renderWithProvider(renderTabBar('compact', onTabPress));

      expect(getLabelWrapper(screen.getByText('Home'))).toHaveStyle({
        opacity: 0,
      });
      expect(screen.getByRole('tab', { name: 'Home' })).toBeSelected();

      fireEvent.press(screen.getByRole('tab', { name: 'Settings' }));
      expect(onTabPress).toHaveBeenCalledWith('settings');
    });

    it('shows labels again when switching back to expanded', () => {
      const { rerender } = renderWithProvider(renderTabBar('expanded'));
      expect(getLabelWrapper(screen.getByText('Home'))).toHaveStyle({
        opacity: 1,
      });

      rerender(
        <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
          {renderTabBar('compact')}
        </ThemeProvider>,
      );
      expect(getLabelWrapper(screen.getByText('Home'))).toHaveStyle({
        opacity: 0,
      });

      rerender(
        <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
          {renderTabBar('expanded')}
        </ThemeProvider>,
      );
      expect(getLabelWrapper(screen.getByText('Home'))).toHaveStyle({
        opacity: 1,
      });
      expect(screen.getByRole('tab', { name: 'Settings' })).toBeTruthy();
    });
  });

  describe('createTabBar', () => {
    it('returns typed components that render and respond to presses', () => {
      const { TabBar: TypedTabBar, TabBarItem: TypedItem } = createTabBar<
        'home' | 'settings'
      >();
      const onTabPress = jest.fn();

      const { getByText } = renderWithProvider(
        <TypedTabBar active='home' onTabPress={onTabPress}>
          <TypedItem value='home' label='Home' icon={HomeFill} />
          <TypedItem value='settings' label='Settings' icon={Settings} />
        </TypedTabBar>,
      );

      expect(getByText('Home')).toBeTruthy();

      fireEvent.press(getByText('Settings'));

      expect(onTabPress).toHaveBeenCalledWith('settings');
    });
  });
});
