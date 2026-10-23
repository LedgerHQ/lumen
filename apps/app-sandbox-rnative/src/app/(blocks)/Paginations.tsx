import { Box, Pagination, Text } from '@ledgerhq/lumen-ui-rnative';
import { useState } from 'react';

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box lx={{ gap: 's8' }}>
    <Text typography='body3' lx={{ color: 'muted' }}>
      {title}
    </Text>
    {children}
  </Box>
);

export default function Paginations() {
  const [fewPage, setFewPage] = useState(2);
  const [manyPage, setManyPage] = useState(10);
  const [siblingsPage, setSiblingsPage] = useState(10);
  const [compactPage, setCompactPage] = useState(2);

  return (
    <Box lx={{ gap: 's32', width: 'full' }}>
      <Section title='Expanded — few pages'>
        <Pagination page={fewPage} totalPages={3} onPageChange={setFewPage} />
      </Section>
      <Section title='Expanded — many pages (scrolls on narrow screens)'>
        <Pagination
          page={manyPage}
          totalPages={20}
          onPageChange={setManyPage}
        />
      </Section>
      <Section title='Expanded — siblingCount 2'>
        <Pagination
          page={siblingsPage}
          totalPages={20}
          siblingCount={2}
          onPageChange={setSiblingsPage}
        />
      </Section>
      <Section title='Compact'>
        <Pagination
          page={compactPage}
          totalPages={8}
          density='compact'
          onPageChange={setCompactPage}
        />
      </Section>
    </Box>
  );
}
