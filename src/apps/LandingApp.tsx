import {
  ArrowRight,
  Component,
  Layers,
  LayoutTemplate,
  MousePointerClick,
  PanelTop,
  PenTool,
  Type,
  Zap,
} from "lucide-react";
import { Action } from "@/design-system/Action";
import { Radius2 } from "@/design-system/token/radius2";
import { Space } from "@/design-system/token/token.const.1tier";
import * as styles from "./LandingApp.css";

export function LandingApp() {
  return (
    <div className={styles.root}>
      {/* Navigation - Removed in favor of Global Top Menu */}

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBadge}>
          <Zap size={12} fill="currentColor" />
          <span>New: Layout Engine v2.0</span>
        </div>

        <h1 className={styles.heroTitle}>
          Build faster with the Teo's Minimal Design Kit
        </h1>

        <p className={styles.heroDesc}>
          A collection of high-quality, accessible, and performant React components crafted for modern web applications.
        </p>

        <div className={styles.heroActions}>
          <Action variant="primary" rounded={Radius2.full} py={Space.n12} px={Space.n24}>
            <span style={{ fontWeight: 600 }}>Get Started</span>
            <ArrowRight size={16} />
          </Action>
          <Action variant="surface" rounded={Radius2.full} py={Space.n12} px={Space.n24} border>
            <span style={{ fontWeight: 600 }}>View Components</span>
          </Action>
        </div>
      </section>

      {/* Why Section */}
      <section className={styles.whySection}>
        <h2 className={styles.whyTitle}>왜 만들었는가?</h2>
        <p className={styles.whyText}>
          프론트엔드 디자인은 결국 '수렴진화'하고 있으며, 그 최종 형태는
          불필요한 장식이 배제된 채 오직 기능과 의도만이 남는 것이라 믿습니다.
          <br /><br />
          우리는 복잡한 설정 없이도 <strong style={{ color: "var(--text-primary)" }}>Web Application</strong>의
          본질을 완벽하게 구현할 수 있는, 가장 순수하고 효율적인 디자인 도구를 지향합니다.
          <br /><br />
          <strong style={{ color: "var(--text-primary)" }}>이것이 바로 Minimal Design Kit가 추구하는 방향입니다.</strong>
        </p>
      </section>

      {/* Features Grid */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresHeader}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>Everything you need</h2>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)" }}>Comprehensive primitives for any layout.</p>
        </div>

        <div className={styles.featuresGrid}>
          <FeatureCard
            icon={Type}
            title="Text"
            desc="Semantic typography system based on 4-level hierarchy: Experience > Context > Slot > Variant."
          />
          <FeatureCard
            icon={Layers}
            title="Surface"
            desc="Intelligent layering system (Base, Sunken, Raised, Overlay) that manages depth and hierarchy."
          />
          <FeatureCard
            icon={PanelTop}
            title="Section"
            desc="Layout partitioning components that handle content width, spacing, and alignment automatically."
          />
          <FeatureCard
            icon={Component}
            title="Overlay"
            desc="Floating context managers for Dialogs, Menus, and Tooltips with z-index discipline."
          />
          <FeatureCard
            icon={Zap}
            title="Experience"
            desc="Global context scaler that adapts all child spacing and typography (App, Landing, Document)."
          />
          <FeatureCard
            icon={LayoutTemplate}
            title="Frame"
            desc="The universal layout primitive. Flexbox/Grid wrapper with zero-runtime token resolution."
          />
          <FeatureCard
            icon={PenTool}
            title="Field"
            desc="Input primitive for forms. Manages labels, values, and notes with semantic precision."
          />
          <FeatureCard
            icon={MousePointerClick}
            title="Action"
            desc="Interactive primitive for buttons and links. Handles states, variants, and icon composition."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          © 2026 Minimal Design Kit. All rights reserved.
        </p>
        <div className={styles.footerLinks}>
          <span className={styles.footerLink}>Twitter</span>
          <span className={styles.footerLink}>GitHub</span>
          <span className={styles.footerLink}>Discord</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <Icon size={24} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDesc}>{desc}</p>
      </div>
    </div>
  )
}
