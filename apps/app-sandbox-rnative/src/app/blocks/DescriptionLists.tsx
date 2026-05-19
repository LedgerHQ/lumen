import {
  Box,
  DescriptionItem,
  DescriptionItemLabel,
  DescriptionItemLeading,
  DescriptionItemTrailing,
  DescriptionItemValue,
  InteractiveIcon,
  Tag,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ledgerhq/lumen-ui-rnative';
import { Information } from '@ledgerhq/lumen-ui-rnative/symbols';

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    typography='body3'
    lx={{ color: 'muted', marginTop: 's16', marginBottom: 's4' }}
  >
    {children}
  </Text>
);

const TransactionSummary = ({
  size = 'md' as const,
}: {
  size?: 'md' | 'sm';
}) => (
  <Box lx={{ width: 's320', gap: size === 'md' ? 's16' : 's12' }}>
    <DescriptionItem size={size}>
      <DescriptionItemLeading>
        <DescriptionItemLabel>Network</DescriptionItemLabel>
      </DescriptionItemLeading>
      <DescriptionItemTrailing>
        <DescriptionItemValue>Ethereum</DescriptionItemValue>
      </DescriptionItemTrailing>
    </DescriptionItem>

    <DescriptionItem size={size}>
      <DescriptionItemLeading>
        <DescriptionItemLabel>Amount</DescriptionItemLabel>
      </DescriptionItemLeading>
      <DescriptionItemTrailing>
        <DescriptionItemValue>1.5 ETH</DescriptionItemValue>
      </DescriptionItemTrailing>
    </DescriptionItem>

    <DescriptionItem size={size}>
      <DescriptionItemLeading>
        <DescriptionItemLabel>Fees</DescriptionItemLabel>
        <Tooltip>
          <TooltipTrigger>
            <InteractiveIcon
              icon={Information}
              size={16}
              iconType='stroked'
              accessibilityLabel='More information about fees'
            />
          </TooltipTrigger>
          <TooltipContent
            content={<Text typography='body2'>Network fee paid to miners</Text>}
          />
        </Tooltip>
      </DescriptionItemLeading>
      <DescriptionItemTrailing>
        <DescriptionItemValue>0.001 ETH</DescriptionItemValue>
      </DescriptionItemTrailing>
    </DescriptionItem>

    <DescriptionItem size={size}>
      <DescriptionItemLeading>
        <DescriptionItemLabel>Status</DescriptionItemLabel>
      </DescriptionItemLeading>
      <DescriptionItemTrailing>
        <Tag size={size} label='Confirmed' appearance='success' />
      </DescriptionItemTrailing>
    </DescriptionItem>
  </Box>
);

export const DescriptionLists = () => {
  return (
    <Box lx={{ gap: 's8' }}>
      <SectionLabel>Medium (default)</SectionLabel>
      <TransactionSummary size='md' />

      <SectionLabel>Small</SectionLabel>
      <TransactionSummary size='sm' />

      <SectionLabel>Truncation</SectionLabel>
      <Box lx={{ width: 's320', gap: 's16' }}>
        <DescriptionItem>
          <DescriptionItemLeading>
            <DescriptionItemLabel>
              Destination address on network with a long label
            </DescriptionItemLabel>
          </DescriptionItemLeading>
          <DescriptionItemTrailing>
            <DescriptionItemValue>
              0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
            </DescriptionItemValue>
          </DescriptionItemTrailing>
        </DescriptionItem>
      </Box>
    </Box>
  );
};
