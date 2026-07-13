import { AvatarButton, Box } from '@ledgerhq/lumen-ui-rnative';

const exampleSrc =
  'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function AvatarButtons() {
  return (
    <Box lx={{ flexDirection: 'row', gap: 's8', flexWrap: 'wrap' }}>
      <AvatarButton size='sm' alt='Open user menu' />
      <AvatarButton src={exampleSrc} size='sm' alt='Open user menu' />
      <AvatarButton size='md' alt='Open user menu' />
      <AvatarButton src={exampleSrc} size='md' alt='Open user menu' />
      <AvatarButton size='lg' alt='Open user menu' />
      <AvatarButton src={exampleSrc} size='lg' alt='Open user menu' />
      <AvatarButton size='xl' alt='Open user menu' />
      <AvatarButton src={exampleSrc} size='xl' alt='Open user menu' />
    </Box>
  );
}
