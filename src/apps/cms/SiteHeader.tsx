import { Hexagon } from "lucide-react";
import { EditableWrapper } from "./EditableWrapper";
import * as styles from "./SiteHeader.css";

export interface SiteHeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function SiteHeader({
  isSidebarOpen: _isSidebarOpen,
  onToggleSidebar: _onToggleSidebar,
}: SiteHeaderProps) {
  return (
    <header className={styles.siteHeader}>
      {/* Brand */}
      <div className={styles.brandSection}>
        <div className={styles.logoWrapper}>
          <Hexagon size={18} fill="currentColor" />
        </div>
        <EditableWrapper>
          <span className={styles.brandName}>Minimal</span>
        </EditableWrapper>
      </div>

      {/* Nav */}
      <div className={styles.navSection}>
        <nav className={styles.navLinks}>
          {['Features', 'Pricing', 'Resources'].map(item => (
            <button key={item} className={styles.navLink}>
              {item}
            </button>
          ))}
        </nav>

        <div className={styles.divider} />

        <div className={styles.actionSection}>
          <button className={styles.loginBtn}>Log in</button>
          <button className={styles.ctaBtn}>Get Started</button>
        </div>
      </div>
    </header>
  );
}
