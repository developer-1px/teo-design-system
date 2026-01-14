import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame";
import { Space } from "../../design-system/token/token.const.1tier";

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
    <Frame
      override={{
        w: "100%",
        p: "6 0",
        style: { borderBottom: "1px solid var(--border-color)" },
      }}
      surface="base"
    >
      <Frame
        override={{
          gap: Space.n8,
          w: "100%",
          style: {
            // Hide scrollbar for cleaner look but keep functionality
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          },
          p: "0 6",
        }}
        row
        overflow="auto"
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
