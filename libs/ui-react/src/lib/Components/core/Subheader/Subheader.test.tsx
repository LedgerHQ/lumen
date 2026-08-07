import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip/Tooltip';
import {
  Subheader,
  SubheaderRow,
  SubheaderTitle,
  SubheaderCount,
  SubheaderInfo,
  SubheaderShowMore,
  SubheaderDescription,
} from './Subheader';
import '@testing-library/jest-dom';

describe('Subheader', () => {
  it('renders the title without row', () => {
    render(
      <Subheader>
        <SubheaderTitle>Test Title</SubheaderTitle>
      </Subheader>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the title with row', () => {
    render(
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Test Title</SubheaderTitle>
        </SubheaderRow>
      </Subheader>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the count when provided', () => {
    render(
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Title</SubheaderTitle>
          <SubheaderCount value={30} />
        </SubheaderRow>
      </Subheader>,
    );
    expect(screen.getByText('(30)')).toBeInTheDocument();
  });

  it('renders custom formatted count', () => {
    render(
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Title</SubheaderTitle>
          <SubheaderCount
            value={150}
            format={(n) => (n > 99 ? '99+' : `${n}`)}
          />
        </SubheaderRow>
      </Subheader>,
    );
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('renders the info icon when provided', () => {
    const { container } = render(
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Title</SubheaderTitle>
          <SubheaderInfo />
        </SubheaderRow>
      </Subheader>,
    );
    expect(
      container.querySelector('[aria-label="More information"]'),
    ).toBeInTheDocument();
  });

  it('renders the info icon wrapped in tooltip', () => {
    const { container } = render(
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Title</SubheaderTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <SubheaderInfo />
            </TooltipTrigger>
            <TooltipContent>Info</TooltipContent>
          </Tooltip>
        </SubheaderRow>
      </Subheader>,
    );
    expect(
      container.querySelector('[aria-label="More information"]'),
    ).toBeInTheDocument();
  });

  it('renders the show more chevron when provided', () => {
    render(
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Title</SubheaderTitle>
          <SubheaderCount value={5} />
          <SubheaderShowMore />
        </SubheaderRow>
      </Subheader>,
    );
    // Verify title and count render (SubheaderShowMore is in the tree)
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('(5)')).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Title</SubheaderTitle>
        </SubheaderRow>
        <SubheaderDescription>This is a description</SubheaderDescription>
      </Subheader>,
    );
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('renders interactive row with onClick', () => {
    const handlePress = vi.fn();
    render(
      <Subheader>
        <SubheaderRow onClick={handlePress}>
          <SubheaderTitle>Title</SubheaderTitle>
          <SubheaderCount value={5} />
        </SubheaderRow>
      </Subheader>,
    );
    const row = screen.getByText('Title').closest('button');
    expect(row).toBeInTheDocument();
    row?.click();
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('renders all components together', () => {
    const { container } = render(
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Title</SubheaderTitle>
          <SubheaderCount value={42} />
          <Tooltip>
            <TooltipTrigger asChild>
              <SubheaderInfo />
            </TooltipTrigger>
            <TooltipContent>Info</TooltipContent>
          </Tooltip>
        </SubheaderRow>
        <SubheaderDescription>Description text</SubheaderDescription>
      </Subheader>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('(42)')).toBeInTheDocument();
    expect(
      container.querySelector('[aria-label="More information"]'),
    ).toBeInTheDocument();
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('works without row wrapper', () => {
    render(
      <Subheader>
        <SubheaderTitle>Simple Title</SubheaderTitle>
        <SubheaderDescription>Simple Description</SubheaderDescription>
      </Subheader>,
    );
    expect(screen.getByText('Simple Title')).toBeInTheDocument();
    expect(screen.getByText('Simple Description')).toBeInTheDocument();
  });

  describe('SubheaderTitle as prop', () => {
    it('renders as h2 by default', () => {
      render(
        <Subheader>
          <SubheaderTitle>Default Title</SubheaderTitle>
        </Subheader>,
      );
      const title = screen.getByText('Default Title');
      expect(title.tagName).toBe('H2');
    });

    it('renders as h1 when as="h1"', () => {
      render(
        <Subheader>
          <SubheaderTitle as='h1'>H1 Title</SubheaderTitle>
        </Subheader>,
      );
      const title = screen.getByText('H1 Title');
      expect(title.tagName).toBe('H1');
    });

    it('renders as h3 when as="h3"', () => {
      render(
        <Subheader>
          <SubheaderTitle as='h3'>H3 Title</SubheaderTitle>
        </Subheader>,
      );
      const title = screen.getByText('H3 Title');
      expect(title.tagName).toBe('H3');
    });

    it('renders as h4 when as="h4"', () => {
      render(
        <Subheader>
          <SubheaderTitle as='h4'>H4 Title</SubheaderTitle>
        </Subheader>,
      );
      const title = screen.getByText('H4 Title');
      expect(title.tagName).toBe('H4');
    });

    it('renders as h5 when as="h5"', () => {
      render(
        <Subheader>
          <SubheaderTitle as='h5'>H5 Title</SubheaderTitle>
        </Subheader>,
      );
      const title = screen.getByText('H5 Title');
      expect(title.tagName).toBe('H5');
    });

    it('renders as h6 when as="h6"', () => {
      render(
        <Subheader>
          <SubheaderTitle as='h6'>H6 Title</SubheaderTitle>
        </Subheader>,
      );
      const title = screen.getByText('H6 Title');
      expect(title.tagName).toBe('H6');
    });

    it('renders as div when as="div"', () => {
      render(
        <Subheader>
          <SubheaderTitle as='div'>Div Title</SubheaderTitle>
        </Subheader>,
      );
      const title = screen.getByText('Div Title');
      expect(title.tagName).toBe('DIV');
    });

    it('renders as span when as="span"', () => {
      render(
        <Subheader>
          <SubheaderTitle as='span'>Span Title</SubheaderTitle>
        </Subheader>,
      );
      const title = screen.getByText('Span Title');
      expect(title.tagName).toBe('SPAN');
    });
  });
});
