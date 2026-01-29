import React from 'react';
import { Box, Pressable, Text } from '../../src/lib/Components/Utility';
import { Folder } from '../../src/lib/Symbols/Icons/Folder';

type TabProps = {
  label: string;
  children: React.ReactNode;
};

type CustomTabsProps = {
  children: React.ReactNode;
};

export const CustomTabs = ({ children }: CustomTabsProps) => {
  const [active, setActive] = React.useState<number>(0);

  // Extract Tab components from children
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> =>
      React.isValidElement(child) && child.type === Tab,
  );

  if (tabs.length === 0) {
    return (
      <Text typography='body3' lx={{ color: 'muted' }}>
        No tabs found
      </Text>
    );
  }

  return (
    <Box style={{ maxWidth: '100%' }}>
      {/* Tab buttons */}
      <Box lx={{ flexDirection: 'row', gap: 's24', marginBottom: 's24' }}>
        {tabs.map((tab, idx) => {
          const isActive = active === idx;
          return (
            <Pressable
              key={idx}
              lx={{
                alignItems: 'center',
                gap: 's8',
                borderRadius: 'lg',
                padding: 's12',
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              onPress={() => setActive(idx)}
            >
              {/* Folder Icon */}
              <Box
                lx={{
                  borderRadius: 'lg',
                  padding: 's8',
                  ...(isActive && { backgroundColor: 'accent' }),
                }}
              >
                <Folder size={24} />
              </Box>

              {/* Label */}
              <Text
                typography='body3'
                lx={{ color: isActive ? 'base' : 'muted' }}
              >
                {tab.props.label}
              </Text>
            </Pressable>
          );
        })}
      </Box>

      {/* Tab content */}
      <Box lx={{ padding: 's24' }}>
        {tabs.map((tab, idx) => {
          if (idx !== active) return null;
          return <Box key={idx}>{tab.props.children}</Box>;
        })}
      </Box>
    </Box>
  );
};

export const Tab = ({ children }: TabProps) => {
  return <Box>{children}</Box>;
};
