/**
 * Mail Client Application
 * Gmail-inspired mail client using MDK Design System
 */

import { MailDetail } from "./mail/MailDetail";
import { MailHeader } from "./mail/MailHeader";
import { MailList } from "./mail/MailList";
import { MailSidebar } from "./mail/MailSidebar";
import * as styles from "./mail/Mail.css";

export function MailApp() {
  return (
    <div className={styles.shell}>
      {/* Left Sidebar */}
      <MailSidebar />

      {/* Main Content Area */}
      <div className={styles.main}>
        {/* Header */}
        <MailHeader />

        {/* Mail List and Detail split view */}
        <div className={styles.content}>
          {/* Mail List - Middle column */}
          <MailList />

          {/* Mail Detail - Right column */}
          <MailDetail />
        </div>
      </div>
    </div>
  );
}
