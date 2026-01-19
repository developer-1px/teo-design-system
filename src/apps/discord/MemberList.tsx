/**
 * Discord MemberList Component
 * Displays online/offline members on the right sidebar
 */

import { useAtomValue } from "jotai";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Overlay } from "../../design-system/Overlay";
import { Text } from "../../design-system/text/Text.tsx";
import {
  FontSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { mockMembers } from "./mockData";
import { showMemberListAtom } from "./store";
import type { Member } from "./types";

function MemberItem({ member }: { member: Member }) {
  const getStatusColor = (status: Member["status"]) => {
    switch (status) {
      case "online":
        return "#43b581";
      case "idle":
        return "#faa61a";
      case "dnd":
        return "#f04747";
      case "offline":
        return "#747f8d";
    }
  };

  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n12}
      override={{
        px: Space.n8,
        py: Space.n4,
        cursor: "pointer",
        minHeight: Size.n40,
      }}
      rounded={Radius2.sm}
    >
      {/* Avatar */}
      <Frame
        override={{
          w: Size.n32,
          h: Size.n32,
          align: "center",
          justify: "center",
        }}
        surface="raised"
        rounded={Radius2.full}
      >
        <Text size={FontSize.n16}>{member.avatar}</Text>
        {/* Status Indicator */}
        <Overlay position="absolute" bottom="-1px" right="-1px">
          <Frame
            override={{
              w: Size.n8,
              h: Size.n8,
            }}
            rounded={Radius2.full}
            style={{
              backgroundColor: getStatusColor(member.status),
              border: "2px solid var(--surface-base)",
            }}
          />
        </Overlay>
      </Frame>

      {/* Member Info */}
      <Frame override={{ flex: 1 }}>
        <Text size={FontSize.n12} weight="medium">
          {member.name}
        </Text>
        {member.role && (
          <Text
            size={FontSize.n10}
            style={{ color: "var(--text-muted)", marginTop: "-2px" }}
          >
            {member.role}
          </Text>
        )}
      </Frame>
    </Frame>
  );
}

export function MemberList() {
  const showMemberList = useAtomValue(showMemberListAtom);

  if (!showMemberList) {
    return null;
  }

  const onlineMembers = mockMembers.filter((m) => m.status !== "offline");
  const offlineMembers = mockMembers.filter((m) => m.status === "offline");

  return (
    <Frame
      surface="base"
      override={{
        w: Size.n240,
        borderLeft: true,
        minWidth: Size.n0,
      }}
    >
      <Frame
        layout={Layout.Col.Left.Start}
        spacing={Space.n12}
        scroll
        override={{ px: Space.n8, py: Space.n16, flex: 1 }}
      >
        {/* Online Members */}
        {onlineMembers.length > 0 && (
          <Frame layout={Layout.Col.Left.Start} spacing={Space.n4}>
            <Frame override={{ px: Space.n8, py: Space.n4 }}>
              <Text
                size={FontSize.n10}
                weight="bold"
                style={{
                  color: "var(--text-muted)",
                  letterSpacing: "0.05em",
                }}
              >
                ONLINE — {onlineMembers.length}
              </Text>
            </Frame>
            {onlineMembers.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </Frame>
        )}

        {/* Offline Members */}
        {offlineMembers.length > 0 && (
          <Frame layout={Layout.Col.Left.Start} spacing={Space.n4}>
            <Frame override={{ px: Space.n8, py: Space.n4 }}>
              <Text
                size={FontSize.n10}
                weight="bold"
                style={{
                  color: "var(--text-muted)",
                  letterSpacing: "0.05em",
                }}
              >
                OFFLINE — {offlineMembers.length}
              </Text>
            </Frame>
            {offlineMembers.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </Frame>
        )}
      </Frame>
    </Frame>
  );
}
