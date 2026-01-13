
import { Text } from "../Text";

/* 
  Context: Prose
  Role: Continuous reading flow
*/

export const Prose = {
    Title: ({ children, style, ...props }: any) => (
        <Text as="h2" style={{
            fontSize: "var(--prose-title-size)",
            fontWeight: "var(--prose-title-weight)",
            lineHeight: "var(--prose-title-height)",
            letterSpacing: "var(--prose-title-spacing)",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
    Body: ({ children, style, ...props }: any) => (
        <Text as="p" style={{
            fontSize: "var(--prose-body-size)",
            fontWeight: "var(--prose-body-weight)",
            lineHeight: "var(--prose-body-height)",
            letterSpacing: "var(--prose-body-spacing)",
            marginBottom: "1em",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
    Note: ({ children, style, ...props }: any) => (
        <Text as="p" style={{
            fontSize: "var(--prose-note-size)",
            fontWeight: "var(--prose-note-weight)",
            lineHeight: "var(--prose-note-height)",
            letterSpacing: "var(--prose-note-spacing)",
            color: "var(--prose-note-color)",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
};
