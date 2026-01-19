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
import { Frame } from "../design-system/Frame/Frame";
import { Layout } from "../design-system/Frame/Layout/Layout";
import { Icon } from "../design-system/Icon";
import { Text } from "../design-system/text/Text";
import {
    IconSize,
    Size,
    Space,
} from "../design-system/token/token.const.1tier";
import { Radius2 } from "../design-system/token/token.const.2tier";
import { CommandBarDesignApp } from "./CommandBarDesignApp";
import { LandingApp } from "./LandingApp";
import { LayoutShowcaseApp } from "./LayoutShowcaseApp";
import { SurfaceApp } from "./SurfaceApp";
import { TextSystemApp } from "./TextSystemApp";
import { TokensApp } from "./TokensApp";

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
            layout={Layout.Row.Stretch.Start}
            spacing={Space.n0}
            w={Size.fill}
            h={Size.screen}
            surface="base"
        >
            {/* Sidebar */}
            <Frame
                override={{
                    w: Size.n256,
                    h: Size.fill,
                    borderRight: true,
                    p: Space.n16,
                    gap: Space.n8,
                }}
                surface="sunken"
                layout={Layout.Col.Left.Start}
                spacing={Space.n0}
            >
                <Frame
                    layout={Layout.Row.Middle.Start}
                    spacing={Space.n12}
                    override={{ px: Space.n12, py: Space.n16 }}
                    style={{ marginBottom: "var(--space-n16)" }}
                >
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

                <Frame
                    override={{ flex: 1, w: Size.fill, gap: Space.n4 }}
                    style={{ overflowY: "auto" }}
                >
                    <SidebarItem
                        icon={Home}
                        label="Home"
                        active={activeView === "home"}
                        onClick={() => setActiveView("home")}
                    />

                    <SidebarGroup label="Foundations" />
                    <SidebarItem
                        icon={Palette}
                        label="Tokens"
                        active={activeView === "tokens"}
                        onClick={() => setActiveView("tokens")}
                    />
                    <SidebarItem
                        icon={Layers}
                        label="Surface"
                        active={activeView === "surface"}
                        onClick={() => setActiveView("surface")}
                    />
                    <SidebarItem
                        icon={Type}
                        label="Text System"
                        active={activeView === "text"}
                        onClick={() => setActiveView("text")}
                    />
                    <SidebarItem
                        icon={LayoutIcon}
                        label="Layout"
                        active={activeView === "layout"}
                        onClick={() => setActiveView("layout")}
                    />

                    <SidebarGroup label="Patterns" />
                    <SidebarItem
                        icon={Command}
                        label="Command Bar"
                        active={activeView === "command-bar"}
                        onClick={() => setActiveView("command-bar")}
                    />
                </Frame>

                {/* Footer info */}
                <Frame
                    override={{ pt: Space.n16, borderTop: true, w: Size.fill }}
                    layout={Layout.Col.Center.Start}
                >
                    <Text.Card.Note style={{ opacity: 0.5 }}>v10.6.1</Text.Card.Note>
                </Frame>
            </Frame>

            {/* Content Area */}
            <Frame
                override={{
                    flex: 1,
                    h: Size.fill,
                    minWidth: Size.n0, // Prevent flex blowout
                }}
                style={{ overflow: "hidden" }}
                surface="base"
            >
                {views[activeView]}
            </Frame>
        </Frame>
    );
}

function SidebarItem({
    icon: IconSrc,
    label,
    active,
    onClick,
}: {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Frame
            onClick={onClick}
            interactive
            rounded={Radius2.md}
            surface={active ? "selected" : undefined}
            override={{
                w: Size.fill,
                px: Space.n12,
                py: Space.n8,
                cursor: "pointer",
            }}
            layout={Layout.Row.Middle.Start}
            spacing={Space.n12}
            style={{
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
            }}
        >
            <Icon
                src={IconSrc}
                size={IconSize.n16}
                style={{ opacity: active ? 1 : 0.7 }}
            />
            <Text.Menu.Item style={{ fontWeight: active ? 500 : 400 }}>
                {label}
            </Text.Menu.Item>
        </Frame>
    );
}

function SidebarGroup({ label }: { label: string }) {
    return (
        <Frame override={{ px: Space.n12, py: Space.n8 }} style={{ marginTop: "var(--space-n16)" }}>
            <Text.Menu.Item
                style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--text-tertiary)",
                    fontWeight: 600,
                }}
            >
                {label}
            </Text.Menu.Item>
        </Frame>
    );
}
