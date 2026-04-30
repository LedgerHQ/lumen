/** Single space: drives floating-label / placeholder-shown behavior when no user-facing placeholder is set. */
const PLACEHOLDER_FOR_FLOAT = ' ';

export type ResolveBaseInputPlaceholderArgs = {
  label: string | undefined;
  /** Raw `placeholder` from the input props (before spreading onto the field). */
  placeholder: string | undefined;
};

export type ResolveBaseInputPlaceholderResult = {
  /** Value to set on the native input `placeholder`. */
  inputPlaceholder: string;
  /**
   * When a floating label and a non-empty user placeholder are both in use, the label must
   * stay in the “floated” slot (not the empty-field centered position).
   */
  labelStaysFloatedWithPlaceholder: boolean;
};

/**
 * Derives the native `placeholder` and floating-label mode for Lumen `BaseInput`.
 * Web and React Native share this so label + example copy, and prefix-only fields, stay consistent.
 */
export const resolveBaseInputPlaceholder = ({
  label,
  placeholder,
}: ResolveBaseInputPlaceholderArgs): ResolveBaseInputPlaceholderResult => {
  const userText =
    typeof placeholder === 'string' && placeholder.trim().length > 0
      ? placeholder
      : undefined;

  if (label) {
    return {
      inputPlaceholder: userText ?? PLACEHOLDER_FOR_FLOAT,
      labelStaysFloatedWithPlaceholder: userText !== undefined,
    };
  }

  return {
    inputPlaceholder: placeholder ?? PLACEHOLDER_FOR_FLOAT,
    labelStaysFloatedWithPlaceholder: false,
  };
};
