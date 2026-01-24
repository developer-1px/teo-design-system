import { Text } from "../../../design-system/text/Text";

// Helper for cell values
function SmartCellRenderer({ value }: { value: unknown }) {
  // Array -> Chips
  if (Array.isArray(value)) {
    return (
      <Frame
        layout={Layout.Row.Middle.Start}
        wrap="wrap"
        spacing={Space.n8}
        override={{ gap: Space.n4 }}
      >
        {value.map((item, i) => (
          <Frame
            key={i}
            override={{ px: Space.n6, py: Space.n2 }}
            surface="sunken"
            rounded={Radius2.sm}
          >
            <Text.Field.Value
              style={{ fontSize: "12px", color: "var(--text-secondary)" }}
            >
              {String(item)}
            </Text.Field.Value>
          </Frame>
        ))}
      </Frame>
    );
  }
  // Object -> Simplified string or Badge
  if (typeof value === "object" && value !== null) {
    const keys = Object.keys(value);
    return (
      <Text.Field.Value
        style={{ fontSize: "12px", color: "var(--text-tertiary)" }}
      >
        {`{ ${keys.length} items }`}
      </Text.Field.Value>
    );
  }
  // Primitive
  return (
    <Text.Field.Value
      style={{ fontSize: "12px", color: "var(--text-secondary)" }}
    >
      {String(value)}
    </Text.Field.Value>
  );
}

export function JsonTable({ data }: { data: Record<string, any>[] }) {
  if (data.length === 0) return null;

  // Derive columns from the first few items to ensure coverage, or just the first one?
  // Let's take all unique keys from the first 5 items to be safe but efficient.
  const allKeys = new Set<string>();
  data.slice(0, 5).forEach((item) => {
    Object.keys(item).forEach((k) => {
      allKeys.add(k);
    });
  });
  const columns = Array.from(allKeys);

  return (
    <Frame
      surface="raised"
      rounded={Radius2.md}
      w={Size.fill}
      style={{
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "auto",
        }}
      >
        <thead style={{ background: "var(--surface-bg-sunken)" }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  textAlign: "left",
                  padding: "6px 12px", // Relaxed padding
                  borderBottom: "1px solid var(--border-neutral-default)",
                  whiteSpace: "nowrap",
                }}
              >
                <Text.Field.Label
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-tertiary)",
                  }}
                >
                  {col.toUpperCase()}
                </Text.Field.Label>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom:
                  i < data.length - 1
                    ? "1px solid var(--border-neutral-default)"
                    : "none",
                backgroundColor:
                  i % 2 === 1 ? "var(--surface-bg-sunken)" : "transparent",
              }}
            >
              {columns.map((col) => (
                <td
                  key={col}
                  style={{
                    padding: "6px 12px", // Relaxed padding
                    verticalAlign: "top",
                  }}
                >
                  <SmartCellRenderer value={row[col]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}
