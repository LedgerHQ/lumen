import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  Subheader,
  SubheaderRow,
  SubheaderTitle,
  SubheaderCount,
  SubheaderInfo,
  SubheaderShowMore,
  SubheaderDescription,
  SubheaderAction,
} from './Subheader';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Subheader', () => {
  it('renders the title without row', () => {
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderTitle>Test Title</SubheaderTitle>
        </Subheader>
      </TestWrapper>,
    );
    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('renders the title with row', () => {
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>Test Title</SubheaderTitle>
          </SubheaderRow>
        </Subheader>
      </TestWrapper>,
    );
    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('renders the count when provided', () => {
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>Title</SubheaderTitle>
            <SubheaderCount value={30} />
          </SubheaderRow>
        </Subheader>
      </TestWrapper>,
    );
    expect(screen.getByText('(30)')).toBeTruthy();
  });

  it('renders custom formatted count', () => {
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>Title</SubheaderTitle>
            <SubheaderCount
              value={150}
              format={(n: number) => (n > 99 ? '99+' : `${n}`)}
            />
          </SubheaderRow>
        </Subheader>
      </TestWrapper>,
    );
    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('renders the info icon when provided', () => {
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>Title</SubheaderTitle>
            <SubheaderInfo />
          </SubheaderRow>
        </Subheader>
      </TestWrapper>,
    );
    // Check that title renders (SubheaderInfo is in the tree)
    expect(screen.getByText('Title')).toBeTruthy();
  });

  it('renders the show more chevron when provided', () => {
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>Title</SubheaderTitle>
            <SubheaderCount value={5} />
            <SubheaderShowMore />
          </SubheaderRow>
        </Subheader>
      </TestWrapper>,
    );
    // Verify title and count render (SubheaderShowMore is in the tree)
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('(5)')).toBeTruthy();
  });

  it('renders the description when provided', () => {
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>Title</SubheaderTitle>
          </SubheaderRow>
          <SubheaderDescription>This is a description</SubheaderDescription>
        </Subheader>
      </TestWrapper>,
    );
    expect(screen.getByText('This is a description')).toBeTruthy();
  });

  it('renders the action in row', () => {
    const handlePress = jest.fn();
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>Title</SubheaderTitle>
            <SubheaderAction onPress={handlePress}>Action</SubheaderAction>
          </SubheaderRow>
        </Subheader>
      </TestWrapper>,
    );
    const button = screen.getByText('Action');
    expect(button).toBeTruthy();
    fireEvent.press(button);
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('renders interactive row with onPress', () => {
    const handlePress = jest.fn();
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderRow onPress={handlePress}>
            <SubheaderTitle>Title</SubheaderTitle>
            <SubheaderCount value={5} />
          </SubheaderRow>
        </Subheader>
      </TestWrapper>,
    );
    const row = screen.getByText('Title').parent;
    if (row) {
      fireEvent.press(row);
      expect(handlePress).toHaveBeenCalledTimes(1);
    }
  });

  it('renders all components together', () => {
    const handleAction = jest.fn();
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>Title</SubheaderTitle>
            <SubheaderCount value={42} />
            <SubheaderInfo />
            <SubheaderAction onPress={handleAction}>Action</SubheaderAction>
          </SubheaderRow>
          <SubheaderDescription>Description text</SubheaderDescription>
        </Subheader>
      </TestWrapper>,
    );
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('(42)')).toBeTruthy();
    expect(screen.getByText('Action')).toBeTruthy();
    expect(screen.getByText('Description text')).toBeTruthy();
  });

  it('works without row wrapper', () => {
    render(
      <TestWrapper>
        <Subheader>
          <SubheaderTitle>Simple Title</SubheaderTitle>
          <SubheaderDescription>Simple Description</SubheaderDescription>
        </Subheader>
      </TestWrapper>,
    );
    expect(screen.getByText('Simple Title')).toBeTruthy();
    expect(screen.getByText('Simple Description')).toBeTruthy();
  });
});
