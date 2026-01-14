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

export function SlideApp() {
  return (
    <Frame fill surface="sunken" overflow="hidden">
      {/* 1. Global Header */}
      <Frame
        row
        justify="between"
        align="center"
        p={2}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          height: "44px"
        }}
      >
        <Frame row gap={3} align="center">
          <Action
            icon={Grid}
            iconSize={16}
            style={{ width: "28px", height: "28px" }}
          />
          <Frame row gap={2} align="center">
            <Text.Menu.Item style={{ fontWeight: 600 }}>
              Untitled Presentation
            </Text.Menu.Item>
            <Action
              icon={ChevronDown}
              iconSize={12}
              style={{ width: "20px", height: "20px" }}
              opacity={0.5}
            />
          </Frame>
        </Frame>
        <Frame row gap={2} align="center">
          <Frame
            row
            gap={1}
            align="center"
            surface="overlay"
            p={1}
            rounded="round"
            shadow="sm"
          >
            <Frame
              style={{ width: "16px", height: "16px" }}
              surface="overlay"
              rounded="round"
            />
            <Action
              icon={Plus}
              iconSize={10}
              style={{ width: "20px", height: "20px" }}
            />
          </Frame>
          <Action
            icon={Play}
            iconSize={14}
            label="Present"
            variant="primary"
            rounded="md"
            h="28px"
            p="0 3"
          />
          <Action
            icon={Share}
            iconSize={14}
            label="Share"
            variant="surface"
            rounded="md"
            h="28px"
            p="0 3"
          />
        </Frame>
      </Frame>

      {/* Main Layout Area */}
      <Frame flex row fill p={2} gap={2} style={{ paddingTop: "48px" }}>
        {/* 2. Left Sidebar (Slides Strip) */}
        <SlidesPanel />

        {/* 3. Central Canvas Area */}
        <Frame
          flex
          fill
          style={{ position: 'relative' }}
          rounded="round"
          overflow="hidden"
          as="main"
        >
          <Frame fill pack overflow="auto">
            <Frame
              surface="base"
              shadow="lg"
              pack
              ratio="16/9"
              style={{ width: "1000px", maxWidth: "100%" }}
            >
              <Frame gap={4} align="center">
                <Text.Prose.Title variant="xl">
                  Minimal Design Kit
                </Text.Prose.Title>
                <Text.Prose.Title variant="md" style={{ color: "var(--text-secondary)" }}>
                  Refined & Polished UI.
                </Text.Prose.Title>
                <Frame style={{ height: "4px" }} />
                <Frame row gap={3}>
                  <Frame
                    style={{ width: "40px", height: "40px" }}
                    surface="sunken"
                    rounded="round"
                    pack
                  >
                    <Square size={16} color="var(--text-body)" />
                  </Frame>
                  <Frame
                    style={{ width: "40px", height: "40px" }}
                    surface="raised"
                    rounded="round"
                    pack
                  >
                    <Circle size={16} color="var(--text-body)" />
                  </Frame>
                  <Frame
                    style={{ width: "40px", height: "40px" }}
                    surface="overlay"
                    rounded="round"
                    pack
                  >
                    <Type size={16} color="var(--text-body)" />
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
