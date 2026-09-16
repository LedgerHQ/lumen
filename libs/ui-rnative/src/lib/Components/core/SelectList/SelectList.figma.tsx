import figma from '@figma/code-connect';
import {
  SelectList,
  SelectListContent,
  SelectListEmptyState,
  SelectListItem,
  SelectListItemContent,
  SelectListItemDescription,
  SelectListItemText,
} from './SelectList';

figma.connect(
  SelectList,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=15941-6709',
  {
    imports: [
      "import { SelectList, SelectListContent, SelectListItem, SelectListItemContent, SelectListItemText, SelectListItemDescription, SelectListEmptyState } from '@ledgerhq/lumen-ui-rnative'",
    ],
    example: () => (
      <SelectList items={[]} value={''} onValueChange={() => {}}>
        <SelectListContent
          renderItem={(item) => (
            <SelectListItem value={item.value}>
              <SelectListItemContent>
                <SelectListItemText>{item.label}</SelectListItemText>
                <SelectListItemDescription>
                  {item.description}
                </SelectListItemDescription>
              </SelectListItemContent>
            </SelectListItem>
          )}
        />
        <SelectListEmptyState title='No options available' />
      </SelectList>
    ),
  },
);
