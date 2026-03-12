import React from 'react';
import {
  SegmentedControl,
  SegmentedControlButton,
} from '../../src/lib/Components/SegmentedControl';
import { Box, Text } from '../../src/lib/Components/Utility';

type TabProps = {
  label: string;
  children: React.ReactNode;
};

type CustomTabsProps = {
  children: React.ReactNode;
};

export const CustomTabs = ({ children }: CustomTabsProps) => {
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> =>
      React.isValidElement(child) && child.type === Tab,
  );

  const [activeLabel, setActiveLabel] = React.useState<string>(
    tabs[0]?.props.label ?? '',
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
      <Box
        lx={{
          paddingVertical: 's12',
          alignItems: 'flex-start' as any,
          position: 'sticky' as any,
          width: 'full',
          backgroundColor: 'canvas',
          top: 's0',
          zIndex: 10,
        }}
      >
        <Box>
          <SegmentedControl
            selectedValue={activeLabel}
            onSelectedChange={(value) => setActiveLabel(value)}
          >
            {tabs.map((tab) => (
              <SegmentedControlButton
                key={tab.props.label}
                value={tab.props.label}
              >
                {tab.props.label}
              </SegmentedControlButton>
            ))}
          </SegmentedControl>
        </Box>
      </Box>

      <Box lx={{ paddingTop: 's24' }}>
        {tabs.map((tab) => {
          if (tab.props.label !== activeLabel) return null;
          return <Box key={tab.props.label}>{tab.props.children}</Box>;
        })}
      </Box>
    </Box>
  );
};

export const Tab = ({ children }: TabProps) => {
  return <Box>{children}</Box>;
};
