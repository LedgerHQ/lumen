import {
  Box,
  Avatar,
  DotIndicator,
  getDotIndicatorProps,
  resolveAvatarColor,
} from '@ledgerhq/lumen-ui-rnative';
import { AVATAR_COLOR_KEYS } from '@ledgerhq/lumen-utils-shared';

const exampleSrc =
  'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function Avatars() {
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
          <Avatar key={size} src={exampleSrc} size={size} />
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
          <Avatar key={size} size={size} fallbackText='AB' />
        ))}
      </Box>

      <Box lx={{ flexDirection: 'row', gap: 's8', flexWrap: 'wrap' }}>
        {AVATAR_COLOR_KEYS.map((_, i) => (
          <Avatar
            key={i}
            fallbackColor={resolveAvatarColor(`user-${i}`)}
            fallbackText={
              String.fromCharCode(65 + i) + String.fromCharCode(66 + i)
            }
          />
        ))}
        <Avatar />
      </Box>

      <Box lx={{ flexDirection: 'row', gap: 's8', flexWrap: 'wrap' }}>
        <DotIndicator {...getDotIndicatorProps('avatar', 'sm')}>
          <Avatar src={exampleSrc} size='sm' />
        </DotIndicator>
        <DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
          <Avatar src={exampleSrc} size='md' />
        </DotIndicator>
      </Box>

      <Box lx={{ flexDirection: 'row', gap: 's8', alignItems: 'center' }}>
        <Avatar size='md' />
        <Avatar size='md' ringAppearance='thin' />
        <Avatar size='md' ringAppearance='thick' />
      </Box>
    </Box>
  );
}
