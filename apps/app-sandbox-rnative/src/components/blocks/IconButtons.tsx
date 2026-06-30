import { IconButton } from '@ledgerhq/lumen-ui-rnative';
import {
  ExternalLink,
  Link,
  Settings,
} from '@ledgerhq/lumen-ui-rnative/symbols';

export const IconButtons = () => {
  return (
    <>
      <IconButton
        accessibilityLabel='Go to Ledger Shop'
        appearance='accent'
        icon={ExternalLink}
      />
      <IconButton
        accessibilityLabel='Go to Ledger Shop'
        appearance='accent'
        icon={Settings}
        loading
      />
      <IconButton
        accessibilityLabel='Go to Ledger Shop'
        appearance='base'
        icon={Link}
        loading
      />
      <IconButton
        accessibilityLabel='Go to Ledger Shop'
        appearance='base'
        icon={Link}
      />
      <IconButton
        accessibilityLabel='Go to Ledger Shop'
        appearance='red'
        icon={Settings}
      />
      <IconButton
        accessibilityLabel='Go to Ledger Shop'
        appearance='gray'
        icon={Settings}
      />
      <IconButton accessibilityLabel='Go to Ledger Shop' icon={Settings} />
      <IconButton
        accessibilityLabel='Go to Ledger Shop'
        icon={Settings}
        disabled
      />
    </>
  );
};
