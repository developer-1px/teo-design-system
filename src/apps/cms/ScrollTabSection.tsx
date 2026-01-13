import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame";

const TABS = [
  "Overview",
  "Analytics",
  "Reports",
  "Settings",
  "Users",
  "Billing",
  "Email",
  "Notifications",
  "Integrations",
  "API",
  "Support",
  "Security",
  "Audit Log",
  "Appearance",
];

export function ScrollTabSection() {
  return (
    <Frame w="100%" p="6 0" style={{ borderBottom: "1px solid var(--border-color)" }} surface="base">
      <Frame
        row
        gap={2}
        w="100%"
        overflow="auto"
        style={{
          // Hide scrollbar for cleaner look but keep functionality
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
        p="0 6"
      >
        {TABS.map((tab, i) => (
          <Action
            key={tab}
            label={tab}
            variant={i === 0 ? "primary" : "ghost"}
            rounded="full"
            h="action"
          />
        ))}
      </Frame>
    </Frame>
  );
}
