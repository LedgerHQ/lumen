import {
  ReactNode,
  FC,
  Children,
  ReactElement,
  isValidElement,
  useState,
} from 'react';
import {
  SegmentedControl,
  SegmentedControlButton,
} from '../../src/lib/Components/SegmentedControl';

type TabProps = {
  label: string;
  children: ReactNode;
};

type CustomTabsProps = {
  children: ReactNode;
};

export const CustomTabs: FC<CustomTabsProps> = ({ children }) => {
  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<TabProps> =>
      isValidElement(child) && child.type === Tab,
  );

  const [activeLabel, setActiveLabel] = useState<string>(
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

export const Tab: FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};
