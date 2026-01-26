import { Link } from "react-router-dom";
import {
    Users,
    Mail,
    FileText,
    Database,
    Play,
    Calendar,
    FileCode,
    LayoutGrid,
    Search
} from "lucide-react";
import * as styles from "./MainApp.css";
import { Icon } from "@/ui/primitives/Icon";
import { useCommandSystem } from "@/design-system/hooks/interaction/useCommandSystem";
import { SystemCommand } from "@/design-system/hooks/interaction/commands";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const APPS = [
    {
        to: "/crm",
        title: "CRM",
        desc: "Manage customer relationships and pipelines with a headless table engine.",
        icon: Users,
    },
    {
        to: "/mail",
        title: "Mail",
        desc: "AI-powered email client with split-pane layout and smart filters.",
        icon: Mail,
    },
    {
        to: "/docs",
        title: "Docs",
        desc: "Project documentation, design rules, and architectural manifestos.",
        icon: FileText,
    },
    {
        to: "/cms",
        title: "CMS",
        desc: "Block-based content management system for visual storytelling.",
        icon: Database,
    },
    {
        to: "/notebook",
        title: "Code Notebook",
        desc: "Interactive code examples and live documentation.",
        icon: FileCode,
    },
    {
        to: "/calendar",
        title: "Calendar",
        desc: "Headless calendar grid with infinite scroll and dnd.",
        icon: Calendar,
    },
    {
        to: "/playground",
        title: "Playground",
        desc: "Experimental canvas for event sourcing and clipboard tests.",
        icon: Play,
    },
    {
        to: "/design-system",
        title: "Design System",
        desc: "Atomic tokens, primitive components, and style guide.",
        icon: LayoutGrid,
    },
];

export function MainApp() {
    const navigate = useNavigate();

    // Enable basic keyboard navigation
    const { onKeyDown } = useCommandSystem([], {
        [SystemCommand.Navigate]: ({ path }) => navigate(path),
    });

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onKeyDown]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Teo's Antigravity</h1>
                <p className={styles.subtitle}>
                    A minimal, AI-native design kit exploring the intersection of
                    headless logic and visual fidelity.
                </p>
            </header>

            <div className={styles.grid}>
                {APPS.map((app) => (
                    <Link key={app.to} to={app.to} className={styles.card}>
                        <div className={styles.cardIcon}>
                            <Icon src={app.icon} size={20} />
                        </div>
                        <div>
                            <h3 className={styles.cardTitle}>{app.title}</h3>
                            <p className={styles.cardDesc}>{app.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <footer className={styles.footer}>
                <div className={styles.statusDot} />
                <span>System Operational</span>
                <span>•</span>
                <span>v0.1.0-alpha</span>
            </footer>
        </div>
    );
}
