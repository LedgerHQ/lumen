import figma from '@figma/code-connect';
import { CryptoIcon } from '@ledgerhq/crypto-icons';

figma.connect(
  CryptoIcon,
  'https://www.figma.com/design/zSkvGGiqcnhywp2l3HTHxA?node-id=6159-1866',
  {
    imports: ["import { CryptoIcon } from '@ledgerhq/crypto-icons'"],
    props: {
      ticker: figma.string('asset'),
    },
    // @ts-expect-error — placeholder value, replace with a valid IconSize
    example: (props: { ticker: string }) => <CryptoIcon ticker={props.ticker} ledgerId={props.ticker} size='<insert-size>' />,
  },
);
