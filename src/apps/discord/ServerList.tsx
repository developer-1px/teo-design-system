/**
 * Discord ServerList Component
 * Displays server icons in a vertical list (far left sidebar)
 */

import { Home, Plus } from "lucide-react";
import { useAtom } from "jotai";
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
import { mockServers } from "./mockData";
import { selectedServerIdAtom } from "./store";

export function ServerList() {
  const [selectedServerId, setSelectedServerId] = useAtom(selectedServerIdAtom);

  return (
    <Frame
      surface="sunken"
      override={{
        w: Size.n72,
        py: Space.n12,
        gap: Space.n8,
        align: "center",
        borderRight: true,
      }}
    >
      {/* Home Button */}
      <Frame
        override={{
          w: Size.n48,
          h: Size.n48,
          cursor: "pointer",
          align: "center",
          justify: "center",
        }}
        surface={selectedServerId === null ? "primary" : "raised"}
        rounded={selectedServerId === null ? Radius2.md : Radius2.full}
        onClick={() => setSelectedServerId(null)}
        style={{
          transition: "border-radius 0.2s ease",
        }}
      >
        <Icon
          src={Home}
          size={IconSize.n20}
          style={{
            color:
              selectedServerId === null
                ? "var(--primary-fg)"
                : "var(--text-primary)",
          }}
        />
      </Frame>

      {/* Separator */}
      <Frame
        override={{
          w: Size.n32,
          h: Size.n4,
        }}
        style={{ backgroundColor: "var(--border-color)" }}
        rounded={Radius2.full}
      />

      {/* Server Icons */}
      <Frame layout={Layout.Stack.List.Dense} override={{ align: "center" }}>
        {mockServers.map((server) => (
          <Frame
            key={server.id}
            override={{
              w: Size.n48,
              h: Size.n48,
              cursor: "pointer",
              align: "center",
              justify: "center",
            }}
            surface={selectedServerId === server.id ? "primary" : "raised"}
            rounded={
              selectedServerId === server.id ? Radius2.md : Radius2.full
            }
            onClick={() => setSelectedServerId(server.id)}
            style={{
              transition: "border-radius 0.2s ease",
            }}
          >
            <Text
              size={FontSize.n24}
              style={{
                color:
                  selectedServerId === server.id
                    ? "var(--primary-fg)"
                    : undefined,
              }}
            >
              {server.icon}
            </Text>
          </Frame>
        ))}

        {/* Add Server Button */}
        <Frame
          override={{
            w: Size.n48,
            h: Size.n48,
            cursor: "pointer",
            align: "center",
            justify: "center",
          }}
          surface="raised"
          rounded={Radius2.full}
          style={{
            transition: "border-radius 0.2s ease",
          }}
        >
          <Icon src={Plus} size={IconSize.n20} />
        </Frame>
      </Frame>
    </Frame>
  );
}
