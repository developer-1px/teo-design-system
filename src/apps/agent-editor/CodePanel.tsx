/**
 * Code Panel
 * Tests: Surface raised/sunken, Text mono, Layout for diff view
 */

import { Check, FileCode } from "lucide-react";
import { useState } from "react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon.tsx";
import { Text } from "../../design-system/text/Text.tsx";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier.ts";
import type { CodeChange } from "../AgentEditorApp.tsx";

interface CodePanelProps {
  change: CodeChange;
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <Frame override={{ gap: Space.n8 }}>
      {/* Label */}
      <Frame override={{ px: Space.n12 }}>
        <Text
          size={FontSize.n12}
          weight="medium"
          style={{ color: "var(--text-subtle)" }}
        >
          {label}
        </Text>
      </Frame>

      {/* Code */}
      <Frame
        surface="sunken"
        override={{
          px: Space.n12,
          py: Space.n12,
          borderTop: true,
          borderBottom: true,
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-size-n12)",
            lineHeight: "1.6",
            color: "var(--text-body)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {code}
        </pre>
      </Frame>
    </Frame>
  );
}

export function CodePanel({ change }: CodePanelProps) {
  const [view, setView] = useState<"split" | "before" | "after">("split");

  return (
    <Frame
      layout={Layout.Col.Stretch.Start}
      spacing={Space.n0}
      override={{ h: Size.fill }}
    >
      {/* Header */}
      <Frame
        override={{
          px: Space.n12,
          py: Space.n12,
          gap: Space.n8,
          borderBottom: true,
        }}
      >
        <Frame override={{ row: true, gap: Space.n8, align: "center" }}>
          <Icon
            src={FileCode}
            size={IconSize.n16}
            style={{ color: "var(--text-body)" }}
          />
          <Text size={FontSize.n14} weight="medium">
            Code Changes
          </Text>
        </Frame>
        <Text size={FontSize.n12} style={{ color: "var(--text-subtle)" }}>
          {change.file}
        </Text>
      </Frame>

      {/* View Tabs */}
      <Frame
        override={{
          px: Space.n12,
          py: Space.n8,
          row: true,
          gap: Space.n4,
          borderBottom: true,
        }}
      >
        {(["split", "before", "after"] as const).map((v) => (
          <Frame
            key={v}
            interactive
            selected={view === v}
            onClick={() => setView(v)}
            override={{
              px: Space.n12,
              py: Space.n6,
            }}
            rounded={Radius2.md}
          >
            <Text
              size={FontSize.n12}
              weight={view === v ? "medium" : "regular"}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Text>
          </Frame>
        ))}
      </Frame>

      {/* Code View */}
      <Frame
        scroll="y"
        override={{
          flex: 1,
          minHeight: Size.n0,
          gap: Space.n16,
          py: Space.n16,
        }}
      >
        {(view === "split" || view === "before") && (
          <CodeBlock code={change.before} label="Before" />
        )}

        {view === "split" && (
          <Frame
            override={{
              px: Space.n12,
              row: true,
              gap: Space.n8,
              align: "center",
            }}
          >
            <Frame
              override={{
                w: Size.n20,
                h: Size.n20,
                align: "center",
                justify: "center",
              }}
              surface="primary"
              rounded={Radius2.full}
            >
              <Icon
                src={Check}
                size={IconSize.n12}
                style={{ color: "var(--primary-fg)" }}
              />
            </Frame>
            <Text size={FontSize.n12} style={{ color: "var(--text-subtle)" }}>
              Changes applied
            </Text>
          </Frame>
        )}

        {(view === "split" || view === "after") && (
          <CodeBlock code={change.after} label="After" />
        )}
      </Frame>
    </Frame>
  );
}
