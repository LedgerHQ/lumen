import {
  Box,
  ContentBanner,
  ContentBannerContent,
  ContentBannerDescription,
  ContentBannerTitle,
  Spot,
  Stepper,
} from '@ledgerhq/lumen-ui-rnative';
import { Settings } from '@ledgerhq/lumen-ui-rnative/symbols';

export const ContentBanners = () => {
  return (
    <Box lx={{ flexDirection: 'column', gap: 's12', width: 'full' }}>
      <ContentBanner>
        <Spot appearance='icon' icon={Settings} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>Title Only</ContentBannerTitle>
        </ContentBannerContent>
      </ContentBanner>

      <ContentBanner onClose={() => console.log('close')}>
        <Spot appearance='icon' icon={Settings} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>With Close Button</ContentBannerTitle>
          <ContentBannerDescription>
            This is a description for the content banner.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>

      <ContentBanner onClose={() => console.log('close')}>
        <Stepper currentStep={2} totalSteps={4} />
        <ContentBannerContent>
          <ContentBannerTitle>With Stepper</ContentBannerTitle>
          <ContentBannerDescription>
            Complete all steps to secure your wallet.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>

      <ContentBanner onClose={() => console.log('close')}>
        <Spot appearance='icon' icon={Settings} size={48} />
        <ContentBannerContent>
          <ContentBannerTitle>
            Very Long Title That Should Be Truncated On A Single Line
          </ContentBannerTitle>
          <ContentBannerDescription>
            This is a longer description that demonstrates how the content
            banner handles overflow text. It should clamp at two lines with
            ellipsis.
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>
    </Box>
  );
};
