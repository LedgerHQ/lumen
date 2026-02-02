import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

export type TabBarContextValue = {
  active?: string;
  onTabPress: (value: string) => void;
};

const [TabBarContextProvider, _useTabBarSafeContext] =
  createSafeContext<TabBarContextValue>('TabBar');

export const useTabBarContext = () =>
  _useTabBarSafeContext({
    consumerName: 'TabBarItem',
    contextRequired: true,
  });

export { TabBarContextProvider };
