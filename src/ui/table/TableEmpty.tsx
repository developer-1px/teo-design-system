import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Text } from "../../design-system/text/Text.tsx";

interface TableEmptyProps {
  message?: string;
}

export function TableEmpty({ message = "No data available" }: TableEmptyProps) {
  return (
    <Frame fill pack override={{ align: "center", justify: "center" }}>
      <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
        {message}
      </Text.Card.Note>
    </Frame>
  );
}
