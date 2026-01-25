import { EditableWrapper } from "./EditableWrapper";
import * as styles from "./FAQBoardFooter.css";

const FAQS = [
  {
    q: "Do I need coding skills to use this?",
    a: "No! The visual editor allows you to build pages without writing a single line of code. However, developers can easily extend functionality."
  },
  {
    q: " Can I export the code?",
    a: "Yes. You can export your project as a standard React, Vue, or HTML/CSS application at any time."
  },
  {
    q: "Is there a free trial?",
    a: "We offer a generous free tier for personal projects. For teams, we offer a 14-day free trial of our Pro plan."
  }
];

export function FAQBoardFooter() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <EditableWrapper>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
        </EditableWrapper>
      </div>

      <div className={styles.faqList}>
        {FAQS.map((item, i) => (
          <div key={i} className={styles.faqItem}>
            <EditableWrapper>
              <h3 className={styles.question}>{item.q}</h3>
            </EditableWrapper>
            <EditableWrapper>
              <p className={styles.answer}>{item.a}</p>
            </EditableWrapper>
          </div>
        ))}
      </div>
    </section>
  );
}
