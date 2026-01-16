import {Text} from "../Text.tsx"

/* 
  Context: Menu
  Role: Action items
*/

export const Menu = {
  Item: ({ children, style, ...props }: any) => (
    <Text
      as="span"
      style={{
        fontSize: "var(--menu-item-size)",
        fontWeight: "var(--menu-item-weight)",
        lineHeight: "var(--menu-item-height)",
        letterSpacing: "var(--menu-item-spacing)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Text>
  ),
  Group: ({ children, style, ...props }: any) => (
    <Text
      as="span"
      style={{
        fontSize: "var(--menu-group-size)",
        fontWeight: "var(--menu-group-weight)",
        lineHeight: "var(--menu-group-height)",
        letterSpacing: "var(--menu-group-spacing)",
        textTransform:
          "var(--menu-group-caps)" as React.CSSProperties["textTransform"],
        color: "var(--text-subtle)",
        display: "block",
        padding: "8px 12px 4px",
        ...style,
      }}
      {...props}
    >
      {children}
    </Text>
  ),
};
