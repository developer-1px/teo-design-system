import { useState } from "react";
import { Frame } from "../design-system/Frame";
import { Experience, type ExperienceType } from "../design-system/Experience";
import { Action } from "../design-system/Action";
import { Monitor, FileText, Globe } from "lucide-react";
import { Prose } from "../design-system/text/Prose";
import { Card } from "../design-system/text/Card";
import { Field } from "../design-system/text/Field";
import { Table } from "../design-system/text/Table";
import { Menu } from "../design-system/text/Menu";

/* 
  Text System Showcase
  Demonstrates the 4-level hierarchy: Experience > Context > Slot > Variant
*/

export function TextSystemApp() {
    const [experience, setExperience] = useState<ExperienceType>("application");

    return (
        <Experience value={experience}>
            <Frame fill surface="base" style={{ scrollSnapType: "y mandatory", overflowY: "scroll" }}>

                {/* Floating Experience Switcher */}
                <Frame
                    position="fixed"
                    top={24}
                    style={{ left: "50%", transform: "translateX(-50%)" }}
                    zIndex={100}
                    surface="raised"
                    shadow="lg"
                    rounded="full"
                    p={1}
                    row
                    gap={1}
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

                {/* Section 1: Context: Prose */}
                <ShowcaseSection
                    title="Context: Prose"
                    description="Standard running text for documents and articles."
                    code={`<Prose.Title>Context: Prose</Prose.Title>
<Prose.Body>
  Optimized for readability and flow.
  Scales automatically with Experience.
</Prose.Body>`}
                >
                    <Frame gap={6} maxWidth="600px">
                        <Prose.Title>Context: Prose</Prose.Title>
                        <Prose.Body>
                            The <strong>Prose</strong> context is designed for continuous reading. It manages line height, spacing, and font weight to ensure comfortable legibility.
                        </Prose.Body>
                        <Prose.Body>
                            The <strong>Experience</strong> (Application, Landing, or Document) automatically adjusts the scale. For example, 'Landing' experience will render this text significantly larger than 'Application'.
                        </Prose.Body>
                        <Prose.Note>
                            Try switching the Experience mode at the top to see this text adapt live.
                        </Prose.Note>
                    </Frame>
                </ShowcaseSection>

                {/* Section 2: Card Context */}
                <ShowcaseSection
                    title="Context: Card"
                    description="Compact, summarized information blocks."
                    code={`<Frame surface="raised" p={6} rounded="xl" border>
  <Card.Title>Project Alpha</Card.Title>
  <Card.Desc>
    High-priority infrastructure migration.
  </Card.Desc>
  <Card.Note>Updated 2h ago</Card.Note>
</Frame>`}
                >
                    <Frame gap={8} row wrap="wrap" justify="center">
                        <Frame surface="raised" p={6} rounded="xl" gap={3} w="320px" shadow="sm" style={{ border: "1px solid var(--border-color)" }}>
                            <Frame w="40px" h="40px" rounded="lg" surface="sunken" align="center" justify="center" style={{ marginBottom: "var(--space-2)" }}>
                                <Globe size={20} />
                            </Frame>
                            <Card.Title>Project Alpha</Card.Title>
                            <Card.Desc>
                                High-priority infrastructure migration for the core payment gateway.
                            </Card.Desc>
                            <Frame row align="center" justify="between" style={{ marginTop: "var(--space-4)" }}>
                                <Card.Note style={{ opacity: 0.6 }}>Updated 2h ago</Card.Note>
                                <Action size="sm" variant="ghost" label="View" />
                            </Frame>
                        </Frame>

                        <Frame surface="raised" p={6} rounded="xl" gap={3} w="320px" shadow="sm" style={{ border: "1px solid var(--border-color)" }}>
                            <Frame w="40px" h="40px" rounded="lg" surface="sunken" align="center" justify="center" style={{ marginBottom: "var(--space-2)" }}>
                                <FileText size={20} />
                            </Frame>
                            <Card.Title>Q1 Report</Card.Title>
                            <Card.Desc>
                                Quarterly financial analysis and growth projections.
                            </Card.Desc>
                            <Frame row align="center" justify="between" style={{ marginTop: "var(--space-4)" }}>
                                <Card.Note style={{ opacity: 0.6 }}>Draft</Card.Note>
                                <Action size="sm" variant="ghost" label="Edit" />
                            </Frame>
                        </Frame>
                    </Frame>
                </ShowcaseSection>

                {/* Section 3: Field Context */}
                <ShowcaseSection
                    title="Context: Field"
                    description="Input labels, values, and hints optimized for forms."
                    code={`<Frame gap={1}>
  <Field.Label>Email Address</Field.Label>
  <Input placeholder="name@example.com" />
  <Field.Note>We'll never share your email.</Field.Note>
</Frame>`}
                >
                    <Frame surface="raised" p={8} rounded="2xl" gap={6} w="400px" shadow="md" style={{ border: "1px solid var(--border-color)" }}>
                        <Prose.Title style={{ fontSize: "var(--prose-h3-size)" }}>Account Settings</Prose.Title>

                        <Frame gap={4}>
                            <Frame gap={1.5}>
                                <Field.Label>Display Name</Field.Label>
                                <Frame h="32px" surface="sunken" rounded="md" align="center" style={{ paddingLeft: "var(--space-3)", paddingRight: "var(--space-3)", border: "1px solid var(--border-color)" }}>
                                    <Field.Value style={{ opacity: 0.5 }}>Jane Doe</Field.Value>
                                </Frame>
                            </Frame>

                            <Frame gap={1.5}>
                                <Field.Label>Email Address</Field.Label>
                                <Frame h="32px" surface="sunken" rounded="md" align="center" style={{ paddingLeft: "var(--space-3)", paddingRight: "var(--space-3)", border: "1px solid var(--border-color)" }}>
                                    <Field.Value style={{ opacity: 0.5 }}>name@example.com</Field.Value>
                                </Frame>
                                <Field.Note>Used for notifications and login.</Field.Note>
                            </Frame>

                            <Frame gap={1.5}>
                                <Field.Label>Bio</Field.Label>
                                <Frame h="80px" surface="sunken" rounded="md" p={3} style={{ border: "1px solid var(--border-color)" }}>
                                    <Field.Value style={{ opacity: 0.5 }}>Product Designer based in Seoul.</Field.Value>
                                </Frame>
                            </Frame>
                        </Frame>

                        <Frame row justify="end" gap={3} style={{ marginTop: "var(--space-4)" }}>
                            <Action variant="ghost" label="Cancel" />
                            <Action variant="primary" label="Save Changes" />
                        </Frame>
                    </Frame>
                </ShowcaseSection>

                {/* Section 4: Table Context */}
                <ShowcaseSection
                    title="Context: Table"
                    description="Tabular data with clear hierarchy between heads and cells."
                    code={`<Frame row border="bottom" p={3}>
  <Table.Head>Name</Table.Head>
  <Table.Head>Role</Table.Head>
</Frame>
<Frame row border="bottom" p={3}>
  <Table.Cell>Alice</Table.Cell>
  <Table.Cell>Admin</Table.Cell>
</Frame>`}
                >
                    <Frame surface="raised" rounded="xl" w="100%" maxWidth="800px" overflow="hidden" shadow="sm" style={{ border: "1px solid var(--border-color)" }}>
                        <Frame row surface="sunken" p="3 4" style={{ borderBottom: "1px solid var(--border-color)" }}>
                            <Frame flex={2}><Table.Head>User</Table.Head></Frame>
                            <Frame flex={1}><Table.Head>Role</Table.Head></Frame>
                            <Frame flex={1}><Table.Head>Status</Table.Head></Frame>
                            <Frame flex={1} align="end"><Table.Head>Activity</Table.Head></Frame>
                        </Frame>
                        {[
                            { name: "Alice Johnson", email: "alice@company.com", role: "Admin", status: "Active", date: "2h ago" },
                            { name: "Bob Smith", email: "bob@company.com", role: "Editor", status: "Offline", date: "1d ago" },
                            { name: "Charlie Kim", email: "charlie@company.com", role: "Viewer", status: "Active", date: "5m ago" },
                            { name: "David Park", email: "david@company.com", role: "Viewer", status: "Inactive", date: "1w ago" },
                        ].map((user, i) => (
                            <Frame key={i} row p="3 4" align="center" surface="hover" style={{ borderBottom: "1px solid var(--border-color)" }}>
                                <Frame flex={2} gap={0.5}>
                                    <Table.Cell style={{ fontWeight: 500 }}>{user.name}</Table.Cell>
                                    <Table.Cell style={{ opacity: 0.5, fontSize: "0.9em" }}>{user.email}</Table.Cell>
                                </Frame>
                                <Frame flex={1}><Table.Cell>{user.role}</Table.Cell></Frame>
                                <Frame flex={1}>
                                    <Frame
                                        p="0.5 2" rounded="full"
                                        surface={user.status === "Active" ? "sunken" : undefined}
                                        style={{
                                            display: "inline-flex",
                                            border: "1px solid var(--border-color)",
                                            fontSize: "11px",
                                            color: user.status === "Active" ? "var(--text-primary)" : "var(--text-muted)"
                                        }}
                                    >
                                        {user.status}
                                    </Frame>
                                </Frame>
                                <Frame flex={1} align="end"><Table.Cell style={{ opacity: 0.5, fontFamily: "var(--font-family-mono)" }}>{user.date}</Table.Cell></Frame>
                            </Frame>
                        ))}
                    </Frame>
                </ShowcaseSection>

                {/* Section 5: Menu Context */}
                <ShowcaseSection
                    title="Context: Menu"
                    description="Navigation lists and action groups."
                    code={`<Frame w="200px" surface="overlay" shadow="lg">
  <Menu.Group>Account</Menu.Group>
  <Menu.Item>Profile</Menu.Item>
  <Menu.Item>Settings</Menu.Item>
</Frame>`}
                >
                    <Frame row gap={12} align="start">
                        {/* Sidebar Menu Style */}
                        <Frame w="240px" surface="sunken" h="400px" rounded="2xl" p={4} gap={2} style={{ border: "1px solid var(--border-color)" }}>
                            <Menu.Group>Platform</Menu.Group>
                            <MenuItem active>Dashboard</MenuItem>
                            <MenuItem>Analytics</MenuItem>
                            <MenuItem>Projects</MenuItem>

                            <Frame h={4} />

                            <Menu.Group>Settings</Menu.Group>
                            <MenuItem>Team</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuItem>API Keys</MenuItem>
                        </Frame>

                        {/* Context Menu Style */}
                        <Frame w="220px" surface="raised" rounded="xl" p={1} shadow="lg" style={{ border: "1px solid var(--border-color)" }}>
                            <MenuItem>View Details</MenuItem>
                            <MenuItem>Edit</MenuItem>
                            <MenuItem>Duplicate</MenuItem>
                            <Frame h="1px" surface="base" style={{ marginBlock: "var(--space-1)" }} />
                            <MenuItem style={{ color: "var(--text-muted)" }}>Archive</MenuItem>
                            <MenuItem style={{ color: "#ef4444" }}>Delete</MenuItem>
                        </Frame>
                    </Frame>
                </ShowcaseSection>

            </Frame>
        </Experience>
    );
}

