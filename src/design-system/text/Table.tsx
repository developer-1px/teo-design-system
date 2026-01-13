
import { Text } from "../Text";

/* 
  Context: Table
  Role: Data comparison
*/

export const Table = {
    Head: ({ children, style, ...props }: any) => (
        <Text as="th" style={{
            fontSize: "var(--table-head-size)",
            fontWeight: "var(--table-head-weight)",
            lineHeight: "var(--table-head-height)",
            letterSpacing: "var(--table-head-spacing)",
            textTransform: "var(--table-head-caps)" as any,
            textAlign: "left",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
    Cell: ({ children, style, ...props }: any) => (
        <Text as="td" style={{
            fontSize: "var(--table-cell-size)",
            fontWeight: "var(--table-cell-weight)",
            lineHeight: "var(--table-cell-height)",
            letterSpacing: "var(--table-cell-spacing)",
            ...style
        }} {...props}>
            {children}
        </Text>
    ),
};
