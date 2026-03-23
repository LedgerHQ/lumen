import React from 'react';
import {
  SegmentedControl,
  SegmentedControlButton,
} from '../../src/lib/Components/SegmentedControl';

type TabProps = {
  label: string;
  children: React.ReactNode;
};

type CustomTabsProps = {
  children: React.ReactNode;
};

export const CustomTabs: React.FC<CustomTabsProps> = ({ children }) => {
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> =>
      React.isValidElement(child) && child.type === Tab,
  );

  const [activeLabel, setActiveLabel] = React.useState<string>(
    tabs[0]?.props.label ?? '',
  );

  if (tabs.length === 0) {
    return <div className='text-muted'>No tabs found</div>;
  }

  return (
    <div>
      <div className='sticky top-0 z-10 bg-canvas py-12'>
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
      </div>

      <div className='pt-24'>
        {tabs.map((tab) => {
          if (tab.props.label !== activeLabel) return null;
          return <div key={tab.props.label}>{tab.props.children}</div>;
        })}
      </div>
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};
