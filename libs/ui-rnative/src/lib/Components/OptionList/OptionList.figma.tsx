import figma from '@figma/code-connect';
import {
  OptionList,
  OptionListContent,
  OptionListEmptyState,
  OptionListItem,
  OptionListItemContent,
  OptionListItemDescription,
  OptionListItemText,
} from './OptionList';

figma.connect(
  OptionList,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=15941-6709',
  {
    imports: [
      "import { OptionList, OptionListContent, OptionListItem, OptionListItemContent, OptionListItemText, OptionListItemDescription, OptionListEmptyState } from '@ledgerhq/lumen-ui-rnative'",
    ],
    example: () => (
      <OptionList items={[]} value={''} onValueChange={() => {}}>
        <OptionListContent
          renderItem={(item) => (
            <OptionListItem value={item.value}>
              <OptionListItemContent>
                <OptionListItemText>{item.label}</OptionListItemText>
                <OptionListItemDescription>
                  {item.description}
                </OptionListItemDescription>
              </OptionListItemContent>
            </OptionListItem>
          )}
        />
        <OptionListEmptyState title='No options available' />
      </OptionList>
    ),
  },
);
