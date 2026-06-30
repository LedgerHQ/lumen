import { Box, TileButton } from '@ledgerhq/lumen-ui-rnative';
import { Eye } from '@ledgerhq/lumen-ui-rnative/symbols';
import React from 'react';
import { useSandboxContext } from './SandboxContext';

type SandboxBlockProps = {
  title: string;
  children: React.ReactNode;
  hideDivider?: boolean;
};

export const SandboxBlock = ({ title, children }: SandboxBlockProps) => {
  const { active, setIsActive } = useSandboxContext();

  if (active && active !== title) {
    return null;
  }

  if (!active) {
    return (
      <TileButton icon={Eye} onPress={() => setIsActive(title)}>
        {title}
      </TileButton>
    );
  }

  return (
    <Box
      lx={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 's12',
      }}
    >
      {children}
    </Box>
  );
};
