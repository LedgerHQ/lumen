import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { TypographyTable } from './TypographyTable';

const meta: Meta = {
  id: 'rnative-typographies',
  title: 'Style System/Theme/Typographies',
};

export default meta;
type Story = StoryObj;

export const Heading: Story = {
  render: () => <TypographyTable category='heading' />,
};

export const Body: Story = {
  render: () => <TypographyTable category='body' />,
};
