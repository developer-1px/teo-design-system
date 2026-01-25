import { ArrowRight } from "lucide-react";
import { EditableWrapper } from "./EditableWrapper";
import * as styles from "./ImageFooterBanner.css";

export function ImageFooterBanner() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <EditableWrapper>
          <h2 className={styles.title}>Ready to transform your workflow?</h2>
        </EditableWrapper>
        <EditableWrapper>
          <p className={styles.subtitle}>
            Join thousands of teams building the next generation of web applications.
          </p>
        </EditableWrapper>
        <button className={styles.button}>
          Start Building Now <ArrowRight size={18} style={{ marginLeft: 8 }} />
        </button>
      </div>
    </section>
  );
}
