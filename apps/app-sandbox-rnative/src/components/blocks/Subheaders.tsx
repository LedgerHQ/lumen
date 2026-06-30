import {
  Subheader,
  SubheaderRow,
  SubheaderTitle,
  SubheaderCount,
  SubheaderInfo,
  SubheaderShowMore,
  SubheaderDescription,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Text,
} from '@ledgerhq/lumen-ui-rnative';
import { View, Alert } from 'react-native';

export const Subheaders = () => {
  return (
    <View style={{ gap: 24 }}>
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Simple Title</SubheaderTitle>
        </SubheaderRow>
      </Subheader>

      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>With Count</SubheaderTitle>
          <SubheaderCount value={30} />
        </SubheaderRow>
      </Subheader>

      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>With Info Tooltip</SubheaderTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <SubheaderInfo />
            </TooltipTrigger>
            <TooltipContent
              title='Information'
              content={
                <Text typography='body2'>
                  This is additional information about this section
                </Text>
              }
            />
          </Tooltip>
        </SubheaderRow>
      </Subheader>

      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Complete Example</SubheaderTitle>
          <SubheaderCount
            value={200}
            format={(n: number) => (n > 99 ? '(99+)' : `(${n})`)}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <SubheaderInfo />
            </TooltipTrigger>
            <TooltipContent
              title='Help'
              content={
                <Text typography='body2'>
                  Additional details about this section
                </Text>
              }
            />
          </Tooltip>
        </SubheaderRow>
        <SubheaderDescription>
          This is a description with all features combined
        </SubheaderDescription>
      </Subheader>

      <Subheader>
        <SubheaderRow onPress={() => Alert.alert('Clicked!')}>
          <SubheaderTitle>Clickable Row</SubheaderTitle>
          <SubheaderCount value={12} />
        </SubheaderRow>
        <SubheaderDescription>
          Entire row is clickable when onPress is provided
        </SubheaderDescription>
      </Subheader>

      <Subheader>
        <SubheaderRow onPress={() => Alert.alert('Navigating to accounts')}>
          <SubheaderTitle>Accounts</SubheaderTitle>
          <SubheaderCount value={5} />
          <SubheaderShowMore />
        </SubheaderRow>
        <SubheaderDescription>
          The chevron indicates this row leads to more content
        </SubheaderDescription>
      </Subheader>
    </View>
  );
};
