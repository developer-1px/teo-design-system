import { ChevronRight, X } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Overlay } from "../../design-system/Overlay";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

export function CMSDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Drawer */}
      <Overlay
        position="fixed"
        right="0"
        y="0"
        zIndex={301}
        style={{
          height: "100vh",
          animation: "slideInRight 0.3s ease-out",
        }}
      >
        <Frame
          layout={Layout.Col.Left.Start}
          spacing={Space.n0}
          override={{
            w: Size.n512,
            h: Size.screen,
            shadow: "2xl",
            borderLeft: true,
          }}
          surface="base"
        >
          {/* Header */}
          <Frame
            override={{
              py: Space.n12,
              px: Space.n16,
              borderBottom: true,
              h: Size.n48,
            }}
            layout={Layout.Row.Middle.Between}
            spacing={Space.n8}
          >
            <Text
              size={FontSize.n14}
              weight="bold"
              style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              Options
            </Text>
            <Action
              icon={X}
              variant="ghost"
              size="sm"
              iconSize={IconSize.n16}
              onClick={onClose}
              rounded={Radius2.full}
            />
          </Frame>

          {/* Content */}
          <Frame
            layout={Layout.Col.Left.Start}
            spacing={Space.n0}
            override={{ flex: 1 }}
            scroll
          >
            <InspectorSection title="General Settings">
              <PropertyRow
                label="Auto-Save"
                value="On"
                type="toggle"
                badge="success"
              />
              <PropertyRow label="Dark Mode" value="System" />
            </InspectorSection>
            <InspectorSection title="Advanced">
              <PropertyRow label="Debug Mode" value="Off" />
              <PropertyRow label="API Key" value="sk-..." />
            </InspectorSection>
          </Frame>
        </Frame>
      </Overlay>

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </>
  );
}

// Reuse Inspector Components (In a real app, these would be shared)
function InspectorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Frame
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      override={{ borderBottom: true }}
    >
      <Frame
        layout={Layout.Row.Middle.Between}
        spacing={Space.n8}
        override={{ p: Space.n12, h: Size.n40, cursor: "pointer" }}
        surface="base"
      >
        <Text.Card.Title
          size={FontSize.n12}
          weight="bold"
          style={{ textTransform: "uppercase", opacity: 0.7 }}
        >
          {title}
        </Text.Card.Title>
        <Icon
          src={ChevronRight}
          size={Size.n12}
          style={{ opacity: 0.5, transform: "rotate(90deg)" }}
        />
      </Frame>
      <Frame override={{ p: Space.n4, gap: Space.n2 }}>{children}</Frame>
    </Frame>
  );
}

function PropertyRow({ label, value, badge, multiline }: any) {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n8}
      override={{ p: Space.n8, h: multiline ? "auto" : Size.n32 }}
    >
      <Text.Card.Note
        style={{ width: "120px", color: "var(--text-secondary)" }}
      >
        {label}
      </Text.Card.Note>
      <Frame override={{ flex: 1, justify: "end" }}>
        {badge ? (
          <Frame
            override={{ px: Space.n6, py: Space.n2, r: Radius2.sm }}
            style={{
              background: "var(--color-success-dim)",
              color: "var(--color-success)",
            }}
          >
            <Text.Card.Note weight="bold" size={FontSize.n11}>
              {value}
            </Text.Card.Note>
          </Frame>
        ) : (
          <Text.Prose.Body
            size={FontSize.n13}
            style={{ color: "var(--text-primary)", textAlign: "right" }}
          >
            {value}
          </Text.Prose.Body>
        )}
      </Frame>
    </Frame>
  );
}
