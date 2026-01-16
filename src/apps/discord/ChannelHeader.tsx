/**
 * Discord ChannelHeader Component
 * Displays channel name, description, and actions
 */

import { Hash, Search, Users } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text.tsx";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { getChannelById } from "./mockData";
import {
  selectedChannelIdAtom,
  selectedServerIdAtom,
  showMemberListAtom,
} from "./store";

export function ChannelHeader() {
  const selectedServerId = useAtomValue(selectedServerIdAtom);
  const selectedChannelId = useAtomValue(selectedChannelIdAtom);
  const [showMemberList, setShowMemberList] = useAtom(showMemberListAtom);

  if (!selectedServerId || !selectedChannelId) {
    return null;
  }

  const result = getChannelById(selectedServerId, selectedChannelId);
  if (!result) return null;

  const { channel } = result;

  return (
    <Frame
      layout={Layout.Row.Header.Default}
      surface="base"
      override={{
        borderBottom: true,
        shadow: "sm",
      }}
    >
      {/* Channel Info */}
      <Frame layout={Layout.Row.Item.Tight}>
        <Icon
          src={Hash}
          size={IconSize.n20}
          style={{ color: "var(--text-subtle)" }}
        />
        <Text size={FontSize.n14} weight="bold">
          {channel.name}
        </Text>
      </Frame>

      {/* Actions */}
      <Frame layout={Layout.Row.Item.Default}>
        {/* Search */}
        <Frame
          layout={Layout.Row.Item.Tight}
          override={{
            px: Space.n8,
            py: Space.n4,
            cursor: "pointer",
          }}
          surface="sunken"
          rounded={Radius2.sm}
        >
          <Icon src={Search} size={IconSize.n16} />
          <Text size={FontSize.n12} style={{ color: "var(--text-subtle)" }}>
            Search
          </Text>
        </Frame>

        {/* Toggle Members */}
        <Frame
          override={{
            w: Size.n32,
            h: Size.n32,
            cursor: "pointer",
            align: "center",
            justify: "center",
          }}
          surface={showMemberList ? "selected" : undefined}
          rounded={Radius2.sm}
          onClick={() => setShowMemberList(!showMemberList)}
        >
          <Icon
            src={Users}
            size={IconSize.n16}
            style={{
              color: showMemberList
                ? "var(--text-primary)"
                : "var(--text-subtle)",
            }}
          />
        </Frame>
      </Frame>
    </Frame>
  );
}
