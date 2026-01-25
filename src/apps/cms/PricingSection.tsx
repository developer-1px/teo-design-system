import { Check } from "lucide-react";
import { EditableWrapper } from "./EditableWrapper";
import * as styles from "./PricingSection.css";

const PLANS = [
    {
        name: "Starter",
        price: "$0",
        period: "/month",
        features: ["1 Project", "Basic Design Tokens", "Community Support"],
        featured: false,
        button: "Start for Free"
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        features: ["Unlimited Projects", "Advanced Tokens & Theming", "Prioritized Support", "Export to React/Vue"],
        featured: true,
        button: "Get Started"
    },
    {
        name: "Enterprise",
        price: "$99",
        period: "/month",
        features: ["SSO & Security", "Custom Integrations", "Dedicated Success Manager", "SLA Guarantee", "On-premise Deployment"],
        featured: false,
        button: "Contact Sales"
    }
];

export function PricingSection() {
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <EditableWrapper>
                    <h2 className={styles.title}>Simple, transparent pricing</h2>
                </EditableWrapper>
                <EditableWrapper>
                    <p className={styles.subtitle}>
                        Start for free, scale as you grow. No hidden fees.
                    </p>
                </EditableWrapper>
            </div>

            <div className={styles.pricingGrid}>
                {PLANS.map((plan, i) => (
                    <div key={i} className={styles.card({ featured: plan.featured })}>
                        {plan.featured && <div className={styles.badge}>Most Popular</div>}

                        <EditableWrapper>
                            <h3 className={styles.planName}>{plan.name}</h3>
                        </EditableWrapper>

                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                            <EditableWrapper>
                                <span className={styles.price}>{plan.price}</span>
                            </EditableWrapper>
                            <span className={styles.period}>{plan.period}</span>
                        </div>

                        <div className={styles.features}>
                            {plan.features.map((feature, j) => (
                                <div key={j} className={styles.featureItem}>
                                    <Check size={16} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button className={styles.button({ variant: plan.featured ? "primary" : "outline" })}>
                            {plan.button}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
