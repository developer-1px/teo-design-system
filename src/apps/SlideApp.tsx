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
import { Text } from "../design-system/text/Text";
import { Frame } from "../design-system/Frame";
import { Icon } from "../design-system/Icon";
import { Space } from "../design-system/token/token.const.1tier";
import { IconSize } from "../design-system/token/token.const.1tier";

export function SlideApp() {
  return (
    <Frame fill surface="sunken" overflow="hidden">
      {/* 1. Global Header */}
      <Frame
        override={{
          p: 2,
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: "44px",
          },
        }}
        row
        justify="between"
        align="center"
      >
        <Frame override={{ gap: Space.n12 }} row align="center">
          <Action
            icon={Grid}
            iconSize={IconSize.n16}
            style={{ width: "28px", height: "28px" }}
          />
          <Frame override={{ gap: Space.n8 }} row align="center">
            <Text.Menu.Item style={{ fontWeight: 600 }}>
              Untitled Presentation
            </Text.Menu.Item>
            <Action
              icon={ChevronDown}
              iconSize={IconSize.n12}
              style={{ width: "20px", height: "20px" }}
              opacity={0.5}
            />
          </Frame>
        </Frame>
        <Frame override={{ gap: Space.n8 }} row align="center">
          <Frame
            override={{ gap: Space.n4, p: 1, rounded: "round", shadow: "sm" }}
            row
            align="center"
            surface="overlay"
          >
            <Frame
              override={{
                style: { width: "16px", height: "16px" },
                rounded: "round",
              }}
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
            rounded="md"
            h="28px"
            p="0 3"
          />
          <Action
            icon={Share}
            iconSize={IconSize.n14}
            label="Share"
            variant="surface"
            rounded="md"
            h="28px"
            p="0 3"
          />
        </Frame>
      </Frame>

      {/* Main Layout Area */}
      <Frame
        override={{ p: 2, gap: Space.n8, style: { paddingTop: "48px" } }}
        flex
        row
        fill
      >
        {/* 2. Left Sidebar (Slides Strip) */}
        <SlidesPanel />

        {/* 3. Central Canvas Area */}
        <Frame
          override={{ style: { position: "relative" }, rounded: "round" }}
          flex
          fill
          overflow="hidden"
          as="main"
        >
          <Frame fill pack overflow="auto">
            <Frame
              override={{
                shadow: "lg",
                style: { width: "1000px", maxWidth: "100%" },
              }}
              surface="base"
              pack
              ratio="16/9"
            >
              <Frame override={{ gap: Space.n16 }} align="center">
                <Text.Prose.Title variant="xl">
                  Minimal Design Kit
                </Text.Prose.Title>
                <Text.Prose.Title
                  variant="md"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Refined & Polished UI.
                </Text.Prose.Title>
                <Frame override={{ style: { height: "4px" } }} />
                <Frame override={{ gap: Space.n12 }} row>
                  <Frame
                    override={{
                      style: { width: "40px", height: "40px" },
                      rounded: "round",
                    }}
                    surface="sunken"
                    pack
                  >
                    <Icon src={Square} size={IconSize.n16} style={{ color: "var(--text-body)" }} />
                  </Frame>
                  <Frame
                    override={{
                      style: { width: "40px", height: "40px" },
                      rounded: "round",
                    }}
                    surface="raised"
                    pack
                  >
                    <Icon src={Circle} size={IconSize.n16} style={{ color: "var(--text-body)" }} />
                  </Frame>
                  <Frame
                    override={{
                      style: { width: "40px", height: "40px" },
                      rounded: "round",
                    }}
                    surface="overlay"
                    pack
                  >
                    <Icon src={Type} size={IconSize.n16} style={{ color: "var(--text-body)" }} />
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
