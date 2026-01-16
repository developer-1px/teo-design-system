/**
 * Discord Mock Application
 * Chat application inspired by Discord UI
 * Built with MDK Design System presets and tokens
 */

import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Space } from "../design-system/token/token.const.1tier";
import { ChannelSidebar } from "./discord/ChannelSidebar";
import { MemberList } from "./discord/MemberList";
import { MessageArea } from "./discord/MessageArea";
import { ServerList } from "./discord/ServerList";

export function DiscordApp() {
  return (
    <Frame
      w="screen"
      h="screen"
      layout={Layout.Row.AppContainer.Default}
      surface="base"
      override={{ p: Space.n0 }}
    >
      {/* Server List (Far Left) */}
      <ServerList />

      {/* Channel Sidebar */}
      <ChannelSidebar />

      {/* Message Area (Main Content) */}
      <MessageArea />

      {/* Member List (Right, toggleable) */}
      <MemberList />
    </Frame>
  );
}
