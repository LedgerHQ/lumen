import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../shared';

const meta: Meta = {
  id: 'react-typography',
  title: 'Foundations/Styles/Typography',
};

export default meta;
type Story = StoryObj;

const TypographySample = ({
  className,
  title,
}: {
  className: string;
  title: string;
}) => (
  <div>
    <div
      className={`${className} max-w-fit rounded-lg border border-muted-subtle bg-base p-24 text-base`}
    >
      The quick brown fox jumps over the lazy dog
      <div className='mt-24 bg-muted-pressed p-[0.5px]' />
      <div className='mt-16 mb-4 body-2 text-base'> {title} </div>
      <div className='body-4 text-muted'>{className}</div>
    </div>
  </div>
);

const TypographyShowcase = () => {
  const typographyStyles = [
    { className: 'responsive-display-1', title: 'Responsive Display 1' },
    { className: 'responsive-display-2', title: 'Responsive Display 2' },
    { className: 'responsive-display-3', title: 'Responsive Display 3' },
    { className: 'responsive-display-4', title: 'Responsive Display 4' },
    { className: 'heading-0', title: 'Heading 0' },
    { className: 'heading-0-semi-bold', title: 'Heading 0 Semi Bold' },
    { className: 'heading-1', title: 'Heading 1' },
    { className: 'heading-1-semi-bold', title: 'Heading 1 Semi Bold' },
    { className: 'heading-2', title: 'Heading 2' },
    { className: 'heading-2-semi-bold', title: 'Heading 2 Semi Bold' },
    { className: 'heading-3', title: 'Heading 3' },
    { className: 'heading-3-semi-bold', title: 'Heading 3 Semi Bold' },
    { className: 'heading-4', title: 'Heading 4' },
    { className: 'heading-4-semi-bold', title: 'Heading 4 Semi Bold' },
    { className: 'heading-5', title: 'Heading 5' },
    { className: 'heading-5-semi-bold', title: 'Heading 5 Semi Bold' },
    { className: 'body-1', title: 'Body 1' },
    { className: 'body-1-semi-bold', title: 'Body 1 Semi Bold' },
    { className: 'body-2', title: 'Body 2' },
    { className: 'body-2-semi-bold', title: 'Body 2 Semi Bold' },
    { className: 'body-3', title: 'Body 3' },
    { className: 'body-3-semi-bold', title: 'Body 3 Semi Bold' },
    { className: 'body-4', title: 'Body 4' },
    { className: 'body-4-semi-bold', title: 'Body 4 Semi Bold' },
  ];

  return (
    <div className='mb-32'>
      <div className='space-y-12'>
        {typographyStyles.map((style) => (
          <TypographySample key={style.className} {...style} />
        ))}
      </div>
    </div>
  );
};

export const Typography: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Typography'
        description='Tailwind classes for controlling the typography of an element. Use `body-1`, `body-2`, `responsive-display-1`, `heading-2`... for the display text.'
      />
      <TypographyShowcase />
    </div>
  ),
};
