import { EditableWrapper } from "./EditableWrapper";
import * as styles from "./ScrollTabSection.css";

export function ScrollTabSection() {
  const tabs = ["Overview", "Features", "Pricing", "Testimonials", "FAQ"];

  return (
    <section className={styles.container}>
      <div className={styles.tabList}>
        {tabs.map((tab, index) => (
          <EditableWrapper key={tab}>
            <div
              className={styles.tabItem}
              data-active={index === 0}
            >
              {tab}
            </div>
          </EditableWrapper>
        ))}
      </div>
    </section>
  );
}
