import type { TabBarDensity } from '@ledgerhq/lumen-ui-rnative';
import {
  Box,
  createTabBar,
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemLeading,
  ListItemTitle,
  Spot,
  TAB_BAR_HEIGHT,
} from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import {
  Home,
  HomeFill,
  CreditCard,
  CreditCardFill,
  Exchange,
  ExchangeFill,
  LifeRing,
  LifeRingFill,
  Wallet,
} from '@ledgerhq/lumen-ui-rnative/symbols';
import { useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Route = 'home' | 'swap' | 'card' | 'help';

const { TabBar, TabBarItem } = createTabBar<Route>();

const SCROLL_DIRECTION_THRESHOLD = 8;

const ITEMS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function ExampleTabBar() {
  const [active, setActive] = useState<Route>('home');
  const [density, setDensity] = useState<TabBarDensity>('expanded');
  const lastOffsetY = useRef(0);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const offsetY = contentOffset.y;
    const maxOffsetY = contentSize.height - layoutMeasurement.height;

    if (offsetY <= 0) {
      lastOffsetY.current = 0;
      setDensity('expanded');
      return;
    }
    if (offsetY >= maxOffsetY) {
      lastOffsetY.current = maxOffsetY;
      return;
    }

    const delta = offsetY - lastOffsetY.current;
    if (Math.abs(delta) < SCROLL_DIRECTION_THRESHOLD) {
      return;
    }

    lastOffsetY.current = offsetY;
    setDensity(delta > 0 ? 'compact' : 'expanded');
  };

  return (
    <Box lx={{ flex: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          gap: theme.spacings.s8,
          paddingHorizontal: theme.spacings.s16,
          paddingTop: theme.spacings.s16,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + theme.spacings.s32,
        }}
      >
        {ITEMS.map((item) => (
          <ListItem key={item}>
            <ListItemLeading>
              <Spot size={48} icon={Wallet} />
              <ListItemContent>
                <ListItemTitle>Account {item}</ListItemTitle>
                <ListItemDescription>Scroll to collapse</ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
          </ListItem>
        ))}
      </ScrollView>
      <Box
        lx={{
          position: 'absolute',
          bottom: 's20',
          width: 'full',
          paddingHorizontal: 's24',
        }}
        style={{ marginBottom: insets.bottom }}
      >
        <TabBar active={active} onTabPress={setActive} density={density}>
          <TabBarItem
            value='home'
            label='Home'
            icon={Home}
            activeIcon={HomeFill}
          />
          <TabBarItem
            value='swap'
            label='Swap'
            icon={Exchange}
            activeIcon={ExchangeFill}
          />
          <TabBarItem
            value='card'
            label='Card'
            icon={CreditCard}
            activeIcon={CreditCardFill}
          />
          <TabBarItem
            value='help'
            label='Help'
            icon={LifeRing}
            activeIcon={LifeRingFill}
          />
        </TabBar>
      </Box>
    </Box>
  );
}
