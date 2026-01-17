import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout";
import { Text } from "../../design-system/text/Text.tsx";
import { Space } from "../../design-system/token/token.const.1tier.ts";

interface TableEmptyProps {
  message?: string;
}

export function TableEmpty({ message = "No data available" }: TableEmptyProps) {
  return (
    <Frame layout={Layout.Col.Center.Start} spacing={Space.n16} override={{ p: Space.n24 }}>
      <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
        {message}
      </Text.Card.Note>
    </Frame>
  );
}
