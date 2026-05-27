import CryptoIcon from '@ledgerhq/crypto-icons/native';
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
  Text,
  Checkbox,
  Spinner,
} from '@ledgerhq/lumen-ui-rnative';
import {
  ChevronRight,
  Lock,
  Settings,
  Wallet,
} from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';
import { Alert } from 'react-native';

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    typography='body3'
    lx={{
      color: 'muted',
      marginTop: 's16',
      marginBottom: 's4',
    }}
  >
    {children}
  </Text>
);

export const ListItems = () => {
  const [selected, setSelected] = useState(false);
  const [checked, setChecked] = useState(false);
  return (
    <Box lx={{ width: 's320', gap: 's8' }}>
      <SectionLabel>Title only</SectionLabel>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Simple composition</ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Title only + chevron</ListItemTitle>
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
            <ListItemTitle>Title only + trailing value</ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>42.10</ListItemTitle>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <SectionLabel>Truncation</SectionLabel>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>
              Very long title that should truncate properly at the end
            </ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>
              Long title competing with trailing value content
            </ListItemTitle>
            <ListItemDescription>With description too</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>1,234,567.89</ListItemTitle>
            <ListItemDescription>USD</ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>
              Long title with long description underneath it
            </ListItemTitle>
            <ListItemDescription>
              This description is also extremely long and should truncate
            </ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
        </ListItemTrailing>
      </ListItem>

      <ListItem density='compact'>
        <ListItemLeading>
          <Wallet size={24} />
          <ListItemContent>
            <ListItemTitle>
              Compact title that is way too long and must truncate cleanly
            </ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>999.99</ListItemTitle>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Wallet size={24} />
          <ListItemContent>
            <ListItemTitle>
              Small icon with a very long title pushing the trailing
            </ListItemTitle>
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
            <ListItemTitle>Short title</ListItemTitle>
            <ListItemDescription>Short desc</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>999,999,999.99</ListItemTitle>
            <ListItemDescription>
              Very long trailing description
            </ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <SectionLabel>ContentRow with Tag</SectionLabel>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemContentRow>
              <ListItemTitle>
                Long title inside ContentRow with a tag
              </ListItemTitle>
              <Tag size='sm' label='New' appearance='base' />
            </ListItemContentRow>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemContentRow>
              <ListItemTitle>Row title + tag + trailing</ListItemTitle>
              <Tag size='sm' label='Hot' appearance='accent' />
            </ListItemContentRow>
            <ListItemDescription>Description below the row</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>99.99</ListItemTitle>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <SectionLabel>Description only</SectionLabel>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemDescription>
              Expanded with description only, no title
            </ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
        </ListItemTrailing>
      </ListItem>

      <ListItem density='compact'>
        <ListItemLeading>
          <Wallet size={24} />
          <ListItemContent>
            <ListItemDescription>
              Compact with description only, no title
            </ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Tag size='sm' label='Info' appearance='gray' />
        </ListItemTrailing>
      </ListItem>

      <SectionLabel>Compact density</SectionLabel>

      <ListItem density='compact'>
        <ListItemLeading>
          <Wallet size={24} />
          <ListItemContent>
            <ListItemTitle>Compact title only</ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>

      <ListItem density='compact'>
        <ListItemLeading>
          <Wallet size={24} />
          <ListItemContent>
            <ListItemTitle>Compact + trailing</ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
        </ListItemTrailing>
      </ListItem>

      <ListItem density='compact'>
        <ListItemLeading>
          <Wallet size={24} />
          <ListItemContent>
            <ListItemTitle>
              Compact with an extremely long title that should truncate
            </ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>

      <SectionLabel>Disabled</SectionLabel>

      <ListItem disabled>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Disabled title only</ListItemTitle>
          </ListItemContent>
        </ListItemLeading>
      </ListItem>

      <ListItem disabled onPress={() => Alert.alert('Should not fire')}>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Lock} />
          <ListItemContent>
            <ListItemTitle>Disabled + interactive</ListItemTitle>
            <ListItemDescription>Press should not fire</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight size={24} />
        </ListItemTrailing>
      </ListItem>

      <SectionLabel>Title + Description</SectionLabel>

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

      <ListItem onPress={() => Alert.alert('Pressed')}>
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

      <ListItem onPress={() => Alert.alert('Pressed')}>
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

      <SectionLabel>Trailing variants</SectionLabel>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Checkbox trailing</ListItemTitle>
            <ListItemDescription>Select this item</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Checkbox checked={checked} onCheckedChange={setChecked} />
        </ListItemTrailing>
      </ListItem>

      <ListItem>
        <ListItemLeading>
          <Spot size={48} appearance='icon' icon={Wallet} />
          <ListItemContent>
            <ListItemTitle>Spinner trailing</ListItemTitle>
            <ListItemDescription>Loading state</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Spinner size={20} />
        </ListItemTrailing>
      </ListItem>

      <SectionLabel>Complex compositions</SectionLabel>

      <ListItem>
        <ListItemLeading>
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={48} />
          <ListItemContent>
            <ListItemContentRow>
              <ListItemTitle>Bitcoin</ListItemTitle>
              <Tag size='sm' label='New' appearance='base' />
            </ListItemContentRow>
            <ListItemContentRow>
              <ListItemDescription>BTC</ListItemDescription>
              <Tag size='sm' label='Network' appearance='gray' />
            </ListItemContentRow>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>0.4215</ListItemTitle>
            <ListItemDescription>$42,150.00</ListItemDescription>
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

      <ListItem onPress={() => Alert.alert('Pressed')}>
        <ListItemLeading>
          <Spot size={48} appearance='check' />
          <ListItemContent>
            <ListItemContentRow>
              <ListItemTitle>Success state</ListItemTitle>
              <Tag size='sm' label='Done' appearance='success' />
            </ListItemContentRow>
            <ListItemDescription>
              Check spot with success tag
            </ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>+500.00</ListItemTitle>
            <ListItemDescription lx={{ color: 'success' }}>
              Received
            </ListItemDescription>
          </ListItemContent>
        </ListItemTrailing>
      </ListItem>

      <ListItem onPress={() => Alert.alert('Pressed')}>
        <ListItemLeading>
          <Spot size={48} appearance='warning' />
          <ListItemContent>
            <ListItemContentRow>
              <ListItemTitle>Pending operation</ListItemTitle>
              <Tag size='sm' label='Pending' appearance='warning' />
            </ListItemContentRow>
            <ListItemDescription>
              Warning spot with long desc that should truncate cleanly
            </ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Spinner size={20} />
        </ListItemTrailing>
      </ListItem>
    </Box>
  );
};
