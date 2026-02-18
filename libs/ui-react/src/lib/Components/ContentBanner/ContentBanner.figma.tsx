import React from 'react';
import {
  ContentBanner,
  ContentBannerContent,
  ContentBannerTitle,
  ContentBannerDescription,
} from './ContentBanner';

import { Spot } from '../Spot';
import { Placeholder, Wallet } from '../../Symbols';
import figma from '@figma/code-connect';
import { Stepper } from '../Stepper';

figma.connect(
  ContentBanner,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11235-5966',
  {
    imports: [
      "import { ContentBanner, ContentBannerContent, ContentBannerTitle, ContentBannerDescription, Spot, Stepper } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'show-close-button': true },
    props: {
      title: figma.string('title'),
      description: figma.string('description'),
      leadingElement: figma.enum('type', {
        spot: <Spot appearance='icon' icon={Placeholder} size={48} />,
        stepper: <Stepper currentStep={1} totalSteps={4} />,
      }),
    },
    example: (props) => (
      <ContentBanner
        onClose={() => {}}
        closeAriaLabel='Close content banner'
      >
        {props.leadingElement}
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
      "import { ContentBanner, ContentBannerContent, ContentBannerTitle, ContentBannerDescription, Spot, Stepper } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'show-close-button': false },
    props: {
      title: figma.string('title'),
      description: figma.string('description'),
      leadingElement: figma.enum('type', {
        spot: <Spot appearance='icon' icon={Wallet} size={48} />,
        stepper: <Stepper currentStep={1} totalSteps={4} />,
      }),
    },
    example: (props) => (
      <ContentBanner>
        {props.leadingElement}
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
