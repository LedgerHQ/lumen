import figma from '@figma/code-connect';
import { CryptoIcon } from '@ledgerhq/crypto-icons';
import React from 'react';
import {
  TableRoot,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableCellContent,
  TableSortButton,
} from './Table';

figma.connect(
  TableRoot,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11618%3A5962',
  {
    imports: [
      "import { TableRoot, Table, TableHeader, TableHeaderRow, TableHeaderCell, TableBody, TableRow, TableCell, TableCellContent, TableSortButton } from '@ledgerhq/lumen-ui-react'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
    ],
    props: {
      appearance: figma.enum('appearance', {
        'no-background': 'no-background',
        plain: 'plain',
        transparent: 'no-background',
      }),
    },
    example: (props) => (
      <TableRoot appearance={props.appearance}>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>
                <TableSortButton sortDirection='asc' onToggleSort={() => {}}>
                  Name
                </TableSortButton>
              </TableHeaderCell>
              <TableHeaderCell>Market cap</TableHeaderCell>
              <TableHeaderCell align='end'>Price</TableHeaderCell>
              <TableHeaderCell align='end'>Change</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            <TableRow clickable onClick={() => {}}>
              <TableCell>
                <TableCellContent
                  leadingContent={
                    <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />
                  }
                  title='Bitcoin'
                  description='BTC'
                />
              </TableCell>
              <TableCell>$1.2T</TableCell>
              <TableCell align='end'>$62,000.00</TableCell>
              <TableCell align='end'>+2.4%</TableCell>
            </TableRow>
            <TableRow clickable onClick={() => {}}>
              <TableCell>
                <TableCellContent
                  leadingContent={
                    <CryptoIcon ledgerId='ethereum' ticker='ETH' size='32px' />
                  }
                  title='Ethereum'
                  description='ETH'
                />
              </TableCell>
              <TableCell>$380B</TableCell>
              <TableCell align='end'>$3,200.00</TableCell>
              <TableCell align='end'>-1.2%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableRoot>
    ),
  },
);
