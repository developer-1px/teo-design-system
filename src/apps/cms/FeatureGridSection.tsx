import { Box, Layers, Layout, Palette, Settings, Zap } from "lucide-react";
import { EditableWrapper } from "./EditableWrapper";
import * as styles from "./FeatureGridSection.css";

const FEATURES = [
  {
    title: "Block-Based Editing",
    desc: "Compose pages visually using our intuitive block system. Drag, drop, and customize instantly.",
    icon: Layout
  },
  {
    title: "Design Tokens",
    desc: "Maintain consistency with a centralized design system. Update tokens and propagate changes everywhere.",
    icon: Palette
  },
  {
    title: "Asset Management",
    desc: "Organize your media assets with tags, folders, and powerful search capabilities.",
    icon: Box
  },
  {
    title: "Version Control",
    desc: "Track changes, rollback versions, and collaborate safely with built-in history.",
    icon: Layers
  },
  {
    title: "Instant Performance",
    desc: "Generated sites are static, edge-cached, and insanely fast by default.",
    icon: Zap
  },
  {
    title: "Developer API",
    desc: "Extensible via GraphQL and REST APIs. Integrate with your existing stack seamlessly.",
    icon: Settings
  }
];

export function FeatureGridSection() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <EditableWrapper>
          <h2 className={styles.title}>Everything you need to build</h2>
        </EditableWrapper>
        <EditableWrapper>
          <p className={styles.subtitle}>
            Powerful features designed for the next generation of content creators.
          </p>
        </EditableWrapper>
      </div>

      <div className={styles.cardGrid}>
        {FEATURES.map((feature, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.iconWrapper}>
              <feature.icon size={24} />
            </div>
            <EditableWrapper>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
            </EditableWrapper>
            <EditableWrapper>
              <p className={styles.cardText}>{feature.desc}</p>
            </EditableWrapper>
          </div>
        ))}
      </div>
    </section>
  );
}
