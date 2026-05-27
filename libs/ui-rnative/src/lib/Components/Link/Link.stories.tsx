import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Settings, Information, ArrowRight } from '../../Symbols';
import { Box, Text } from '../Utility';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  component: Link,
  title: 'Action/Link',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    appearance: {
      control: 'select',
      options: ['base', 'accent'],
      description: 'The visual style appearance of the link',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'The size of the link',
    },
    underline: {
      control: 'boolean',
      description: 'Whether to underline the link text',
    },
    icon: {
      control: 'select',
      description: 'Optional icon component to display',
      options: ['None', 'Information', 'Settings', 'ArrowRight'],
      mapping: {
        None: undefined,
        Information: Information,
        Settings: Settings,
        ArrowRight: ArrowRight,
      },
    },
    isExternal: {
      control: 'boolean',
      description: 'Whether to display external link icon',
    },
    children: {
      control: 'text',
      description: 'The content to be displayed inside the link',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;
type LinkAppearance = 'base' | 'accent';

export const Base: Story = {
  args: {
    appearance: 'base',
    size: 'md',
    children: 'Base Link',
    href: 'https://ledger.com',
  },
  parameters: {
    docs: {
      source: {
        code: `
<Link appearance="base" href="https://ledger.com">
  Base Link
</Link>
`,
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    appearance: 'base',
    children: 'Link with Icon',
    icon: Information,
    href: 'https://ledger.com',
  },
  parameters: {
    docs: {
      source: {
        code: `
<Link
  appearance="base"
  icon={Information}
  href="https://ledger.com"
>
  Link with Icon
</Link>
`,
      },
    },
  },
};

export const External: Story = {
  args: {
    appearance: 'base',
    children: 'External Link',
    isExternal: true,
    href: 'https://ledger.com',
  },
  parameters: {
    docs: {
      source: {
        code: `
<Link
  appearance="base"
  isExternal
  href="https://ledger.com"
>
  External Link
</Link>
`,
      },
    },
  },
};

export const ExternalLinkWithIcon: Story = {
  args: {
    appearance: 'base',
    size: 'md',
    children: 'External Link with Icon',
    icon: Information,
    isExternal: true,
    href: 'https://ledger.com',
  },
  parameters: {
    docs: {
      source: {
        code: `
<Link
  appearance="base"
  size="md"
  icon={Information}
  isExternal
  href="https://ledger.com"
>
  External Link with Icon
</Link>
`,
      },
    },
  },
};

export const AppearanceShowcase: Story = {
  render: () => {
    const appearances: { name: string; appearance: LinkAppearance }[] = [
      { name: 'Base', appearance: 'base' },
      { name: 'Accent', appearance: 'accent' },
    ];

    return (
      <Box lx={{ flexDirection: 'row', gap: 's32', padding: 's8' }}>
        {appearances.map(({ name, appearance }) => (
          <Link
            key={appearance}
            size='md'
            appearance={appearance}
            href='https://ledger.com'
            icon={Information}
            isExternal
          >
            {name}
          </Link>
        ))}
      </Box>
    );
  },
};

export const UnderlineShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16', padding: 's8' }}>
      <Link appearance='accent' size='md' href='https://ledger.com'>
        With underline
      </Link>
      <Link
        appearance='accent'
        size='md'
        underline={false}
        href='https://ledger.com'
      >
        Without underline
      </Link>
    </Box>
  ),
};

export const SizesShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Box
        lx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 's32',
          padding: 's8',
        }}
      >
        <Link
          appearance='base'
          size='sm'
          href='https://ledger.com'
          icon={Information}
          isExternal
        >
          Small
        </Link>
        <Link
          appearance='base'
          size='md'
          href='https://ledger.com'
          icon={Information}
          isExternal
        >
          Medium
        </Link>
      </Box>
      <Box
        lx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 's32',
          padding: 's8',
        }}
      >
        <Link
          appearance='accent'
          size='sm'
          href='https://ledger.com'
          icon={Information}
          isExternal
        >
          Small Accent
        </Link>
        <Link
          appearance='accent'
          size='md'
          href='https://ledger.com'
          icon={Information}
          isExternal
        >
          Medium Accent
        </Link>
      </Box>
    </Box>
  ),
};

