/**
 * Mail Client Application
 * Gmail-inspired mail client using MDK Design System
 */

import {Frame} from "../design-system/Frame/Frame.tsx"
import {Layout} from "../design-system/Frame/Layout/Layout.ts"
import {Size, Space} from "../design-system/token/token.const.1tier"
import {MailDetail} from "./mail/MailDetail"
import {MailHeader} from "./mail/MailHeader"
import {MailList} from "./mail/MailList"
import {MailSidebar} from "./mail/MailSidebar"

export function MailApp() {
  return (
    <Frame
      fill
      layout={Layout.Row.AppContainer.Default}
      surface="base"
      override={{ p: Space.n0 }}
    >
      {/* Left Sidebar */}
      <MailSidebar />

      {/* Main Content Area */}
      <Frame fill flex style={{ position: "relative" }}>
        {/* Header */}
        <MailHeader />

        {/* Mail List and Detail split view */}
        <Frame fill flex layout={Layout.Row.AppContainer.Default}>
          {/* Mail List - Middle column */}
          <Frame
            override={{ w: Size.n384, minWidth: Size.n320, borderRight: true }}
          >
            <MailList />
          </Frame>

          {/* Mail Detail - Right column */}
          <Frame fill flex>
            <MailDetail />
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
