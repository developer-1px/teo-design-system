import { Action } from "../../../design-system/Action";
import { Frame } from "../../../design-system/Frame/Frame.tsx";
import { Layout } from "../../../design-system/Frame/Layout/Layout.ts";

export function DrawerFooter({ onClose }: { onClose: () => void }) {
  return (
    <Frame
      layout={Layout.Row.Middle.End}
      spacing={Space.n8}
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
