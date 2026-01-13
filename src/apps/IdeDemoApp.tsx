import {
  Bug,
  FileText,
  GitBranch,
  Play,
  Search,
  Settings,
  Square,
} from "lucide-react";
import { Action } from "../design-system/Action";
import { Divider } from "../design-system/Divider";
import { Field } from "../design-system/Field";
import { Text } from "../design-system/Text";
import { Frame } from "../design-system/Frame";
import { Part } from "../design-system/Part";
import { Section } from "../design-system/Section";
import { Stack } from "../design-system/Stack";
import { Workbench } from "../design-system/Workbench";

export default function IdeDemoApp() {
  return (
    <Workbench
      columns="50px 250px 1fr 300px" // ActivityBar, SideBar, Editor, Panel
      rows="40px 1fr 24px" // Header, Body, StatusBar
      areas={`
				"header header header header"
				"activity sidebar editor panel"
				"status status status status"
			`}
    >
      {/* 1. Header */}
      <Part
        area="header"
        surface="raised"
        style={{ zIndex: 10, borderBottom: "1px solid var(--border-color)" }}
      >
        <Stack
          direction="row"
          fill
          align="center"
          justify="between"
          style={{ padding: "0 16px" }}
        >
          <Stack direction="row" gap={16} align="center">
            <Text weight="bold">Lamplit IDE</Text>
            <Stack direction="row" gap={4}>
              <Action label="File" variant="ghost" size="sm" />
              <Action label="Edit" variant="ghost" size="sm" />
              <Action label="View" variant="ghost" size="sm" />
            </Stack>
          </Stack>

          <Stack direction="row" gap={8} align="center">
            <Action icon={Play} variant="ghost" tooltip="Run" />
            <Action icon={Square} variant="ghost" tooltip="Stop" />
            <Divider orientation="vertical" variant="line" size={8} />
            <Action icon={Bug} variant="ghost" tooltip="Debug" />
          </Stack>
        </Stack>
      </Part>

      {/* 2. Activity Bar */}
      <Part area="activity" surface="sunken" style={{ borderRight: "1px solid var(--border-color)" }} p={2}>
        <Stack gap={16} align="center" p="2 0 0 0">
          <Action
            icon={FileText}
            variant="ghost"
            size={40}
            tooltip="Explorer"
          />
          <Action icon={Search} variant="ghost" size={40} tooltip="Search" />
          <Action
            icon={GitBranch}
            variant="ghost"
            size={40}
            tooltip="Source Control"
          />
        </Stack>
        <Stack fill />
        <Stack gap={16} align="center" p="0 0 2 0">
          <Action
            icon={Settings}
            variant="ghost"
            size={40}
            tooltip="Settings"
          />
        </Stack>
      </Part>

      {/* 3. Side Bar */}
      <Part
        area="sidebar"
        surface="base"
        style={{ borderRight: "1px solid var(--border-color)" }}
        resize="right"
        minSize={150}
        maxSize={500}
        p={0}
      >
        <Section title="EXPLORER" fill>
          <Stack gap={2} p={2}>
            <Action
              label="src"
              icon={FileText}
              variant="ghost"
              justify="start"
            />
            <Stack p="0 0 0 3" gap={2}>
              <Action
                label="components"
                icon={FileText}
                variant="ghost"
                justify="start"
              />
              <Action
                label="App"
                icon={FileText}
                variant="ghost"
                justify="start"
              />
            </Stack>
            <Action
              label="package.json"
              icon={FileText}
              variant="ghost"
              justify="start"
            />
          </Stack>
        </Section>
        <Divider />
        <Section title="OUTLINE">
          <Stack p={4}>
            <Text variant={6} color="subtle">
              No symbols found
            </Text>
          </Stack>
        </Section>
      </Part>

      {/* 4. Editor Area */}
      <Part area="editor" surface="base" p={0} style={{ overflow: "hidden" }}>
        {/* Editor Tabs (Folder Tabs) */}
        <Stack
          direction="row"
          style={{
            borderBottom: "1px solid var(--border-color)",
            backgroundColor: "var(--surface-sunken)",
          }}
        >
          <Action
            label="IdeDemoApp"
            variant="surface"
            rounded="none"
            style={{
              borderBottom: "1px solid var(--surface-base)",
              marginBottom: "-1px",
            }}
          />
          <Action label="Workbench" variant="ghost" rounded="none" />
          <Action label="Stack" variant="ghost" rounded="none" />
        </Stack>

        {/* Editor Content */}
        <Frame fill p={4} style={{ fontFamily: "monospace", overflow: "auto" }}>
          <Text variant={5} color="primary">
            import
          </Text>{" "}
          <Text variant={5}>React</Text>{" "}
          <Text variant={5} color="primary">
            from
          </Text>{" "}
          <Text variant={5}>"react"</Text>;
          <br />
          <Text variant={5} color="primary">
            export function
          </Text>{" "}
          <Text variant={5} color="accent">
            Demo
          </Text>
          () {"{"}
          <br />
          &nbsp;&nbsp;
          <Text variant={5} color="primary">
            return
          </Text>{" "}
          &lt;
          <Text variant={5} color="accent">
            Workbench
          </Text>{" "}
          /&gt;;
          <br />
          {"}"}
        </Frame>
      </Part>

      {/* 5. Right Panel */}
      <Part
        area="panel"
        surface="sunken"
        style={{ borderLeft: "1px solid var(--border-color)" }}
        resize="left"
        minSize={200}
        p={0}
      >
        <Section title="PROPERTIES" border="bottom">
          <Stack gap={16} p={4}>
            <Stack gap={4}>
              <Text variant={6} weight="bold">
                Layout
              </Text>
              <Field label="Width" defaultValue="100%" />
              <Field label="Height" defaultValue="Auto" />
            </Stack>
            <Divider />
            <Stack gap={4}>
              <Text variant={6} weight="bold">
                Typography
              </Text>
              <Field label="Font" defaultValue="Inter" />
              <Field label="Size" defaultValue="14px" />
            </Stack>
          </Stack>
        </Section>
      </Part>

      {/* 6. Status Bar */}
      <Part area="status" surface="primary" p={0} style={{ zIndex: 10 }}>
        <Stack
          direction="row"
          fill
          align="center"
          justify="between"
          style={{ padding: "0 12px", fontSize: "12px" }}
        >
          <Stack direction="row" gap={16}>
            <span>main*</span>
            <span>0 errors</span>
          </Stack>
          <Stack direction="row" gap={16}>
            <span>Ln 12, Col 4</span>
            <span>UTF-8</span>
            <span>TypeScript React</span>
          </Stack>
        </Stack>
      </Part>
    </Workbench>
  );
}
