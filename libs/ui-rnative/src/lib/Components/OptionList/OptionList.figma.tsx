import figma from '@figma/code-connect';
import {
  OptionList,
  OptionListContent,
  OptionListEmptyState,
  OptionListItem,
  OptionListItemContent,
  OptionListItemTitle,
} from './OptionList';

figma.connect(
  OptionList,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=15941-6709',
  {
    imports: [
      "import { OptionList, OptionListContent, OptionListItem, OptionListItemContent, OptionListItemTitle, OptionListEmptyState } from '@ledgerhq/lumen-ui-rnative'",
    ],
    example: () => (
      <OptionList items={[]} value={''} onValueChange={() => {}}>
        <OptionListContent
          renderItem={(item) => (
            <OptionListItem value={item.value}>
              <OptionListItemContent>
                <OptionListItemTitle>{item.label}</OptionListItemTitle>
              </OptionListItemContent>
            </OptionListItem>
          )}
        />
        <OptionListEmptyState title='No options available' />
      </OptionList>
    ),
  },
);
