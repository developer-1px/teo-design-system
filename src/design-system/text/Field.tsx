
import { Text } from "../Text";

/* 
  Context: Field
  Role: Input unit (Label, Value, Note)
  Note: This handles the Text Typography for fields. 
        The 'Field' component in core design system uses these slots.
*/

export const Field = {
    Label: ({ children, style, ...props }: any) => (
        <Text as="label" style={{
            fontSize: "var(--field-label-size)",
            fontWeight: "var(--field-label-weight)",
            lineHeight: "var(--field-label-height)",
            letterSpacing: "var(--field-label-spacing)",
            display: "block",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
    Value: ({ children, style, ...props }: any) => (
        <Text as="span" style={{
            fontSize: "var(--field-value-size)",
            fontWeight: "var(--field-value-weight)",
            lineHeight: "var(--field-value-height)",
            letterSpacing: "var(--field-value-spacing)",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
    Note: ({ children, style, ...props }: any) => (
        <Text as="p" style={{
            fontSize: "var(--field-note-size)",
            fontWeight: "var(--field-note-weight)",
            lineHeight: "var(--field-note-height)",
            letterSpacing: "var(--field-note-spacing)",
            color: "var(--field-note-color)",
            marginTop: "4px",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
};
