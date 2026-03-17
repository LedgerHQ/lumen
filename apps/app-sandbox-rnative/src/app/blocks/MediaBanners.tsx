import {
  Box,
  MediaBanner,
  MediaBannerDescription,
  MediaBannerTitle,
} from '@ledgerhq/lumen-ui-rnative';

export const MediaBanners = () => {
  return (
    <Box style={{ gap: 24 }}>
      <MediaBanner>
        <MediaBannerTitle>Title</MediaBannerTitle>
        <MediaBannerDescription>Description</MediaBannerDescription>
      </MediaBanner>
    </Box>
  );
};
