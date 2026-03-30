import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';
import { Link } from '../Link';
import { Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip';
import {
  Subheader,
  SubheaderRow,
  SubheaderTitle,
  SubheaderCount,
  SubheaderInfo,
  SubheaderShowMore,
  SubheaderDescription,
} from './Subheader';

const Container = ({ children }: { children: React.ReactNode }) => (
  <View style={{ padding: 8, backgroundColor: '#ffffff', width: 400 }}>
    {children}
  </View>
);

const meta: Meta<typeof Subheader> = {
  component: Subheader,
  title: 'Communication/Subheader',
  subcomponents: {
    SubheaderRow,
    SubheaderTitle,
    SubheaderDescription,
    SubheaderCount,
    SubheaderInfo,
    SubheaderShowMore,
  },
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Subheader>;

export const Base: Story = {
  render: () => (
    <Subheader>
      <SubheaderRow>
        <SubheaderTitle>Section Title</SubheaderTitle>
      </SubheaderRow>
      <SubheaderDescription>
        This is a detailed description that provides additional context about
        this section.
      </SubheaderDescription>
    </Subheader>
  ),
};

export const InteractiveRow: Story = {
  render: () => (
    <Subheader>
      <SubheaderRow onPress={() => console.log('Row clicked')}>
        <SubheaderTitle>Accounts</SubheaderTitle>
        <SubheaderCount value={5} />
        <SubheaderShowMore />
      </SubheaderRow>
      <SubheaderDescription>
        Interactive rows always include the chevron to indicate they lead to
        more content
      </SubheaderDescription>
    </Subheader>
  ),
};

export const WithInfoIcon: Story = {
  render: () => (
    <Subheader>
      <SubheaderRow>
        <SubheaderTitle>Section with Info</SubheaderTitle>
        <Tooltip>
          <TooltipTrigger>
            <SubheaderInfo />
          </TooltipTrigger>
          <TooltipContent
            content={<Text>Additional information about this section</Text>}
          />
        </Tooltip>
      </SubheaderRow>
      <SubheaderDescription>
        Use the info icon to provide contextual help or additional details
      </SubheaderDescription>
    </Subheader>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Subheader>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
        <SubheaderRow style={{ flex: 1, minWidth: 0 }}>
          <SubheaderTitle>Recent Activity</SubheaderTitle>
        </SubheaderRow>
        <Link
          onPress={() => console.log('View all')}
          appearance='accent'
          size='sm'
          underline={false}
        >
          View all
        </Link>
      </View>
      <SubheaderDescription>
        Place the action link in a flex layout beside the subheader
      </SubheaderDescription>
    </Subheader>
  ),
};
