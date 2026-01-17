import { LAYOUT_CONFIG } from "../../layout.config";
import { Frame } from "../design-system/Frame/Frame";
import { Layout } from "../design-system/Frame/Layout/Layout";
import { Text } from "../design-system/text/Text";
import {
  FontSize,
  Size,
  Space,
} from "../design-system/token/token.const.1tier";
import { Radius2 } from "../design-system/token/token.const.2tier";

function getLayoutToken(pathSegments: readonly string[]) {
  let current: any = Layout;
  for (const segment of pathSegments) {
    const parts = segment.split(".");
    for (const part of parts) {
      if (current && part in current) {
        current = current[part];
      } else {
        console.warn(`Token not found: ${part} in ${segment}`);
        return null;
      }
    }
  }
  return current;
}

export function LayoutShowcaseApp() {
  return (
    <Frame
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      surface="base"
      scroll
      override={{ pb: Space.n64 }} // Space for navbar
    >
      <Frame
        layout={Layout.Col.Left.Start}
        spacing={Space.n16}
        override={{ w: Size.fill, maxWidth: "1200px", align: "center" }}
      >
        <Text.Prose.Title variant="h1">Layout Showcase</Text.Prose.Title>
        <Text.Prose.Body style={{ color: "var(--text-secondary)" }}>
          A complete list of all {LAYOUT_CONFIG.length} legitimate layout
          combinations defined in <code>layout.config.ts</code>.
        </Text.Prose.Body>

        <Frame layout={Layout.Col.Left.Start} spacing={Space.n20}>
          {LAYOUT_CONFIG.map((config, index) => {
            const layoutToken = getLayoutToken(config);
            const pathString = `Layout.${config.join(".")}`;

            if (!layoutToken) return null;

            return (
              <Frame
                key={index}
                layout={Layout.Col.Left.Start}
                spacing={Space.n8}
                override={{
                  p: Space.n24,
                  border: true,
                  gap: Space.n16,
                  w: Size.fill,
                }}
                rounded={Radius2.lg}
                surface="sunken"
              >
                <Frame layout={Layout.Col.Left.Start} spacing={Space.n4}>
                  <Text.Card.Title
                    size={FontSize.n14}
                    style={{ fontFamily: "monospace" }}
                  >
                    {pathString}
                  </Text.Card.Title>
                  <Text.Card.Note style={{ color: "var(--text-tertiary)" }}>
                    {JSON.stringify(config)}
                  </Text.Card.Note>
                </Frame>

                {/* Preview Area */}
                <Frame
                  layout={layoutToken}
                  override={{
                    border: true,
                    w: Size.fill,
                  }}
                  rounded={Radius2.md}
                  style={{
                    backgroundColor: "var(--surface-base)",
                    minHeight: "64px",
                  }}
                >
                  <DemoBlock label="1" />
                  <DemoBlock label="2" />
                  <DemoBlock label="3" />
                </Frame>
              </Frame>
            );
          })}
        </Frame>
      </Frame>
    </Frame>
  );
}

function DemoBlock({ label }: { label: string }) {
  return (
    <Frame
      rounded={Radius2.sm}
      surface="raised"
      override={{
        w: Size.n32,
        h: Size.n32,
        align: "center",
        justify: "center",
        border: true,
      }}
    >
      <Text size={FontSize.n12} weight="bold">
        {label}
      </Text>
    </Frame>
  );
}
