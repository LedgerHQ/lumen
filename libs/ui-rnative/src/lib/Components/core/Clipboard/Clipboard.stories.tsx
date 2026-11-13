import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../../primitives';
import { Clipboard } from './Clipboard';

const meta = {
  id: 'rnative-clipboard',
  title: 'Core/Clipboard',
  component: Clipboard,
  decorators: [
    (Story) => (
      <Box lx={{ width: 's256' }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic',
      },
    },
  },
} satisfies Meta<typeof Clipboard>;

export default meta;
type Story = StoryObj<typeof Clipboard>;

export const Base: Story = {
  render: (args) => <Clipboard {...args} />,
  args: {
    value: 'Label',
  },
};

export const ResponsivenessShowcase: Story = {
  render: () => (
    <Box lx={{ gap: 's8' }}>
      <Clipboard value='A long label that wraps onto several lines when it does not fit on one' />
      <Clipboard value='bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' />
    </Box>
  ),
};
