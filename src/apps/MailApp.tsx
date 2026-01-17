/**
 * Mail Client Application
 * Gmail-inspired mail client using MDK Design System
 */

import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Size, Space } from "../design-system/token/token.const.1tier";
import { MailDetail } from "./mail/MailDetail";
import { MailHeader } from "./mail/MailHeader";
import { MailList } from "./mail/MailList";
import { MailSidebar } from "./mail/MailSidebar";

export function MailApp() {
  return (
    <Frame
      layout={Layout.Row.Stretch.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      surface="base"
      override={{ p: Space.n0 }}
    >
      {/* Left Sidebar */}
      <MailSidebar />

      {/* Main Content Area */}
      <Frame
        override={{ flex: 1 }}
        style={{ position: "relative" }}
        w={Size.fill}
        h={Size.fill}
      >
        {/* Header */}
        <MailHeader />

        {/* Mail List and Detail split view */}
        <Frame override={{ flex: 1 }} w={Size.fill} h={Size.fill}>
          {/* Mail List - Middle column */}
          <Frame
            override={{ w: Size.n384, minWidth: Size.n320, borderRight: true }}
            h={Size.fill}
          >
            <MailList />
          </Frame>

          {/* Mail Detail - Right column */}
          <Frame override={{ flex: 1 }} w={Size.fill} h={Size.fill}>
            <MailDetail />
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
