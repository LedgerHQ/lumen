import figma from '@figma/code-connect';
import {
  MediaBanner,
  MediaBannerDescription,
  MediaBannerTitle,
} from './MediaBanner';

figma.connect(
  MediaBanner,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=18788-44622',
  {
    imports: [
      "import { MediaBanner, MediaBannerTitle, MediaBannerDescription } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      onClose: figma.boolean('show-close', {
        true: () => {},
        false: undefined,
      }),
    },
    example: (props) => (
      <MediaBanner
        imageUrl='/image.jpg'
        onClose={props.onClose}
        closeAriaLabel='Close banner'
      >
        <MediaBannerTitle>Title</MediaBannerTitle>
        <MediaBannerDescription>Description</MediaBannerDescription>
      </MediaBanner>
    ),
  },
);
