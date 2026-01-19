import {
  ChevronDown,
  Circle,
  Grid,
  Play,
  Plus,
  Share,
  Square,
  Type,
} from "lucide-react";
import { useState } from "react";
import { FloatingToolbar } from "../components/FloatingToolbar";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { SlidesPanel } from "../components/SlidesPanel";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../design-system/Icon";
import { SegmentedControl } from "../design-system/SegmentedControl";
import { Text } from "../design-system/text/Text";
import {
  IconSize,
  Opacity,
  Radius2,
  Size,
  Space,
} from "../design-system/token";

export function SlideApp() {
  const [activeTool, setActiveTool] = useState("square");
  return (
    <Frame
      layout={Layout.Col.Left.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      surface="sunken"
    >
      {/* 1. Global Header */}
      <Frame
        // Header is now part of the flex column, no longer absolute
        override={{
          borderBottom: true,
        }}
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        h={Size.n44}
      >
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
          override={{ px: Space.n16, minHeight: Size.n40 }}
        >
          <Action
            icon={Grid}
            iconSize={IconSize.n16}
            style={
              { width: "var(--size-n28)", height: "var(--size-n28)" } as any
            }
          />
          <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n12}
            override={{ gap: Space.n8, minHeight: Size.n40 }}
          >
            <Text.Menu.Item style={{ fontWeight: 600 }}>
              Untitled Presentation
            </Text.Menu.Item>
            <Action
              icon={ChevronDown}
              iconSize={IconSize.n12}
              style={{ width: "20px", height: "20px" } as any}
              opacity={Opacity.n50}
            />
          </Frame>
        </Frame>
        <Frame layout={Layout.Row.Middle.End} spacing={Space.n8}>
          <Frame
            rounded={Radius2.md}
            layout={Layout.Row.Middle.Center}
            spacing={Space.n4}
            surface="overlay"
            override={{ p: Space.n4, minHeight: Size.n24 }}
            style={{ boxShadow: "var(--elevation-n1)" }}
          >
            <Frame
              override={{
                w: Size.n24,
                h: Size.n24,
              }}
              rounded={Radius2.md}
              surface="overlay"
            />
            <Action
              icon={Plus}
              iconSize={IconSize.n10}
              style={{ width: "20px", height: "20px" } as any}
            />
          </Frame>
          <Action
            icon={Play}
            iconSize={IconSize.n14}
            label="Present"
            variant="primary"
            rounded={Radius2.md}
            h={Size.n32}
            py={Space.n0}
            px={Space.n12}
          />
          <Action
            icon={Share}
            iconSize={IconSize.n14}
            label="Share"
            variant="surface"
            rounded={Radius2.md}
            h={Size.n32}
            py={Space.n0}
            px={Space.n12}
          />
        </Frame>
      </Frame>

      {/* Main Layout Area */}
      <Frame
        layout={Layout.Row.Stretch.Start}
        spacing={Space.n16}
        w={Size.fill}
        h={Size.fill}
      >
        {/* 2. Left Sidebar (Slides Strip) */}
        <SlidesPanel />

        {/* 3. Central Canvas Area */}
        <Frame
          style={{ position: "relative", overflow: "hidden" }}
          rounded={Radius2.md}
          override={{
            w: Size.fill,
            h: Size.fill,
            flex: 1,
          }}
        >
          <Frame
            scroll
            layout={Layout.Col.Center.Start}
            spacing={Space.n0}
            h={Size.fill}
          >
            <Frame
              override={{
                ratio: "16/9",
              }}
              style={{
                boxShadow: "var(--elevation-n3)",
                width: "80%",
                maxWidth: "var(--container-n1280)",
              }}
              rounded={Radius2["2xl"]}
              surface="base"
              layout={Layout.Col.Center.Start}
              spacing={Space.n0}
            >
              <Frame layout={Layout.Col.Center.Start} spacing={Space.n16}>
                <Text.Prose.Title variant="xl">
                  Minimal Design Kit
                </Text.Prose.Title>
                <Text.Prose.Title
                  variant="md"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Refined & Polished UI.
                </Text.Prose.Title>
                <Frame override={{ h: Size.n4 }} />
                <Frame
                  override={{ gap: Space.n12 }}
                  layout={Layout.Row.Middle.Center}
                  spacing={Space.n8}
                >
                  <SegmentedControl
                    w={Size.n128} // Approx width for 3 items
                    value={activeTool}
                    onChange={setActiveTool}
                    options={[
                      {
                        value: "square",
                        label: <Icon src={Square} size={IconSize.n16} />,
                      },
                      {
                        value: "circle",
                        label: <Icon src={Circle} size={IconSize.n16} />,
                      },
                      {
                        value: "type",
                        label: <Icon src={Type} size={IconSize.n16} />,
                      },
                    ]}
                  />
                </Frame>
              </Frame>
            </Frame>
          </Frame>
        </Frame>

        {/* 4. Right Sidebar (Design Panel) */}
        <PropertiesPanel />
      </Frame>

      {/* 5. Bottom Floating Toolbar */}
      <FloatingToolbar />
    </Frame>
  );
}
