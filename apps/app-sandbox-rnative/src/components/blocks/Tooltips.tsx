import {
  Box,
  Tag,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ledgerhq/lumen-ui-rnative';
import { InformationFill } from '@ledgerhq/lumen-ui-rnative/symbols';

export const Tooltips = () => {
  return (
    <Box lx={{ flexDirection: 'row', gap: 's12' }}>
      <Tooltip>
        <TooltipTrigger>
          <InformationFill lx={{ color: 'base' }} size={20} />
        </TooltipTrigger>
        <TooltipContent
          title='Tooltip title'
          content={
            <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}>
              <Text typography='body3' lx={{ color: 'muted' }}>
                Custom tooltip content ReactNode!{' '}
              </Text>
              <Tag label='Tag' appearance='accent' />
            </Box>
          }
        />
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <InformationFill lx={{ color: 'base' }} size={20} />
        </TooltipTrigger>
        <TooltipContent
          title='Simple tooltip title'
          content='Simple tooltip content'
        />
      </Tooltip>
    </Box>
  );
};
