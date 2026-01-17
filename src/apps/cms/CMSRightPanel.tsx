import { ChevronRight, X } from "lucide-react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

export function CMSRightPanel({ onClose }: { onClose: () => void }) {
  return (
    <Frame
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      override={{
        w: Size.n320,
        gap: Space.n4,
        p: Space.n4,
        border: true,
      }}
      surface="sunken" // Match sidebar
      style={{
        transition: "width 0.3s ease",
      }}
    >
      <Frame
        override={{ p: Space.n4 }}
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        h={Size.n44}
      >
        <Text.Card.Title size={FontSize.n14} weight="bold">
          Page Properties
        </Text.Card.Title>
        <Action
          icon={X}
          variant="ghost"
          size="sm"
          rounded={Radius2.full}
          onClick={onClose}
        />
      </Frame>

      <Frame
        scroll
        layout={Layout.Col.Left.Start}
        spacing={Space.n0}
        override={{ flex: 1 }}
      >
        <InspectorSection title="Identity">
          <PropertyRow label="Title" value="Marketing Home" />
          <PropertyRow label="Slug" value="/" />
          <PropertyRow label="Status" value="Published" badge="success" />
        </InspectorSection>

        <InspectorSection title="SEO">
          <PropertyRow label="Meta Title" value="Modern CMS..." />
          <PropertyRow label="Description" value="The best..." multiline />
          <PropertyRow label="Indexable" value="Yes" type="toggle" />
        </InspectorSection>

        <InspectorSection title="Appearance">
          <PropertyRow label="Theme" value="Dark Mode" />
          <PropertyRow label="Layout" value="Full Width" />
        </InspectorSection>
      </Frame>
    </Frame>
  );
}

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
        surface="base" // Slightly darker header
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
      <Text.Card.Note style={{ width: "90px", color: "var(--text-secondary)" }}>
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
