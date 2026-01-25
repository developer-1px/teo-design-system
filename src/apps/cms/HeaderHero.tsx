import { ArrowRight, Sparkles } from "lucide-react";
import { EditableWrapper } from "./EditableWrapper";
import * as styles from "./HeaderHero.css";

export function HeaderHero() {
  return (
    <section className={styles.container}>
      {/* Badge */}
      <div className={styles.badge}>
        <Sparkles size={12} />
        <span>New Release v2.0</span>
      </div>

      {/* Title */}
      <EditableWrapper className={styles.title}>
        <h1 style={{ margin: 0, fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit" }}>
          Design without limits.<br />
          <span className={styles.titleGradient}>Build with precision.</span>
        </h1>
      </EditableWrapper>

      {/* Description */}
      <EditableWrapper className={styles.description}>
        <p style={{ margin: 0, fontSize: "inherit", lineHeight: "inherit", color: "inherit" }}>
          The ultimate content management system designed for modern engineering teams.
          Ship faster, scale infinitely, and maintain total control.
        </p>
      </EditableWrapper>

      {/* Actions */}
      <div className={styles.actionGroup}>
        <button className={styles.button({ variant: "primary" })}>
          Start Building <ArrowRight size={16} />
        </button>
        <button className={styles.button({ variant: "secondary" })}>
          View Documentation
        </button>
      </div>

      {/* Visual */}
      <div className={styles.visualFrame}>
        <div className={styles.browserHeader}>
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>
        {/* Content Placeholder */}
        <div style={{ flex: 1, background: "rgba(0,0,0,0.02)", display: "grid", placeItems: "center" }}>
          <span style={{ color: "rgba(0,0,0,0.2)", fontWeight: 600 }}>Application Preview</span>
        </div>
      </div>
    </section>
  );
}
