import figma from '@figma/code-connect';
import { Settings } from '../../Symbols';
import { Spot } from '../Spot';
import { Stepper } from '../Stepper';
import {
  ContentBanner,
  ContentBannerContent,
  ContentBannerDescription,
  ContentBannerTitle,
} from './ContentBanner';

figma.connect(
  ContentBanner,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11235-5966',
  {
    imports: [
      "import { ContentBanner, ContentBannerContent, ContentBannerTitle, ContentBannerDescription, Spot, Stepper } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'leading-content': 'spot' },
    props: {
      title: figma.string('title'),
      description: figma.string('description'),
      onClose: figma.boolean('show-close-button', {
        true: () => {},
        false: undefined,
      }),
    },
    example: (props) => (
      <ContentBanner
        onClose={props.onClose}
        closeAccessibilityLabel='Close content banner'
      >
        <Spot appearance='icon' icon={Settings} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>{props.title}</ContentBannerTitle>
          <ContentBannerDescription>
            {props.description}
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
    ),
  },
);

figma.connect(
  ContentBanner,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11235-5966',
  {
    imports: [
      "import { ContentBanner, ContentBannerContent, ContentBannerTitle, ContentBannerDescription, Spot, Stepper } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'leading-content': 'stepper' },
    props: {
      title: figma.string('title'),
      description: figma.string('description'),
      onClose: figma.boolean('show-close-button', {
        true: () => {},
        false: undefined,
      }),
    },
    example: (props) => (
      <ContentBanner
        onClose={props.onClose}
        closeAccessibilityLabel='Close content banner'
      >
        <Stepper currentStep={1} totalSteps={4} />
        <ContentBannerContent>
          <ContentBannerTitle>{props.title}</ContentBannerTitle>
          <ContentBannerDescription>
            {props.description}
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
    ),
  },
);

figma.connect(
  ContentBanner,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11235-5966',
  {
    imports: [
      "import { ContentBanner, ContentBannerContent, ContentBannerTitle, ContentBannerDescription, Spot, Stepper } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'leading-content': 'none' },
    props: {
      title: figma.string('title'),
      description: figma.string('description'),
      onClose: figma.boolean('show-close-button', {
        true: () => {},
        false: undefined,
      }),
    },
    example: (props) => (
      <ContentBanner
        onClose={props.onClose}
        closeAccessibilityLabel='Close content banner'
      >
        <ContentBannerContent>
          <ContentBannerTitle>{props.title}</ContentBannerTitle>
          <ContentBannerDescription>
            {props.description}
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
    ),
  },
);
