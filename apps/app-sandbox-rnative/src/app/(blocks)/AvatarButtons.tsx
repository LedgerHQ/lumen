import { AvatarButton, Box } from '@ledgerhq/lumen-ui-rnative';
import {
  AVATAR_COLORS,
  resolveAvatarColor,
} from '@ledgerhq/lumen-utils-shared';

const exampleSrc =
  'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function AvatarButtons() {
  return (
    <Box lx={{ gap: 's16' }}>
      <Box
        lx={{
          flexDirection: 'row',
          gap: 's8',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}
      >
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
          <AvatarButton
            key={size}
            src={exampleSrc}
            size={size}
            alt='Open user menu'
          />
        ))}
      </Box>
      <Box
        lx={{
          flexDirection: 'row',
          gap: 's8',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}
      >
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
          <AvatarButton
            key={size}
            size={size}
            fallbackText='AB'
            alt='Open user menu'
          />
        ))}
      </Box>
      <Box lx={{ flexDirection: 'row', gap: 's8', flexWrap: 'wrap' }}>
        {AVATAR_COLORS.map((_, i) => (
          <AvatarButton
            key={i}
            fallbackColor={resolveAvatarColor(`user-${i}`)}
            fallbackText={
              String.fromCharCode(65 + i) + String.fromCharCode(66 + i)
            }
            alt='Open user menu'
          />
        ))}
        <AvatarButton alt='Open user menu' />
      </Box>
    </Box>
  );
}
