import {
    Book,
    Command,
    Home,
    Layout as LayoutIcon,
    Layers,
    Palette,
    Type,
} from "lucide-react";
import { useState } from "react";
import { Icon } from "@/design-system/Icon";
import { Text } from "@/design-system/text/Text";
import {
    IconSize,
    Size,
    Space,
    ZIndex
} from "@/design-system/token/token.const.1tier";
import { Radius2 } from "@/design-system/token/radius2";
import { CommandBarDesignApp } from "./CommandBarDesignApp";
import { LandingApp } from "./LandingApp";
import { LayoutShowcaseApp } from "./LayoutShowcaseApp";
import { SurfaceApp } from "./SurfaceApp";
import { TextSystemApp } from "./TextSystemApp";
import { TokensApp } from "./TokensApp";

// Import Layout from where it's defined or use constant if imported
import { Layout } from "@/design-system/Frame/Layout/Layout.ts"; // Assuming path
import { Frame } from "@/design-system/Frame/Frame.tsx";

type View = "home" | "tokens" | "surface" | "text" | "layout" | "command-bar";

export function DesignSystemApp() {
    const [activeView, setActiveView] = useState<View>("home");

    const views: Record<View, React.ReactNode> = {
        home: <LandingApp />,
        tokens: <TokensApp />,
        surface: <SurfaceApp />,
        text: <TextSystemApp />,
        layout: <LayoutShowcaseApp />,
        "command-bar": <CommandBarDesignApp />,
    };

    return (
        <Frame
            layout={Layout.Col.Stretch.Start}
            spacing={Space.n0}
            w={Size.fill}
            h={Size.screen}
            surface="base"
        >
            {/* Top Navigation Bar */}
            <Frame
                override={{
                    w: Size.fill,
                    h: Size.n56,
                    borderBottom: true,
                    px: Space.n24,
                    zIndex: ZIndex.n100,
                }}
                style={{
                    position: "sticky",
                    top: 0
                }}
                surface="sunken"
                layout={Layout.Row.Middle.Between}
                spacing={Space.n0}
            >
                {/* Logo & Brand */}
                <Frame layout={Layout.Row.Middle.Start} spacing={Space.n12}>
                    <Frame
                        rounded={Radius2.md}
                        surface="primary"
                        layout={Layout.Row.Middle.Center}
                        override={{ w: Size.n32, h: Size.n32 }}
                    >
                        <Icon src={Book} size={IconSize.n16} style={{ color: "white" }} />
                    </Frame>
                    <Text.Menu.Item style={{ fontWeight: 600 }}>
                        Design System
                    </Text.Menu.Item>
                </Frame>

                {/* Nav Links */}
                <Frame layout={Layout.Row.Middle.Center} spacing={Space.n4}>
                    <TopNavItem
                        label="Home"
                        active={activeView === "home"}
                        onClick={() => setActiveView("home")}
                    />
                    <TopNavItem
                        label="Tokens"
                        active={activeView === "tokens"}
                        onClick={() => setActiveView("tokens")}
                    />
                    <TopNavItem
                        label="Surface"
                        active={activeView === "surface"}
                        onClick={() => setActiveView("surface")}
                    />
                    <TopNavItem
                        label="Text"
                        active={activeView === "text"}
                        onClick={() => setActiveView("text")}
                    />
                    <TopNavItem
                        label="Layout"
                        active={activeView === "layout"}
                        onClick={() => setActiveView("layout")}
                    />
                    <TopNavItem
                        label="Patterns"
                        active={activeView === "command-bar"}
                        onClick={() => setActiveView("command-bar")}
                    />
                </Frame>

                {/* Right Side (Version or Theme toggle placeholder) */}
                <Frame layout={Layout.Row.Middle.End}>
                    <Text.Card.Note style={{ opacity: 0.5 }}>v10.6.1</Text.Card.Note>
                </Frame>
            </Frame>

            {/* Content Area */}
            <Frame
                override={{
                    flex: 1,
                    w: Size.fill,
                    minWidth: Size.n0,
                }}
                style={{ overflow: "hidden" }} // Allow internal scroll
                surface="base"
            >
                {/* 
                   If views have their own internal scroll (like LandingApp does), 
                   we should let them handle it. 
                   If LandingApp expects to be full page scroll, we might need overflow-y: auto here 
                   OR inside LandingApp. 
                   Ref: LandingApp.css.ts sets overflowY: "auto" on root.
                   So we just provide the container.
                 */}
                {views[activeView]}
            </Frame>
        </Frame>
    );
}

function TopNavItem({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Frame
            onClick={onClick}
            interactive
            rounded={Radius2.full}
            surface={active ? "selected" : undefined}
            override={{
                px: Space.n16,
                py: Space.n8,
                cursor: "pointer",
            }}
            layout={Layout.Row.Middle.Center}
            spacing={Space.n8}
        >
            <Text.Menu.Item style={{
                fontWeight: active ? 600 : 500,
                color: active ? "var(--text-primary)" : "var(--text-secondary)"
            }}>
                {label}
            </Text.Menu.Item>
        </Frame>
    );
}
