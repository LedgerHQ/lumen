import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import {
  ListItem,
  ListItemContent,
  ListItemLeading,
  ListItemTitle,
} from '../ListItem';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  component: SearchInput,
  title: 'Input/SearchInput',
  args: {
    appearance: 'plain',
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

/**
 * The default search component with a search icon prefix and automatic clear button functionality.
 */
export const Default: Story = {
  args: {
    placeholder: 'Search text',
  },
  parameters: {
    docs: {
      source: {
        code: '<SearchInput placeholder="Search text" />',
      },
    },
  },
};

/**
 * Empty search showing placeholder text.
 */
export const Empty: Story = {
  args: {
    placeholder: 'Search text',
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      source: {
        code: '<SearchInput placeholder="Search text" className="max-w-md" />',
      },
    },
  },
};

/**
 * Search with content showing the clear button.
 */
export const WithContent: Story = {
  args: {
    placeholder: 'Search text',
    defaultValue: 'Search text',
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      source: {
        code: '<SearchInput placeholder="Search text" defaultValue="Search text" className="max-w-md" />',
      },
    },
  },
};

/**
 * Disabled search input.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Search text',
    disabled: true,
    defaultValue: 'Disabled input',
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      source: {
        code: '<SearchInput placeholder="Search text" disabled defaultValue="Disabled input" className="max-w-md" />',
      },
    },
  },
};

/**
 * Search in error state with error message.
 */
export const Error: Story = {
  args: {
    placeholder: 'Search text',
    defaultValue: 'Invalid search',
    errorMessage: 'Search term is invalid',
    'aria-invalid': true,
    className: 'max-w-md',
  },
  parameters: {
    docs: {
      source: {
        code: `<SearchInput 
  placeholder="Search text"
  defaultValue="Invalid search"
  errorMessage="Search term is invalid"
  aria-invalid={true}
  className="max-w-md"
/>`,
      },
    },
  },
};

/**
 * Search component with properly debounced search operation.
 * The search query is debounced, not just the results rendering.
 * This prevents excessive API calls in real applications.
 */
export const DebouncedSearchInput: Story = {
  render: () => {
    const [inputValue, setInputValue] = React.useState(''); // Display value (updates immediately)
    const [searchQuery, setSearchQuery] = React.useState(''); // Debounced search query
    const [filteredResults, setFilteredResults] = React.useState<string[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);

    const items = [
      'Apple',
      'Banana',
      'Cherry',
      'Date',
      'Elderberry',
      'Fig',
      'Grape',
      'Blueberry',
      'Orange',
      'Pineapple',
    ];

    const debounce = React.useCallback(
      (callback: (...args: any[]) => void, wait: number) => {
        let timeoutId: number | null = null;
        return (...args: any[]) => {
          if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
          }
          timeoutId = window.setTimeout(() => {
            callback(...args);
          }, wait);
        };
      },
      [],
    );

    const debouncedSearch = React.useMemo(
      () =>
        debounce((query: string) => {
          console.log('🔍 Performing search for:', query); // This would be your API call
          setIsSearching(false);
          setSearchQuery(query);
        }, 500),
      [debounce],
    );

    // Handle input change (updates display immediately)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setIsSearching(value.trim().length > 0);
      debouncedSearch(value);
    };

    // Filter results when search query changes (this would be your API response)
    React.useEffect(() => {
      if (searchQuery.trim() === '') {
        setFilteredResults([]);
      } else {
        const results = items.filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredResults(results);
      }
    }, [searchQuery]);

    const handleClear = () => {
      setSearchQuery('');
      setFilteredResults([]);
      setIsSearching(false);
    };

    return (
      <div className='max-w-md space-y-16'>
        <SearchInput
          placeholder='Search fruits (properly debounced)'
          value={inputValue}
          onChange={handleInputChange}
          onClear={handleClear}
        />
        {/* Search status indicator */}
        {isSearching && (
          <div className='body-3 text-muted italic'>Searching...</div>
        )}
        {/* Results */}
        {inputValue.length > 0 && !isSearching && (
          <div className='rounded-md bg-muted p-16'>
            {filteredResults.length > 0 ? (
              <div>
                <p className='mb-8 body-3 text-muted'>
                  Found {filteredResults.length} result
                  {filteredResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
                <div className='space-y-4'>
                  {filteredResults.map((result) => (
                    <ListItem key={result}>
                      <ListItemLeading>
                        <ListItemContent>
                          <ListItemTitle>{result}</ListItemTitle>
                        </ListItemContent>
                      </ListItemLeading>
                    </ListItem>
                  ))}
                </div>
              </div>
            ) : (
              <div className='text-center'>
                <p className='body-2 text-muted'>Nothing found</p>
                <p className='mt-4 body-3 text-muted'>
                  No fruits match "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
};
