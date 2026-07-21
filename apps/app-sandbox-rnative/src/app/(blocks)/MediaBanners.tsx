import {
  Box,
  Button,
  MediaBanner,
  MediaBannerDescription,
  MediaBannerTitle,
} from '@ledgerhq/lumen-ui-rnative';
import { useState } from 'react';

export default function MediaBanners() {
  const [showBanner1, setShowBanner1] = useState(true);
  const [showBanner2, setShowBanner2] = useState(true);
  const [showBanner3, setShowBanner3] = useState(true);

  return (
    <Box lx={{ gap: 's16', width: 'full' }}>
      {showBanner1 && (
        <MediaBanner
          imageUrl='https://images.unsplash.com/photo-1663741954108-d15d514529ef'
          onClose={() => setShowBanner1(false)}
        >
          <MediaBannerTitle>
            Earn Up to 12% APY With Staking Now!
          </MediaBannerTitle>
          <MediaBannerDescription>
            Put your idle crypto to work. Start staking SOL, ETH, ATOM and more
            directly from Ledger Live
          </MediaBannerDescription>
        </MediaBanner>
      )}
      {showBanner2 && (
        <MediaBanner
          imageUrl='https://images.unsplash.com/photo-1663741954108-d15d514529ef'
          onClose={() => setShowBanner2(false)}
        >
          <MediaBannerTitle>Firmware Update</MediaBannerTitle>
          <MediaBannerDescription>
            Keep your Nano updated!
          </MediaBannerDescription>
        </MediaBanner>
      )}
      {showBanner3 && (
        <MediaBanner
          imageUrl='https://images.unsplash.com/photo-1663741954108-d15d514529ef'
          onClose={() => setShowBanner3(false)}
        >
          <MediaBannerTitle>Update Unavailable</MediaBannerTitle>
          <MediaBannerDescription>
            Connect your device to check for updates.
          </MediaBannerDescription>
        </MediaBanner>
      )}
      <Button
        onPress={() => {
          setShowBanner1(true);
          setShowBanner2(true);
          setShowBanner3(true);
        }}
        disabled={showBanner1 && showBanner2 && showBanner3}
      >
        Reset
      </Button>
    </Box>
  );
}