export const StatesShowcase: Story = {
  render: () => (
    <Box
      lx={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 's16',
        padding: 's8',
      }}
    >
      <Link appearance='base' href='https://ledger.com'>
        Default
      </Link>
      <Link appearance='accent' href='https://ledger.com' icon={ArrowRight}>
        With Icon
      </Link>
    </Box>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box
      lx={{
        width: 's256',
        flexDirection: 'column',
        gap: 's8',
        borderRadius: 'sm',
        borderColor: 'mutedSubtle',
        borderWidth: 's1',
        padding: 's8',
      }}
    >
      <Link underline href='https://ledger.com'>
        Short Link
      </Link>
      <Link appearance='base' href='https://ledger.com'>
        This is a longer link text that will be truncated with ellipsis when it
        exceeds the container width
      </Link>
      <Link
        appearance='base'
        href='https://ledger.com'
        icon={Information}
        isExternal
      >
        Base with long text that is cut off
      </Link>
    </Box>
  ),
};

export const WithCustomNavigation: Story = {
  render: () => {
    const handlePress = () => {
      console.log('Custom navigation triggered');
      // In a real app: navigation.navigate('Dashboard')
    };

    return (
      <Box lx={{ flexDirection: 'column', gap: 's16', padding: 's8' }}>
        <Link appearance='base' size='md' onPress={handlePress}>
          Navigate to Dashboard
        </Link>
        <Link
          appearance='accent'
          size='md'
          icon={ArrowRight}
          onPress={handlePress}
        >
          Continue to Next Screen
        </Link>
      </Box>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useNavigation } from '@react-navigation/native';

function MyComponent() {
  const navigation = useNavigation();
  
  return (
    <>
      <Link
        appearance="base"
        size="md"
        onPress={() => navigation.navigate('Dashboard')}
      >
        Navigate to Dashboard
      </Link>
      
      <Link
        appearance="accent"
        size="md"
        icon={ArrowRight}
        onPress={() => navigation.navigate('Next')}
      >
        Continue to Next Screen
      </Link>
    </>
  );
}
`,
      },
    },
  },
};

export const InTextUsage: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's32', padding: 's8' }}>
      <Text typography='body2' lx={{ color: 'base' }}>
        By continuing, you agree to our{' '}
        <Link appearance='base' size='sm' href='https://ledger.com/terms'>
          Terms & Conditions
        </Link>{' '}
        and{' '}
        <Link appearance='base' size='sm' href='https://ledger.com/privacy'>
          Privacy Policy
        </Link>
        .
      </Text>

      <Text typography='body1SemiBold' lx={{ color: 'interactive' }}>
        Need help?{' '}
        <Link appearance='accent' size='md' href='https://ledger.com/support'>
          Contact Support
        </Link>
      </Text>

      <Text typography='body1SemiBold' lx={{ color: 'base' }}>
        Already have an account?{' '}
        <Link
          appearance='accent'
          size='md'
          underline={false}
          href='https://ledger.com/signin'
        >
          Sign in
        </Link>
      </Text>
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
// Links within text content
<Text typography='body2' lx={{ color: 'base' }}>
  By continuing, you agree to our{' '}
  <Link appearance='base' size='sm' href='https://ledger.com/terms'>
    Terms & Conditions
  </Link>{' '}
  and{' '}
  <Link appearance='base' size='sm' href='https://ledger.com/privacy'>
    Privacy Policy
  </Link>.
</Text>

// Heading with inline link
<Text typography='body1SemiBold' lx={{ color: 'interactive' }}>
  Need help?{' '}
  <Link appearance='accent' size='md' href='https://ledger.com/support'>
    Contact Support
  </Link>
</Text>

// Bold text with ununderlined link
<Text typography='body1SemiBold' lx={{ color: 'base' }}>
  Already have an account?{' '}
  <Link
    appearance='accent'
    size='md'
    underline={false}
    href='https://ledger.com/signin'
  >
    Sign in
  </Link>
</Text>
`,
      },
    },
  },
};
