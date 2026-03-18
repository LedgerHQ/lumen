import {
  Box,
  MediaBanner,
  MediaBannerDescription,
  MediaBannerTitle,
} from '@ledgerhq/lumen-ui-rnative';

export const MediaBanners = () => {
  return (
    <Box lx={{ gap: 's16' }}>
      <Box>
        <MediaBanner>
          <MediaBannerTitle>Title</MediaBannerTitle>
          <MediaBannerDescription>Description</MediaBannerDescription>
        </MediaBanner>
      </Box>
      <Box lx={{ flexDirection: 'row', gap: 's16' }}>
        <MediaBanner lx={{ flex: 1 }}>
          <MediaBannerTitle>Title</MediaBannerTitle>
          <MediaBannerDescription>Description</MediaBannerDescription>
        </MediaBanner>
        <MediaBanner lx={{ flex: 1 }}>
          <MediaBannerTitle>Title</MediaBannerTitle>
          <MediaBannerDescription>Description</MediaBannerDescription>
        </MediaBanner>
      </Box>
    </Box>
  );
};
