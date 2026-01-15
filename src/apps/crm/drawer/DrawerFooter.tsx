import { Action } from "../../../design-system/Action";
import { Frame } from "../../../design-system/Frame/Frame.tsx";
import { Layout } from "../../../design-system/Frame/Layout/Layout.ts";
import { Size, Space } from "../../../design-system/token/token.const.1tier";

export function DrawerFooter({ onClose }: { onClose: () => void }) {
  return (
    <Frame
      layout={Layout.Row.Actions.Default}
      surface="sunken"
      override={{
        h: Size.n56,
        py: Space.n12,
        px: Space.n24,
        borderTop: true,
        justify: "end",
      }}
    >
      <Action label="Close" variant="ghost" onClick={onClose} />
      <Action label="Edit" variant="surface" border />
    </Frame>
  );
}
