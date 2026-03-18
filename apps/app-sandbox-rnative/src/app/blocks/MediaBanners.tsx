import {
  Box,
  MediaBanner,
  MediaBannerDescription,
  MediaBannerTitle,
} from '@ledgerhq/lumen-ui-rnative';

export const MediaBanners = () => {
  return (
    <Box lx={{ gap: 's16', width: 'full' }}>
      <MediaBanner imageUrl='https://images.unsplash.com/photo-1663741954108-d15d514529ef'>
        <MediaBannerTitle>Earn Up to 12% APY</MediaBannerTitle>
        <MediaBannerDescription>
          Put your idle crypto to work. Start staking SOL, ETH, ATOM and more
          directly from Ledger Live
        </MediaBannerDescription>
      </MediaBanner>
      <MediaBanner imageUrl='https://images.unsplash.com/photo-1663741954108-d15d514529ef'>
        <MediaBannerTitle>Firmware Update</MediaBannerTitle>
        <MediaBannerDescription>Keep your Nano updated!</MediaBannerDescription>
      </MediaBanner>
    </Box>
  );
};
