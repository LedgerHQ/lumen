import figma from '@figma/code-connect';
import { Placeholder } from '../../Symbols';

figma.connect(
  Placeholder,
  'https://www.figma.com/design/zSkvGGiqcnhywp2l3HTHxA?node-id=5625%3A429',
  {
    imports: ["import { Placeholder } from '@ledgerhq/lumen-ui-react/symbols'"],
    // @ts-expect-error — placeholder value, replace with a valid IconSize
    example: () => <Placeholder size='put correct size' />,
  },
);
