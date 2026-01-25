import { EditableWrapper } from "./EditableWrapper";
import * as styles from "./BodyContentSection.css";

export function BodyContentSection() {
  return (
    <section className={styles.container}>
      <div className={styles.contentWrapper}>
        <EditableWrapper>
          <h2 className={styles.heading}>The future of content is visual</h2>
        </EditableWrapper>

        <EditableWrapper>
          <p className={styles.paragraph}>
            Traditional CMS platforms force you into rigid templates or require constant developer intervention
            for minor layout changes. We believe there is a better way. By decoupling the content from the
            presentation layer while maintaining a visual editing experience, we empower teams to move faster.
          </p>
        </EditableWrapper>

        <div className={styles.divider} />

        <EditableWrapper>
          <h3 className={styles.subheading}>Why we built this</h3>
        </EditableWrapper>

        <EditableWrapper>
          <p className={styles.paragraph}>
            We spent years building bespoke websites and realized that the bottleneck was always the handoff
            between design and engineering. Designers wanted pixel perfection, engineers wanted clean code,
            and marketers wanted autonomy.
          </p>
        </EditableWrapper>

        <div className={styles.quote}>
          <EditableWrapper>
            <p className={styles.quoteText}>
              "It's rare to find a tool that actually makes both developers and marketers happy.
              This is that tool."
            </p>
          </EditableWrapper>
          <EditableWrapper>
            <span className={styles.quoteAuthor}>— Sarah Chen, VP of Engineering</span>
          </EditableWrapper>
        </div>
      </div>
    </section>
  );
}
