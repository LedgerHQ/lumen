import { Box, Clipboard, Text } from '@ledgerhq/lumen-ui-rnative';
import * as ExpoClipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';

export default function Clipboards() {
  const [current, setCurrent] = useState('');

  const readClipboard = async () => {
    setCurrent(await ExpoClipboard.getStringAsync());
  };

  useEffect(() => {
    readClipboard();
  }, []);

  return (
    <Box lx={{ minWidth: 'full', gap: 's16' }}>
      <Clipboard value='Label' onCopy={readClipboard} />
      <Clipboard
        value='bc1qar0srrr7xfkvy5l643lydnw9re5'
        onCopy={readClipboard}
      />
      <Clipboard
        value='A long label that wraps onto several lines when it does not fit on one'
        onCopy={readClipboard}
      />
      <Text typography='body2' lx={{ color: 'muted' }}>
        Current clipboard: {current || '(empty)'}
      </Text>
    </Box>
  );
}
