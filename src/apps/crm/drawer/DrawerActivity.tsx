import { User } from "lucide-react";
import { Frame } from "../../../design-system/Frame/Frame.tsx";
import { Layout } from "../../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../../design-system/Icon";
import { Text } from "../../../design-system/text/Text.tsx";
import { FontSize, IconSize, Size } from "../../../design-system/token/token.const.1tier";

export function DrawerActivity() {
  return (
    <Frame layout={Layout.Stack.Content.Default}>
      <Text.Menu.Group style={{ color: "var(--text-tertiary)" }}>
        ACTIVITY
      </Text.Menu.Group>
      <Frame layout={Layout.Stack.List.Default}>
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
    <Frame layout={Layout.Row.Item.Default}>
      <Frame
        override={{ w: Size.n24, h: Size.n24}} rounded="full"
        surface="raised"
        pack
      >
        <Icon
          src={User}
          size={IconSize.n14}
          style={{ color: "var(--text-secondary)" }}
        />
      </Frame>
      <Frame layout={Layout.Stack.Content.Tight}>
        <Frame layout={Layout.Row.Item.Tight}>
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
