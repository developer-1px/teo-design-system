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
import { FloatingToolbar } from "../components/FloatingToolbar";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { SlidesPanel } from "../components/SlidesPanel";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../design-system/Icon";
import { Text } from "../design-system/text/Text";
import {
  IconSize,
  Opacity,
  Size,
  Space,
  Radius2,
} from "../design-system/token";
import { ZIndex } from "../design-system/token/token.const.1tier";

export function SlideApp() {
  return (
    <Frame fill surface="sunken" clip>
      {/* 1. Global Header */}
      <Frame
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0
        }}
        override={{
          px: Space.n16,
            h: Size.n44,
            zIndex: ZIndex.n10
        }}
        layout={Layout.Row.Header.Default} border="bottom"
      >
        <Frame
          layout={Layout.Row.Item.Default}
          override={{ gap: Space.n12, align: "center" }}
        >
          <Action
            icon={Grid}
            iconSize={IconSize.n16}
            style={{ width: "var(--size-n28)", height: "var(--size-n28)" }}
          />
          <Frame
            layout={Layout.Row.Item.Default}
            override={{ gap: Space.n8, align: "center" }}
          >
            <Text.Menu.Item style={{ fontWeight: 600 }}>
              Untitled Presentation
            </Text.Menu.Item>
            <Action
              icon={ChevronDown}
              iconSize={IconSize.n12}
              style={{ width: "20px", height: "20px" }}
              opacity={Opacity.n50}
            />
          </Frame>
        </Frame>
        <Frame
          layout={Layout.Row.Actions.Default}
          override={{ gap: Space.n8, align: "center" }}
        >
          <Frame
            rounded={Radius2.md}
            layout={Layout.Row.Item.Compact}
            surface="overlay"
            override={{
              gap: Space.n4,
              p: Space.n4,
              shadow: "sm",
              align: "center",
            }}
          >
            <Frame
              override={{
                  w: Size.n28,
                  h: Size.n28
            }}
              rounded={Radius2.md}
              surface="overlay"
            />
            <Action
              icon={Plus}
              iconSize={IconSize.n10}
              style={{ width: "20px", height: "20px" }}
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
        override={{
          pt: Space.n48,
          gap: Space.n16,
        }}
        flex
        layout={Layout.Row.AppContainer.Default}
        fill
      >
        {/* 2. Left Sidebar (Slides Strip) */}
        <SlidesPanel />

        {/* 3. Central Canvas Area */}
        <Frame
          style={{ position: "relative" }}
          rounded={Radius2.md}
          flex
          fill
          clip
          as="main"
        >
          <Frame fill pack scroll>
            <Frame
              style={{ width: "80%", maxWidth: "var(--container-n1280)" }}
              override={{ shadow: "lg" }}
              rounded={Radius2["2xl"]}
              surface="base"
              pack
              ratio="16/9"
            >
              <Frame override={{ gap: Space.n16, align: "center" }}>
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
                  layout={Layout.Row.Actions.Center}
                >
                  <Frame
                    override={{ w: Size.n40, h: Size.n40 }}
                    rounded={Radius2.md}
                    surface="sunken"
                    pack
                  >
                    <Icon
                      src={Square}
                      size={IconSize.n16}
                      style={{ color: "var(--text-body)" }}
                    />
                  </Frame>
                  <Frame
                    override={{
                        w: Size.n40,
                        h: Size.n40
                    }}
                    rounded={Radius2.md}
                    surface="raised"
                    pack
                  >
                    <Icon
                      src={Circle}
                      size={IconSize.n16}
                      style={{ color: "var(--text-body)" }}
                    />
                  </Frame>
                  <Frame
                    override={{
                        w: Size.n40,
                        h: Size.n40
                    }}
                    rounded={Radius2.md}
                    surface="overlay"
                    pack
                  >
                    <Icon
                      src={Type}
                      size={IconSize.n16}
                      style={{ color: "var(--text-body)" }}
                    />
                  </Frame>
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
