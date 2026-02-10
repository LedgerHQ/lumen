import React from 'react';
import { BaseInput } from '../BaseInput';
import { TextInputProps } from './types';

/**
 * A customizable input component with floating label, automatic clear button, error states, and focus/hover effects.
 *
 * ## Key Features
 * - **Automatic clear button** appears when input has content
 * - **Floating label** with smooth CSS-only animations
 * - **Suffix elements** for icons, buttons, or custom content
 * - **Error state styling** with aria-invalid and errorMessage support
 * - **Container-based spacing** with padding and gap for clean layout
 * - **Flexible styling** via className
 *
 * ## Clear Button Behavior
 * - Shows automatically when input has content and is not disabled
 * - Works with both controlled and uncontrolled inputs using native value setter
 * - Can be hidden with `hideClearButton={true}`
 * - Extended behavior via optional `onClear` prop
 *
 * ## Layout & Spacing
 * Uses container-based spacing (px-16 padding + gap-8) for consistent element positioning.
 * Suffix elements are automatically hidden when clear button appears.
 *
 *
 * @example
 * // Basic input with automatic clear button
 * <TextInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
 *
 * // Input with error state
 * <TextInput
 *   label="Email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   aria-invalid={!isValid}
 *   errorMessage="Please enter a valid email address"
 * />
 *
 * // Input with suffix element
 * <TextInput
 *   label="Search"
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   suffix={<SearchIcon size={20} className="text-muted" />}
 *   hideClearButton={true} // Keep suffix visible
 * />
 *
 * // Extend clear behavior with analytics
 * <TextInput
 *   label="Username"
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 *   onClear={() => {
 *     analytics.track('username_cleared');
 *   }}
 * />
 */
export const TextInput = ({
  ref,
  ...props
}: TextInputProps & {
  ref?: React.Ref<HTMLInputElement>;
}) => {
  return <BaseInput ref={ref} {...props} />;
};

TextInput.displayName = 'TextInput';
