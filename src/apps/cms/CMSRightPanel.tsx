import {X} from "lucide-react"
import {Action} from "../../design-system/Action"
import {Frame} from "../../design-system/Frame/Frame.tsx"
import {Layout} from "../../design-system/Frame/Layout/Layout.ts"
import {Text} from "../../design-system/text/Text"
import {FontSize, Size, Space,} from "../../design-system/token/token.const.1tier"
import {Radius2} from "../../design-system/token/token.const.2tier"

export function CMSRightPanel({ onClose }: { onClose: () => void }) {
  return (
    <Frame
      override={{
        w: Size.n320,
        gap: Space.n4,
        p: Space.n4,
        h: Size.fill,
      }}
      surface="sunken" // Match sidebar
      style={{
        transition: "width 0.3s ease",
      }}
      override={{ border: true }}
    >
      <Frame
        override={{ gap: Space.n12, p: Space.n4 }}
        layout={Layout.Row.Header.Default}
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
        flex
        layout={Layout.Stack.Content.Loose}
        override={{ p: Space.n4 }}
      >
        {/* Placeholder Content */}
        <Frame layout={Layout.Stack.List.Dense}>
          <Text.Card.Note>Title</Text.Card.Note>
          <Frame
            override={{ h: Size.n32, p: Space.n8 }}
            rounded={Radius2.md}
            style={{ background: "var(--surface-base)" }}
          >
            <Text.Prose.Body>Marketing Home</Text.Prose.Body>
          </Frame>
        </Frame>

        <Frame override={{ gap: Space.n4 }}>
          <Text.Card.Note>Slug</Text.Card.Note>
          <Frame
            override={{ h: Size.n32, p: Space.n8 }}
            rounded={Radius2.md}
            style={{ background: "var(--surface-base)" }}
          >
            <Text.Prose.Body>/</Text.Prose.Body>
          </Frame>
        </Frame>

        <Frame override={{ gap: Space.n4 }}>
          <Text.Card.Note>Description</Text.Card.Note>
          <Frame
            override={{ h: Size.n64, p: Space.n8 }}
            rounded={Radius2.md}
            style={{ background: "var(--surface-base)" }}
          >
            <Text.Prose.Body>Main landing page...</Text.Prose.Body>
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