// --- Components ---

function ExperienceButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <Frame
            onClick={onClick}
            surface={active ? "primary" : "hover"}
            style={{
                color: active ? "var(--primary-fg)" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.2s"
            }}
            p="2 4"
            rounded="full"
            row
            gap={2}
            align="center"
        >
            <Icon size={14} />
            <Menu.Item>{label}</Menu.Item>
        </Frame>
    )
}

function ShowcaseSection({ title, description, code, children }: any) {
    return (
        <Frame
            w="100%"
            h="100vh"
            style={{ scrollSnapAlign: "start" }}
            row
            overflow="hidden"
        >
            {/* Left: Code & Context */}
            <Frame
                w="35%"
                surface="sunken"
                p={10}
                justify="center"
                gap={8}
                style={{ borderRight: "1px solid var(--border-color)" }}
            >
                <Frame gap={4}>
                    <Prose.Title style={{ fontSize: "32px" }}>{title}</Prose.Title>
                    <Prose.Body style={{ opacity: 0.7 }}>{description}</Prose.Body>
                </Frame>

                <Frame
                    surface="base"
                    p={6}
                    rounded="xl"
                    style={{ border: "1px solid var(--border-color)", fontFamily: "var(--font-family-mono)", fontSize: "13px", lineHeight: "1.6", overflowX: "auto" }}
                    shadow="sm"
                >
                    <pre style={{ margin: 0 }}>{code}</pre>
                </Frame>
            </Frame>

            {/* Right: Preview */}
            <Frame
                flex={1}
                align="center"
                justify="center"
                surface="base"
                style={{
                    background: "radial-gradient(circle at center, var(--surface-base) 0%, var(--surface-sunken) 100%)"
                }}
            >
                {children}
            </Frame>
        </Frame>
    )
}

function MenuItem({ children, active, style, ...props }: any) {
    return (
        <Frame
            p="2 3"
            rounded="lg"
            surface={active ? "selected" : "hover"}
            cursor="pointer"
            {...props}
        >
            <Menu.Item style={{ fontWeight: active ? 600 : 400, ...style }}>{children}</Menu.Item>
        </Frame>
    )
}
