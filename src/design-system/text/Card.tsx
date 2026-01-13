
import { Text } from "../Text";

/* 
  Context: Card
  Role: Summarized chunk of information
*/

export const Card = {
    Title: ({ children, style, ...props }: any) => (
        <Text as="h3" style={{
            fontSize: "var(--card-title-size)",
            fontWeight: "var(--card-title-weight)",
            lineHeight: "var(--card-title-height)",
            letterSpacing: "var(--card-title-spacing)",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
    Desc: ({ children, style, ...props }: any) => (
        <Text as="p" style={{
            fontSize: "var(--card-desc-size)",
            fontWeight: "var(--card-desc-weight)",
            lineHeight: "var(--card-desc-height)",
            letterSpacing: "var(--card-desc-spacing)",
            color: "var(--card-desc-color)",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
    Note: ({ children, style, ...props }: any) => (
        <Text as="span" style={{
            fontSize: "var(--card-note-size)",
            fontWeight: "var(--card-note-weight)",
            lineHeight: "var(--card-note-height)",
            letterSpacing: "var(--card-note-spacing)",
            color: "var(--card-note-color)",
            ...style
        }} {...props}>
            {children}
            {children}
        </Text>
    ),
    Code: ({ children, style, ...props }: any) => (
        <Text as="code" style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--card-code-size)",
            fontWeight: "var(--card-code-weight)",
            lineHeight: "var(--card-code-height)",
            letterSpacing: "var(--card-code-spacing)",
            color: "var(--card-code-color)",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
};
