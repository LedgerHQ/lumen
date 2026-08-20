import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { TypographyTable } from './TypographyTable';

const meta = {
  id: 'rnative-typographies',
  title: 'Style System/Theme/Typographies',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading: Story = {
  render: () => <TypographyTable category='heading' />,
};

export const Body: Story = {
  render: () => <TypographyTable category='body' />,
};
