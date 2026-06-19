import type { Meta, StoryObj } from '@storybook/react-vite';
import { MediaImage } from './MediaImage';

const meta = {
  component: MediaImage,
  title: 'Core/MediaImage',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof MediaImage>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleSrc = 'https://crypto-icons.ledger.com/ADA.png';

export const Base: Story = {
  args: {
    src: exampleSrc,
    alt: 'Cardano',
    size: 40,
    shape: 'square',
  },
};

export const SizeShowcase: Story = {
  args: { alt: 'Size showcase' },
  render: () => (
    <div className='inline-flex items-end gap-16 body-2'>
      <MediaImage src={exampleSrc} alt={`Size 12`} size={12} />
      <MediaImage src={exampleSrc} alt={`Size 16`} size={16} />
      <MediaImage src={exampleSrc} alt={`Size 20`} size={20} />
      <MediaImage src={exampleSrc} alt={`Size 24`} size={24} />
      <MediaImage src={exampleSrc} alt={`Size 32`} size={32} />
      <MediaImage src={exampleSrc} alt={`Size 40`} size={40} />
      <MediaImage src={exampleSrc} alt={`Size 48`} size={48} />
      <MediaImage src={exampleSrc} alt={`Size 56`} size={56} />
      <MediaImage src={exampleSrc} alt={`Size 64`} size={64} />
      <MediaImage src={exampleSrc} alt={`Size 72`} size={72} />
    </div>
  ),
};

export const ShapeShowcase: Story = {
  args: { alt: 'Shape showcase' },
  render: () => (
    <div className='inline-flex items-center gap-24 body-2'>
      <MediaImage src={exampleSrc} alt='square' size={48} shape='square' />
      <MediaImage src={exampleSrc} alt='Circle' size={48} shape='circle' />
    </div>
  ),
};

export const FallbackShowcase: Story = {
  render: () => (
    <div className='inline-flex items-end gap-16'>
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={12} />
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={16} />
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={20} />
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={24} />
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={32} />
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={40} />
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={48} />
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={56} />
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={64} />
      <MediaImage fallback='Bitcoin' alt='Bitcoin' size={72} />
    </div>
  ),
};

export const LoadingShowcase: Story = {
  render: () => (
    <div className='inline-flex items-end gap-16'>
      <MediaImage loading alt='Loading' size={12} />
      <MediaImage loading alt='Loading' size={16} />
      <MediaImage loading alt='Loading' size={20} />
      <MediaImage loading alt='Loading' size={24} />
      <MediaImage loading alt='Loading' size={32} />
      <MediaImage loading alt='Loading' size={40} />
      <MediaImage loading alt='Loading' size={48} />
      <MediaImage loading alt='Loading' size={56} />
      <MediaImage loading alt='Loading' size={64} />
      <MediaImage loading alt='Loading' size={72} />
    </div>
  ),
};

export const DisabledShowcase: Story = {
  args: { alt: 'Disabled showcase' },
  render: () => (
    <div className='flex flex-col gap-24'>
      <div className='inline-flex items-end gap-16'>
        <MediaImage src={exampleSrc} alt='Cardano' size={32} disabled />
        <MediaImage src={exampleSrc} alt='Cardano' size={48} disabled />
        <MediaImage
          src={exampleSrc}
          alt='Cardano'
          size={48}
          shape='circle'
          disabled
        />
        <MediaImage fallback='Bitcoin' alt='Bitcoin' size={48} disabled />
        <MediaImage alt='Empty' size={48} disabled />
      </div>
    </div>
  ),
};
