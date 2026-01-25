import { Hexagon } from "lucide-react";
import * as styles from "./MainFooter.css";

export function MainFooter() {
  return (
    <footer className={styles.container}>
      <div className={styles.footerGrid}>
        {/* Brand */}
        <div className={styles.brandCol}>
          <div className={styles.logo}>
            <Hexagon size={24} fill="currentColor" />
            <span>Untitled UI</span>
          </div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Design amazing digital experiences that create more happy in the world.
          </p>
          <div className={styles.copyright}>
            © 2024 Untitled UI. All rights reserved.
          </div>
        </div>

        {/* Links 1 */}
        <div className={styles.linkCol}>
          <div className={styles.colTitle}>Product</div>
          <a href="#" className={styles.link}>Overview</a>
          <a href="#" className={styles.link}>Features</a>
          <a href="#" className={styles.link}>Solutions</a>
          <a href="#" className={styles.link}>Tutorials</a>
        </div>

        {/* Links 2 */}
        <div className={styles.linkCol}>
          <div className={styles.colTitle}>Company</div>
          <a href="#" className={styles.link}>About us</a>
          <a href="#" className={styles.link}>Careers</a>
          <a href="#" className={styles.link}>Press</a>
          <a href="#" className={styles.link}>News</a>
        </div>

        {/* Links 3 */}
        <div className={styles.linkCol}>
          <div className={styles.colTitle}>Resources</div>
          <a href="#" className={styles.link}>Blog</a>
          <a href="#" className={styles.link}>Newsletter</a>
          <a href="#" className={styles.link}>Events</a>
          <a href="#" className={styles.link}>Help center</a>
        </div>
      </div>
    </footer>
  );
}
