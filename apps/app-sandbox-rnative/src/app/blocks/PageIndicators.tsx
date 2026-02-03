import { Box, PageIndicator } from "@ledgerhq/lumen-ui-rnative";

export const PageIndicators = () => {
  return (
    <Box lx={{ gap: "s32" }}>
      <Box lx={{ gap: "s8" }}>
        <PageIndicator />
      </Box>
    </Box>
  );
};
