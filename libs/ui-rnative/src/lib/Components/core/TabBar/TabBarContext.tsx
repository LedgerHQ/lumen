import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import type { SharedValue } from 'react-native-reanimated';

export type TabBarContextValue = {
  active?: string;
  onTabPress: (value: string) => void;
  densityProgress: SharedValue<number>;
  labelOpacity: SharedValue<number>;
};

const [TabBarContextProvider, _useTabBarSafeContext] =
  createSafeContext<TabBarContextValue>('TabBar');

export const useTabBarContext = () =>
  _useTabBarSafeContext({
    consumerName: 'TabBarItem',
    contextRequired: true,
  });

export { TabBarContextProvider };
