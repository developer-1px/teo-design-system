import { Text } from "@/legacy-design-system/text/Text";
import { Radius2 } from "@/legacy-design-system/token/radius2";

function SmartValueRenderer({ value }: { value: unknown }) {
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
  // Object -> Simplified string
  if (typeof value === "object" && value !== null) {
    return (
      <Text.Field.Value
        style={{ fontSize: "12px", color: "var(--text-tertiary)" }}
      >
        {JSON.stringify(value)}
      </Text.Field.Value>
    );
  }
  // Primitive
  return (
    <Text.Field.Value
      style={{
        fontSize: "12px",
        color: "var(--text-secondary)",
        wordBreak: "break-word",
      }}
    >
      {String(value)}
    </Text.Field.Value>
  );
}

export function JsonPropertyGrid({ data }: { data: Record<string, any> }) {
  const entries = Object.entries(data);

  return (
    <Frame
      layout={Layout.Col.Left.Start}
      spacing={Space.n8}
      override={{
        grid: true,
        gap: Space.n12,
        columns: "repeat(auto-fill, minmax(140px, 1fr))",
      }}
    >
      {entries.map(([key, value]) => (
        <Frame
          key={key}
          layout={Layout.Col.Left.Start}
          spacing={Space.n8}
          override={{ gap: Space.n2 }}
        >
          <Text.Field.Label
            style={{ color: "var(--text-tertiary)", fontSize: "11px" }}
          >
            {key}
          </Text.Field.Label>
          <SmartValueRenderer value={value} />
        </Frame>
      ))}
    </Frame>
  );
}
