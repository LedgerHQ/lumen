import { InteractiveIcon } from '@ledgerhq/lumen-ui-rnative';
import { ExternalLink, Settings } from '@ledgerhq/lumen-ui-rnative/symbols';

export const InteractiveIcons = () => {
  return (
    <>
      <InteractiveIcon
        iconType='filled'
        aria-label='Go to Ledger Shop'
        hitSlopType='compact-vertical'
      >
        <ExternalLink />
      </InteractiveIcon>

      <InteractiveIcon
        iconType='stroked'
        aria-label='Go to Ledger Shop'
        hitSlopType='compact-vertical'
      >
        <Settings />
      </InteractiveIcon>
    </>
  );
};
