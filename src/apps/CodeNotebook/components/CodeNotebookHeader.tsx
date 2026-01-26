import { Play, Save, Share2, FileCode } from "lucide-react";
import { Action } from "@/ui/primitives/Action";
import { Icon } from "@/ui/primitives/Icon";
import { Text } from "@/legacy-design-system/text/Text";
import { Radius2 } from "@/legacy-design-system/token/radius2";

export function CodeNotebookHeader() {
    return (
        <Frame
            layout={Layout.Row.Middle.Between}
            override={{
                h: Size.n64,
                px: Space.n24,
                borderBottom: true,
            }}
            style={{ backgroundColor: "var(--surface-nav)" }}
        >
            {/* Left: Breadcrumbs */}
            <Frame layout={Layout.Row.Middle.Start} spacing={Space.n12}>
                <Frame
                    w={Size.n32} h={Size.n32}
                    layout={Layout.Row.Middle.Center}
                    surface="sunken"
                    rounded={Radius2.md}
                >
                    <Icon src={FileCode} size={IconSize.n18} />
                </Frame>

                <Frame layout={Layout.Row.Middle.Start} spacing={Space.n8}>
                    <Text.Prose.Body style={{ color: "var(--text-tertiary)", margin: 0 }}>Notebooks</Text.Prose.Body>
                    <Text.Prose.Body style={{ color: "var(--text-tertiary)", margin: 0 }}>/</Text.Prose.Body>
                    <Text.Prose.Title variant="sm" style={{ margin: 0 }}>Untitled.ts</Text.Prose.Title>
                </Frame>
            </Frame>

            {/* Right: Actions */}
            <Frame layout={Layout.Row.Middle.End} spacing={Space.n8}>
                <Action variant="ghost" icon={Save} tooltip="Save" />
                <Action variant="ghost" icon={Share2} tooltip="Share" />
                <Frame style={{ width: 1, height: 16, background: "var(--border-subtle)", margin: "0 8px" }} />
                <Action variant="primary" icon={Play} label="Run" />
            </Frame>
        </Frame>
    );
}
