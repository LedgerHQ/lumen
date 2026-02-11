import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { Search as SearchIcon } from '../../Symbols';
import { BaseInput } from '../BaseInput';
import { SearchInputProps } from './types';

const containerVariants = cva('', {
  variants: {
    appearance: {
      plain: '',
      transparent:
        'bg-muted-transparent hover:bg-muted-transparent-hover has-disabled:bg-muted-transparent-disabled',
    },
  },
  defaultVariants: {
    appearance: 'plain',
  },
});

const inputVariants = cva('', {
  variants: {
    appearance: {
      plain: '',
      transparent:
        'bg-transparent group-hover:bg-transparent-hover group-has-disabled:bg-transparent-disabled',
    },
  },
  defaultVariants: {
    appearance: 'plain',
  },
});

/**
 * A customizable search input component with built-in search icon, automatic clear button, error states, and focus/hover effects.
 *
 * ## Key Features
 * - **Built-in search icon prefix** automatically positioned on the left (fixed 20px size, muted color)
 * - **Automatic clear button** appears when input has content
 * - **No label support** - uses placeholder text for optimal search UX
 * - **Suffix elements** for icons, buttons, or custom content
 * - **Error state styling** with aria-invalid and errorMessage support
 * - **Flexible styling** via className prop
 *
 * ## Clear Button Behavior
 * - Shows automatically when input has content and is not disabled
 * - Works with both controlled and uncontrolled inputs using native value setter
 * - Can be hidden with `hideClearButton={true}`
 * - Extended behavior via optional `onClear` prop
 *
 * ## Layout & Spacing
 * Uses container-based spacing (px-16 padding + gap-8) for consistent element positioning.
 * Search icon is always visible on the left, suffix elements are automatically hidden when clear button appears.
 *
 *
 * @example
 * // Basic search with automatic clear button
 * <SearchInput placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
 *
 * // Search with error state
 * <SearchInput
 *   placeholder="Search products"
 *   value={searchTerm}
 *   onChange={(e) => setSearchTerm(e.target.value)}
 *   aria-invalid={!isValid}
 *   errorMessage="Search failed. Please try again."
 * />
 *
 * // Search with suffix element
 * <SearchInput
 *   placeholder="Search with filter"
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   suffix={<FilterIcon size={20} className="text-muted" />}
 *   hideClearButton={true} // Keep suffix visible
 * />
 *
 * // Extend clear behavior with analytics
 * <SearchInput
 *   placeholder="Search users"
 *   value={userQuery}
 *   onChange={(e) => setUserQuery(e.target.value)}
 *   onClear={() => {
 *     analytics.track('search_cleared');
 *   }}
 * />
 */
export const SearchInput = ({
  ref,
  appearance = 'plain',
  className,
  inputClassName,
  ...props
}: SearchInputProps) => {
  const searchIcon = (
    <SearchIcon
      size={20}
      // Todo: fix gap between search icon and input not showing input-caret on hover
      // we need to use paddings around the prefix rather then gaps ( radix ui is doing this )
      className='text-muted group-has-disabled:text-disabled'
      aria-hidden='true'
    />
  );

  return (
    <BaseInput
      ref={ref}
      prefix={searchIcon}
      className={className}
      containerClassName={containerVariants({ appearance })}
      inputClassName={cn(inputVariants({ appearance }), inputClassName)}
      {...props}
    />
  );
};

SearchInput.displayName = 'SearchInput';
