import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Information } from '../../Symbols';
import { Button } from '../Button';
import { InteractiveIcon } from '../InteractiveIcon';
import { Box } from '../Utility/Box';
import { Text } from '../Utility/Text';
import { GlobalTooltipBottomSheet } from './GlobalTooltipBottomSheet';
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  subcomponents: { TooltipTrigger, TooltipContent },
  title: 'Communication/Tooltip',
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Base: Story = {
  render: () => (
    <>
      <Box
        lx={{
          minHeight: 's400',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 's24',
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Press me</Button>
          </TooltipTrigger>
          <TooltipContent
            title='My tooltip title'
            content={<Text typography='body2'>This is a helpful tooltip</Text>}
          />
        </Tooltip>
      </Box>
      <GlobalTooltipBottomSheet />
    </>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <>
      <Box
        lx={{
          minHeight: 's400',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 's24',
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Press me</Button>
          </TooltipTrigger>
          <TooltipContent
            title='My tooltip title'
            content={
              <Box lx={{ alignItems: 'flex-start', gap: 's12' }}>
                <Text typography='body2' lx={{ color: 'muted' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
                <Button size='sm' appearance='accent'>
                  Custom tooltip action
                </Button>
              </Box>
            }
          />
        </Tooltip>
      </Box>
      <GlobalTooltipBottomSheet />
    </>
  ),
};

export const WithMultipleTooltips: Story = {
  render: () => (
    <>
      <Box
        lx={{
          minHeight: 's400',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 's16',
          padding: 's24',
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Tooltip 1</Button>
          </TooltipTrigger>
          <TooltipContent
            title='First'
            content={<Text typography='body2'>First tooltip content</Text>}
          />
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Tooltip 2</Button>
          </TooltipTrigger>
          <TooltipContent
            title='Second'
            content={<Text typography='body2'>Second tooltip content</Text>}
          />
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <InteractiveIcon
              iconType='filled'
              icon={Information}
              accessibilityLabel='Info'
            />
          </TooltipTrigger>
          <TooltipContent
            title='Third'
            content={<Text typography='body2'>Third tooltip content</Text>}
          />
        </Tooltip>
      </Box>
      <GlobalTooltipBottomSheet />
    </>
  ),
};

export const WithChangeCallback: Story = {
  render: () => {
    return (
      <>
        <Box
          lx={{
            minHeight: 's400',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 's24',
          }}
        >
          <Tooltip
            onOpenChange={(newOpen) => alert(`Opened changes to: ${newOpen}`)}
          >
            <TooltipTrigger asChild>
              <Button>Press me</Button>
            </TooltipTrigger>
            <TooltipContent
              title='My tooltip title'
              content={
                <Text typography='body2'>This is a helpful tooltip</Text>
              }
            />
          </Tooltip>
        </Box>
        <GlobalTooltipBottomSheet />
      </>
    );
  },
};
