import {
  Box,
  Tag,
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
  ListItemContentRow,
  Spot,
  Switch,
} from '@ledgerhq/lumen-ui-rnative';
import {
  ChevronRight,
  Settings,
  Wallet,
} from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';

export const ListItems = () => {
  const [selected, setSelected] = useState(false);
  return (
    <Box lx={{ width: 's320', gap: 's8' }}>
      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Simple composition</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>

      <ListItem onPress={() => setSelected(!selected)}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Switch Variant</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Switch checked={selected} onCheckedChange={setSelected} />
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Content Variant</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>42.10</ListItemTitle>
            <ListItemDescription>USD</ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Content Variant</ListItemTitle>
            <ListItemDescription>Custom style</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>USD</ListItemTitle>
            <ListItemDescription lx={{ color: 'error' }}>
              -7.53%
            </ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Content Variant</ListItemTitle>
            <ListItemDescription>Custom style</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>USD</ListItemTitle>
            <ListItemDescription lx={{ color: 'success' }}>
              +7.53%
            </ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Tag Variant</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Tag size='sm' label='New' appearance='accent' />
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Icon Variant</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Wallet size={24} />
          <ListItemContent>
            <ListItemTitle>Icon without Spot</ListItemTitle>
            <ListItemDescription>With icon</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemContentRow>
              <ListItemTitle>Complex 1</ListItemTitle>
              <Tag size='sm' label='New' appearance='base' />
            </ListItemContentRow>
            <ListItemContentRow>
              <ListItemDescription>With description</ListItemDescription>
              <Tag size='sm' label='Custom Tag' appearance='gray' />
            </ListItemContentRow>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>42.10</ListItemTitle>
            <ListItemDescription>USD</ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Complex 2</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemContentRow>
              <Tag size='sm' label='New' appearance='base' />
              <ListItemTitle>1200.12</ListItemTitle>
            </ListItemContentRow>
            <ListItemContentRow>
              <Tag size='sm' label='BTC' appearance='gray' />
            </ListItemContentRow>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>
    </Box>
  );
};
