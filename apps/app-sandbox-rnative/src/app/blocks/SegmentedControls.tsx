import {
  Box,
  createSegmentedControl,
  DotCount,
  Text,
} from '@ledgerhq/lumen-ui-rnative';
import { Code, Eye, EyeCross } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';

type ViewType = 'preview' | 'raw' | 'blame';

const { SegmentedControl, SegmentedControlButton } =
  createSegmentedControl<ViewType>();

export const SegmentedControls = () => {
  const [fitState, setFitState] = useState<ViewType>('preview');
  const [fixedState, setFixedState] = useState<ViewType>('preview');
  const [iconsState, setIconsState] = useState<ViewType>('preview');
  const [trailingState, setTrailingState] = useState<ViewType>('preview');
  const [preSelectedFitState, setPreSelectedFitState] =
    useState<ViewType>('blame');
  const [preSelectedFixedState, setPreSelectedFixedState] =
    useState<ViewType>('blame');

  return (
    <Box lx={{ gap: 's24', width: 'full' }}>
      <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
        Fit
      </Text>
      <SegmentedControl
        selectedValue={fitState}
        onSelectedChange={setFitState}
        tabLayout='fit'
        accessibilityLabel='Fit layout'
      >
        <SegmentedControlButton value='preview'>Preview</SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
        <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
      </SegmentedControl>

      <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
        Fixed
      </Text>
      <SegmentedControl
        selectedValue={fixedState}
        onSelectedChange={setFixedState}
        tabLayout='fixed'
        accessibilityLabel='Fixed layout'
      >
        <SegmentedControlButton value='preview'>Preview</SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
        <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
      </SegmentedControl>

      <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
        With Icons (fit)
      </Text>
      <SegmentedControl
        selectedValue={iconsState}
        onSelectedChange={setIconsState}
        tabLayout='fit'
        accessibilityLabel='File view with icons'
      >
        <SegmentedControlButton value='preview' icon={Eye}>
          Preview
        </SegmentedControlButton>
        <SegmentedControlButton value='raw' icon={Code}>
          Raw
        </SegmentedControlButton>
        <SegmentedControlButton value='blame' icon={EyeCross}>
          Blame
        </SegmentedControlButton>
      </SegmentedControl>

      <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
        Pre-selected (fit)
      </Text>
      <SegmentedControl
        selectedValue={preSelectedFitState}
        onSelectedChange={setPreSelectedFitState}
        tabLayout='fit'
        accessibilityLabel='Pre-selected fit layout'
      >
        <SegmentedControlButton value='preview'>Preview</SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
        <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
      </SegmentedControl>

      <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
        Pre-selected (fixed)
      </Text>
      <SegmentedControl
        selectedValue={preSelectedFixedState}
        onSelectedChange={setPreSelectedFixedState}
        tabLayout='fixed'
        accessibilityLabel='Pre-selected fixed layout'
      >
        <SegmentedControlButton value='preview'>Preview</SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
        <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
      </SegmentedControl>

      <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
        With trailing content (fit)
      </Text>
      <SegmentedControl
        selectedValue={trailingState}
        onSelectedChange={setTrailingState}
        tabLayout='fit'
        accessibilityLabel='With trailing content'
      >
        <SegmentedControlButton
          value='preview'
          trailingContent={<DotCount value={3} size='md' />}
        >
          Preview
        </SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>

        <SegmentedControlButton
          value='blame'
          trailingContent={<DotCount value={100} size='md' />}
        >
          Blame
        </SegmentedControlButton>
      </SegmentedControl>
    </Box>
  );
};
