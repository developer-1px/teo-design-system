import { User } from "lucide-react";
import { Frame } from "@/legacy-design-system/Frame/Frame.tsx";
import { Layout } from "@/legacy-design-system/Frame/Layout/Layout.ts";
import { Icon } from "@/ui/primitives/Icon";
import { Text } from "@/legacy-design-system/text/Text.tsx";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "@/legacy-design-system/token/token.const.1tier";
import { Radius2 } from "@/legacy-design-system/token/radius2";

export function DrawerActivity() {
  return (
    <Frame layout={Layout.Col.Left.Start} spacing={Space.n12}>
      <Text.Menu.Group style={{ color: "var(--text-tertiary)" }}>
        ACTIVITY
      </Text.Menu.Group>
      <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
        <ActivityItem user="System" action="created record" time="Recently" />
      </Frame>
    </Frame>
  );
}

function ActivityItem({
  user,
  action,
  time,
}: {
  user: string;
  action: string;
  time: string;
}) {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      override={{ px: Space.n16, minHeight: Size.n40 }}
    >
      <Frame
        override={{ w: Size.n24, h: Size.n24, pack: true }}
        rounded={Radius2.full}
        surface="raised"
      >
        <Icon
          src={User}
          size={IconSize.n14}
          style={{ color: "var(--text-secondary)" }}
        />
      </Frame>
      <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n8}
          override={{ px: Space.n12, minHeight: Size.n32 }}
        >
          <Text.Card.Title size={FontSize.n13}>{user}</Text.Card.Title>
          <Text.Card.Note>{action}</Text.Card.Note>
        </Frame>
        <Text.Card.Note
          size={FontSize.n11}
          style={{ color: "var(--text-tertiary)" }}
        >
          {time}
        </Text.Card.Note>
      </Frame>
    </Frame>
  );
}
