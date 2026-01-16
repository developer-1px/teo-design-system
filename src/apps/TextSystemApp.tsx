import { FileText, Globe, Monitor } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Action } from "../design-system/Action";
import { Experience, type ExperienceType } from "../design-system/Experience";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../design-system/Icon";
import { Text } from "../design-system/text/Text";
import {
  ContainerSize,
  FontSize,
  IconSize,
  Size,
  Space,
  ZIndex,
} from "../design-system/token/token.const.1tier";
import { Radius2 } from "../design-system/token/token.const.2tier";

/* 
  Text System Showcase
  Demonstrates the 4-level hierarchy: Experience > Context > Slot > Variant
*/

export function TextSystemApp() {
  const [experience, setExperience] = useState<ExperienceType>("application");

  return (
    <Experience value={experience}>
      <Frame
        style={{ scrollSnapType: "y mandatory" } as React.CSSProperties}
        scroll="y"
        override={{
          w: Size.fill,
          h: Size.screen,
        }}
        surface="base"
        layout={Layout.Stack.Content.None}
      >
        {/* Floating Experience Switcher */}
        <Frame
          style={
            {
              position: "fixed",
              top: 24,
              left: "50%",
              transform: "translateX(-50%)",
            } as React.CSSProperties
          }
          override={{
            shadow: "lg",
            p: Space.n4,
            zIndex: ZIndex.n100,
            r: Radius2.full,
          }}
          surface="raised" // Added surface
          layout={Layout.Row.Actions.Center}
        >
          <ExperienceButton
            active={experience === "landing"}
            onClick={() => setExperience("landing")}
            icon={Globe}
            label="Landing"
          />
          <ExperienceButton
            active={experience === "document"}
            onClick={() => setExperience("document")}
            icon={FileText}
            label="Document"
          />
          <ExperienceButton
            active={experience === "application"}
            onClick={() => setExperience("application")}
            icon={Monitor}
            label="Application"
          />
        </Frame>

        {/* Section 0: Text System Intro (1-Column Layout) */}
        <Frame
          style={
            {
              scrollSnapAlign: "start",
            } as React.CSSProperties
          }
          surface="base"
          override={{
            w: Size.fill,
            minHeight: Size.screen, // Changed to minHeight
            p: Space.n40,
          }}
          layout={Layout.Center.Default}
        >
          <Frame
            maxWidth={ContainerSize.n800}
            override={{ gap: Space.n32, w: Size.fill }}
            layout={Layout.Center.Default}
          >
            <Frame
              style={
                {
                  background:
                    "linear-gradient(135deg, var(--surface-raised), var(--surface-sunken))",
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                } as React.CSSProperties
              }
              override={{
                p: Space.n16,
                r: Radius2["3xl"],
                border: true,
              }}
              surface="sunken"
            >
              <Icon
                src={FileText}
                size={Size.n80}
                style={{ strokeWidth: 1, opacity: 0.8 }}
              />
            </Frame>

            <Frame override={{ gap: Space.n16, align: "center" }}>
              <Text.Prose.Title
                variant="xl"
                style={{
                  fontSize: FontSize.n72,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                Text System
              </Text.Prose.Title>
              <Text.Prose.Body
                style={
                  {
                    fontSize: FontSize.n24,
                    textAlign: "center",
                    opacity: 0.6,
                    maxWidth: "600px",
                  } as React.CSSProperties
                }
              >
                A semantic, context-aware hierarchy engine.
              </Text.Prose.Body>
            </Frame>

            {/* Hierarchy Visualization */}
            <Frame
              layout={Layout.Row.Item.Default}
              style={{ marginTop: Space.n8 } as React.CSSProperties}
              override={{ gap: Space.n0 }}
            >
              {[
                { title: "Experience", desc: "Global Scale", icon: Globe },
                { title: "Context", desc: "Semantic Role", icon: FileText },
                { title: "Slot", desc: "Content Area", icon: Monitor }, // Placeholder icon for slot
                { title: "Variant", desc: "Visual Style", icon: Monitor }, // Placeholder
              ].map((layer, i) => (
                <Frame
                  key={i}
                  layout={Layout.Row.Item.Default}
                  override={{ gap: Space.n0, align: "center" }}
                >
                  <Frame
                    override={{
                      py: Space.n16,
                      px: Space.n24,
                      shadow: "sm",
                      gap: Space.n4,
                      w: Size.n160,
                      r: Radius2.xl,
                    }}
                    surface="raised"
                  >
                    <Text.Card.Note
                      style={
                        {
                          opacity: 0.5,
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        } as React.CSSProperties
                      }
                    >
                      Layer {i + 1}
                    </Text.Card.Note>
                    <Text.Card.Title>{layer.title}</Text.Card.Title>
                    <Text.Card.Desc>{layer.desc}</Text.Card.Desc>
                  </Frame>
                  {i < 3 && (
                    <Frame
                      style={
                        {
                          background: "var(--border-color)",
                        } as React.CSSProperties
                      }
                      override={{
                        w: Size.n32,
                        h: Size.n4,
                      }}
                    />
                  )}
                </Frame>
              ))}
            </Frame>
          </Frame>
        </Frame>

        {/* Section 1: Context: Prose */}
        <ShowcaseSection
          title="Context: Prose"
          description="Standard running text for documents and articles."
          code={`<Text.Prose.Title>Context: Prose</Text.Prose.Title>
<Text.Prose.Body>
  Optimized for readability and flow.
  Scales automatically with Experience.
</Text.Prose.Body>`}
        >
          <Frame
            maxWidth={ContainerSize.n640} // Approx 600px
            style={{ textAlign: "left" } as React.CSSProperties}
            override={{ gap: Space.n24, w: Size.fill }}
          >
            <Text.Prose.Title>Context: Prose</Text.Prose.Title>
            <Text.Prose.Body>
              The <strong>Prose</strong> context is designed for continuous
              reading. It manages line height, spacing, and font weight to
              ensure comfortable legibility.
            </Text.Prose.Body>
            <Text.Prose.Body>
              The <strong>Experience</strong> (Application, Landing, or
              Document) automatically adjusts the scale. For example, 'Landing'
              experience will render this text significantly larger than
              'Application'.
            </Text.Prose.Body>
            <Text.Prose.Note>
              Try switching the Experience mode at the top to see this text
              adapt live.
            </Text.Prose.Note>
          </Frame>
        </ShowcaseSection>

        {/* Section 2: Card Context */}
        <ShowcaseSection
          title="Context: Card"
          description="Compact, summarized information blocks."
          code={`<Frame override={{ p: Space.n24, r: Radius2.xl, border: true }} surface="raised">
  <Text.Card.Title>Project Alpha</Text.Card.Title>
  <Text.Card.Desc>
    High-priority infrastructure migration.
  </Text.Card.Desc>
  <Text.Card.Note>Updated 2h ago</Text.Card.Note>
</Frame>`}
        >
          <Frame
            layout={Layout.Wrap.Chips.Default}
            override={{ gap: Space.n32, justify: "center" }}
          >
            <Frame
              override={{
                p: Space.n24,
                gap: Space.n12,
                w: Size.n320,
                shadow: "sm",
                r: Radius2.xl,
                border: true,
              }}
              surface="raised"
            >
              <Frame
                override={{ w: Size.n40, h: Size.n40, r: Radius2.lg }}
                style={{ marginBottom: Space.n2 } as React.CSSProperties}
                surface="sunken"
                pack
              >
                <Icon src={Globe} size={IconSize.n40} />
              </Frame>
              <Text.Card.Title>Project Alpha</Text.Card.Title>
              <Text.Card.Desc>
                High-priority infrastructure migration for the core payment
                gateway.
              </Text.Card.Desc>
              <Frame
                layout={Layout.Row.Actions.Between}
                style={{ marginTop: Space.n4 } as React.CSSProperties}
              >
                <Text.Card.Note style={{ opacity: 0.6 }}>
                  Updated 2h ago
                </Text.Card.Note>
                <Action size="sm" variant="ghost" label="View" />
              </Frame>
            </Frame>

            <Frame
              override={{
                p: Space.n24,
                gap: Space.n12,
                w: Size.n320,
                shadow: "sm",
                r: Radius2.xl,
                border: true,
              }}
              surface="raised"
            >
              <Frame
                override={{ w: Size.n40, h: Size.n40, r: Radius2.lg }}
                style={{ marginBottom: Space.n2 } as React.CSSProperties}
                surface="sunken"
                pack
              >
                <Icon src={FileText} size={IconSize.n40} />
              </Frame>
              <Text.Card.Title>Q1 Report</Text.Card.Title>
              <Text.Card.Desc>
                Quarterly financial analysis and growth projections.
              </Text.Card.Desc>
              <Frame
                layout={Layout.Row.Actions.Between}
                style={{ marginTop: Space.n4 } as React.CSSProperties}
              >
                <Text.Card.Note style={{ opacity: 0.6 }}>Draft</Text.Card.Note>
                <Action size="sm" variant="ghost" label="Edit" />
              </Frame>
            </Frame>
          </Frame>
        </ShowcaseSection>

        {/* Section 3: Field Context */}
        <ShowcaseSection
          title="Context: Field"
          description="Input labels, values, and hints optimized for forms."
          code={`<Frame override={{ gap: 1 }} >
  <Text.Field.Label>Email Address</Text.Field.Label>
  <Input placeholder="name@example.com" />
  <Text.Field.Note>We'll never share your email.</Text.Field.Note>
</Frame>`}
        >
          <Frame
            override={{
              w: Size.n384,
              p: Space.n32,
              gap: Space.n24,
              r: Radius2["2xl"],
              border: true,
            }}
            surface="raised"
          >
            <Text.Prose.Title style={{ fontSize: "var(--prose-h3-size)" }}>
              Account Settings
            </Text.Prose.Title>

            <Frame override={{ gap: Space.n16 }}>
              <Frame override={{ gap: Space.n6 }}>
                <Text.Field.Label>Display Name</Text.Field.Label>
                <Frame
                  override={{
                    h: Size.n32,
                    align: "center",
                    r: Radius2.md,
                    px: Space.n4,
                    border: true,
                  }}
                  surface="sunken"
                >
                  <Text.Field.Value style={{ opacity: 0.5 }}>
                    Jane Doe
                  </Text.Field.Value>
                </Frame>
              </Frame>

              <Frame override={{ gap: Space.n6 }}>
                <Text.Field.Label>Email Address</Text.Field.Label>
                <Frame
                  override={{
                    h: Size.n32,
                    align: "center",
                    r: Radius2.md,
                    px: Space.n4,
                    border: true,
                  }}
                  surface="sunken"
                >
                  <Text.Field.Value style={{ opacity: 0.5 }}>
                    name@example.com
                  </Text.Field.Value>
                </Frame>
                <Text.Field.Note>
                  Used for notifications and login.
                </Text.Field.Note>
              </Frame>

              <Frame override={{ gap: Space.n6 }}>
                <Text.Field.Label>Bio</Text.Field.Label>
                <Frame
                  override={{
                    h: Size.n80,
                    p: Space.n12,
                    r: Radius2.md,
                    border: true,
                  }}
                  surface="sunken"
                >
                  <Text.Field.Value style={{ opacity: 0.5 }}>
                    Product Designer based in Seoul.
                  </Text.Field.Value>
                </Frame>
              </Frame>
            </Frame>

            <Frame
              layout={Layout.Row.Actions.Default}
              override={{ gap: Space.n12, justify: "end" }}
              style={{ marginTop: Space.n4 } as React.CSSProperties}
            >
              <Action variant="ghost" label="Cancel" />
              <Action variant="primary" label="Save Changes" />
            </Frame>
          </Frame>
        </ShowcaseSection>

        {/* Section 4: Table Context */}
        <ShowcaseSection
          title="Context: Table"
          description="Tabular data with clear hierarchy between heads and cells."
          code={`<Frame override={{ p: Space.n12, border: true }} row >
  <Text.Table.Head>Name</Text.Table.Head>
  <Text.Table.Head>Role</Text.Table.Head>
</Frame>
<Frame override={{ p: 3, border: true }} row >
  <Text.Table.Cell>Alice</Text.Table.Cell>
  <Text.Table.Cell>Admin</Text.Table.Cell>
</Frame>`}
        >
          <Frame
            maxWidth={ContainerSize.n800}
            override={{
              w: Size.fill,
              r: Radius2.xl,
              border: true,
            }}
            surface="raised"
            clip
          >
            <Frame
              override={{
                py: Space.n12,
                px: Space.n16,
                borderBottom: true,
              }}
              layout={Layout.Row.Item.Default}
              surface="sunken"
            >
              <Frame flex={2}>
                <Text.Table.Head>User</Text.Table.Head>
              </Frame>
              <Frame flex={1}>
                <Text.Table.Head>Role</Text.Table.Head>
              </Frame>
              <Frame flex={1}>
                <Text.Table.Head>Status</Text.Table.Head>
              </Frame>
              <Frame flex={1} override={{ align: "end" }}>
                <Text.Table.Head>Activity</Text.Table.Head>
              </Frame>
            </Frame>
            {[
              {
                name: "Alice Johnson",
                email: "alice@company.com",
                role: "Admin",
                status: "Active",
                date: "2h ago",
              },
              {
                name: "Bob Smith",
                email: "bob@company.com",
                role: "Editor",
                status: "Offline",
                date: "1d ago",
              },
              {
                name: "Charlie Kim",
                email: "charlie@company.com",
                role: "Viewer",
                status: "Active",
                date: "5m ago",
              },
              {
                name: "David Park",
                email: "david@company.com",
                role: "Viewer",
                status: "Inactive",
                date: "1w ago",
              },
            ].map((user, i) => (
              <Frame
                key={i}
                layout={Layout.Row.Item.Default}
                surface="hover"
                override={{
                  py: Space.n12,
                  px: Space.n16,
                  align: "center",
                  borderBottom: true,
                }}
              >
                <Frame override={{ gap: Space.n2 }} flex={2}>
                  <Text.Table.Cell style={{ fontWeight: 500 }}>
                    {user.name}
                  </Text.Table.Cell>
                  <Text.Table.Cell style={{ opacity: 0.5, fontSize: "0.9em" }}>
                    {user.email}
                  </Text.Table.Cell>
                </Frame>
                <Frame flex={1}>
                  <Text.Table.Cell>{user.role}</Text.Table.Cell>
                </Frame>
                <Frame flex={1}>
                  <Frame
                    style={{
                      display: "inline-flex",
                      fontSize: "11px",
                      color:
                        user.status === "Active"
                          ? "var(--text-primary)"
                          : "var(--text-muted)",
                    }}
                    override={{
                      py: Space.n2,
                      px: Space.n8,
                      r: Radius2.full,
                      border: true,
                    }}
                    surface={user.status === "Active" ? "sunken" : undefined}
                  >
                    {user.status}
                  </Frame>
                </Frame>
                <Frame flex={1} override={{ align: "end" }}>
                  <Text.Table.Cell
                    style={{
                      opacity: 0.5,
                      fontFamily: "var(--font-family-mono)",
                    }}
                  >
                    {user.date}
                  </Text.Table.Cell>
                </Frame>
              </Frame>
            ))}
          </Frame>
        </ShowcaseSection>

        {/* Section 5: Menu Context */}
        <ShowcaseSection
          title="Context: Menu"
          description="Navigation lists and action groups."
          code={`<Frame override={{ w: "200px", shadow: "lg" }}  surface="overlay" >
  <Text.Menu.Group>Account</Text.Menu.Group>
  <Text.Menu.Item>Profile</Text.Menu.Item>
  <Text.Menu.Item>Settings</Text.Menu.Item>
</Frame>`}
        >
          <Frame
            layout={Layout.Row.Item.Default}
            override={{ gap: Space.n48, align: "start" }}
          >
            {/* Sidebar Menu Style */}
            <Frame
              style={
                {
                  height: "400px",
                } as React.CSSProperties
              }
              override={{
                w: Size.n448,
                gap: Space.n4,
                border: true,
              }}
              surface="sunken"
            >
              <Text.Menu.Group>Platform</Text.Menu.Group>
              <MenuItem active>Dashboard</MenuItem>
              <MenuItem>Analytics</MenuItem>
              <MenuItem>Projects</MenuItem>

              <Frame override={{ h: Size.n4 }} />

              <Text.Menu.Group>Settings</Text.Menu.Group>
              <MenuItem>Team</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuItem>API Keys</MenuItem>
            </Frame>

            {/* Context Menu Style */}
            <Frame
              override={{
                w: Size.n448,
                p: Space.n4,
                gap: Space.n4,
                shadow: "lg",
                r: Radius2.xl,
                border: true,
              }}
              surface="raised"
            >
              <MenuItem>View Details</MenuItem>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Duplicate</MenuItem>
              <Frame
                style={
                  {
                    marginBlock: Space.n1,
                    height: "1px",
                  } as React.CSSProperties
                }
                override={{}}
                surface="base"
              />
              <MenuItem style={{ color: "var(--text-muted)" }}>
                Archive
              </MenuItem>
              <MenuItem style={{ color: "#ef4444" }}>Delete</MenuItem>
            </Frame>
          </Frame>
        </ShowcaseSection>
      </Frame>
    </Experience>
  );
}

// --- Components ---

function ExperienceButton({ active, onClick, icon: IconSrc, label }: any) {
  return (
    <Frame
      override={{
        r: Radius2.full,
        py: Space.n8,
        px: Space.n16,
        gap: Space.n8,
        align: "center",
      }}
      style={{
        color: active ? "var(--primary-fg)" : "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={onClick}
      surface={active ? "primary" : "hover"}
      layout={Layout.Row.Item.Tight}
    >
      <Icon src={IconSrc} size={IconSize.n14} />
      <Text.Menu.Item>{label}</Text.Menu.Item>
    </Frame>
  );
}

function ShowcaseSection({ title, description, code, children }: any) {
  return (
    <Frame
      style={
        {
          scrollSnapAlign: "start",
          flexShrink: 0,
        } as React.CSSProperties
      }
      override={{ w: Size.fill, minHeight: Size.screen }}
      layout={Layout.Row.AppContainer.Default}
      clip
    >
      {/* Left: Code & Context */}
      <Frame
        style={{ width: "35%" } as React.CSSProperties}
        surface="sunken"
        override={{ p: Space.n24, justify: "center", border: true }}
      >
        <Frame override={{ gap: Space.n16 }}>
          <Text.Prose.Title style={{ fontSize: FontSize.n36 }}>
            {title}
          </Text.Prose.Title>
          <Text.Prose.Body style={{ opacity: 0.7 }}>
            {description}
          </Text.Prose.Body>
        </Frame>

        <Frame
          style={
            {
              fontFamily: "var(--font-family-mono)",
              fontSize: FontSize.n13,
              lineHeight: "1.6",
            } as React.CSSProperties
          }
          scroll="x"
          override={{ p: Space.n24, r: Radius2.xl, border: true }}
          surface="base"
        >
          <pre style={{ margin: 0 }}>{code}</pre>
        </Frame>
      </Frame>

      {/* Right: Preview */}
      <Frame
        style={
          {
            background:
              "radial-gradient(circle at center, var(--surface-base) 0%, var(--surface-sunken) 100%)",
          } as React.CSSProperties
        }
        flex={1}
        surface="base"
        pack
      >
        {children}
      </Frame>
    </Frame>
  );
}

function MenuItem({ children, active, style, ...props }: any) {
  return (
    <Frame
      override={{
        py: Space.n8,
        px: Space.n12,
        r: Radius2.lg,
      }}
      surface={active ? "selected" : "hover"}
      cursor="pointer"
      {...props}
    >
      <Text.Menu.Item style={{ fontWeight: active ? 600 : 400, ...style }}>
        {children}
      </Text.Menu.Item>
    </Frame>
  );
}
