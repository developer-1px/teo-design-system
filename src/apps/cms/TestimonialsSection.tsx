import { EditableWrapper } from "./EditableWrapper";
import * as styles from "./TestimonialsSection.css";

const TESTIMONIALS = [
    {
        text: "This platform successfully bridged the gap between our design and engineering teams. We ship 3x faster now.",
        name: "Alex Johnson",
        role: "CTO at TechFlow",
        avatarColor: "#FF5F57"
    },
    {
        text: "Finally, a CMS that doesn't feel like it was built in 2010. The token-based theming is a game changer.",
        name: "Maria Garcia",
        role: "Frontend Lead",
        avatarColor: "#FEBC2E"
    },
    {
        text: "The instant preview and visual editing capabilities have saved our marketing team countless hours.",
        name: "David Kim",
        role: "Marketing Director",
        avatarColor: "#28C840"
    }
];

export function TestimonialsSection() {
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <EditableWrapper>
                    <h2 className={styles.title}>Trusted by modern teams</h2>
                </EditableWrapper>
                <EditableWrapper>
                    <p className={styles.subtitle}>
                        Don't just take our word for it. Hear what others are saying about the new workflow.
                    </p>
                </EditableWrapper>
            </div>

            <div className={styles.grid}>
                {TESTIMONIALS.map((item, i) => (
                    <div key={i} className={styles.card}>
                        <EditableWrapper>
                            <p className={styles.cardText}>"{item.text}"</p>
                        </EditableWrapper>

                        <div className={styles.authorRow}>
                            <div
                                className={styles.avatar}
                                style={{ backgroundColor: item.avatarColor }}
                            />
                            <div className={styles.authorInfo}>
                                <EditableWrapper>
                                    <div className={styles.authorName}>{item.name}</div>
                                </EditableWrapper>
                                <EditableWrapper>
                                    <div className={styles.authorRole}>{item.role}</div>
                                </EditableWrapper>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
