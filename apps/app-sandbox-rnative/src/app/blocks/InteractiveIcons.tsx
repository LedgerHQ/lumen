import { InteractiveIcon } from '@ledgerhq/lumen-ui-rnative';
import { ExternalLink, Settings } from '@ledgerhq/lumen-ui-rnative/symbols';

export const InteractiveIcons = () => {
  return (
    <>
      <InteractiveIcon
        iconType='filled'
        icon={ExternalLink}
        accessibilityLabel='Go to Ledger Shop'
        hitSlopType='compact-vertical'
      />

      <InteractiveIcon
        iconType='stroked'
        icon={Settings}
        accessibilityLabel='Go to Ledger Shop'
        hitSlopType='compact-vertical'
      />
    </>
  );
};
