import { Text } from "../Text.tsx";

/* 
  Context: Prose
  Role: Continuous reading flow
*/

export const Prose = {
  Title: ({ children, style, variant, ...props }: any) => {
    // Map variants to specific prose heading tokens (h1-h4)
    // Default (undefined) falls back to the context-aware 'prose-title' token
    const suffix = variant
      ? {
          xl: "h1", // Display
          lg: "h2", // Heading 1
          md: "h3", // Heading 2
          sm: "h4", // Heading 3
        }[variant as string]
      : "title";

    return (
      <Text
        as="h2"
        style={{
          fontSize: `var(--prose-${suffix}-size)`,
          fontWeight: `var(--prose-${suffix}-weight)`,
          lineHeight: `var(--prose-${suffix}-height)`,
          letterSpacing: `var(--prose-${suffix}-spacing)`,
          ...style,
        }}
        {...props}
      >
        {children}
      </Text>
    );
  },
  Body: ({ children, style, ...props }: any) => (
    <Text
      as="p"
      style={{
        fontSize: "var(--prose-body-size)",
        fontWeight: "var(--prose-body-weight)",
        lineHeight: "var(--prose-body-height)",
        letterSpacing: "var(--prose-body-spacing)",
        marginBottom: "1em",
        ...style,
      }}
      {...props}
    >
      {children}
    </Text>
  ),
  Note: ({ children, style, ...props }: any) => (
    <Text
      as="p"
      style={{
        fontSize: "var(--prose-note-size)",
        fontWeight: "var(--prose-note-weight)",
        lineHeight: "var(--prose-note-height)",
        letterSpacing: "var(--prose-note-spacing)",
        color: "var(--prose-note-color)",
        ...style,
      }}
      {...props}
    >
      {children}
      {children}
    </Text>
  ),
  Code: ({ children, style, ...props }: any) => (
    <Text
      as="code"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--prose-code-size)",
        fontWeight: "var(--prose-code-weight)",
        lineHeight: "var(--prose-code-height)",
        letterSpacing: "var(--prose-code-spacing)",
        color: "var(--prose-code-color)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Text>
  ),
};
