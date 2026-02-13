import { Box, Avatar } from '@ledgerhq/lumen-ui-rnative';

const exampleSrc =
  'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export function Avatars() {
  return (
    <Box lx={{ flexDirection: 'row', gap: 's8', flexWrap: 'wrap' }}>
      <Avatar size='sm' />
      <Avatar src={exampleSrc} size='sm' />
      <Avatar />
      <Avatar src={exampleSrc} showNotification />
    </Box>
  );
}
