/**
 * Agent Editor App
 * Replit Agent-style code editor interface
 * Tests: selected prop, auto-ghost surface, unified keyboard system
 */

import { useState } from "react";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Text } from "../design-system/text/Text.tsx";
import {
  FontSize,
  Size,
  Space,
} from "../design-system/token/token.const.1tier.ts";
import { ChatPanel } from "./agent-editor/ChatPanel.tsx";
import { CodePanel } from "./agent-editor/CodePanel.tsx";
import { HistoryPanel } from "./agent-editor/HistoryPanel.tsx";

// --- Types ---
export type HistoryItem = {
  id: string;
  title: string;
  timestamp: Date;
  status: "completed" | "active" | "pending";
  filesChanged: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
};

export type CodeChange = {
  file: string;
  language: string;
  before: string;
  after: string;
};

// --- Mock Data ---
const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "1",
    title: "Fix authentication bug",
    timestamp: new Date(Date.now() - 3600000),
    status: "completed",
    filesChanged: 3,
  },
  {
    id: "2",
    title: "Add user API endpoints",
    timestamp: new Date(Date.now() - 1800000),
    status: "completed",
    filesChanged: 5,
  },
  {
    id: "3",
    title: "Refactor database queries",
    timestamp: new Date(Date.now() - 300000),
    status: "active",
    filesChanged: 2,
  },
  {
    id: "4",
    title: "Update dependencies",
    timestamp: new Date(),
    status: "pending",
    filesChanged: 1,
  },
];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Fix the authentication bug in the login component",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    role: "agent",
    content:
      "I'll analyze the login component and fix the authentication issue. Let me check the current implementation...",
    timestamp: new Date(Date.now() - 3590000),
  },
  {
    id: "3",
    role: "agent",
    content:
      "Found the issue! The token validation was missing. I've updated the auth middleware to properly validate JWT tokens.",
    timestamp: new Date(Date.now() - 3580000),
  },
  {
    id: "4",
    role: "user",
    content: "Great! Can you also add unit tests for this?",
    timestamp: new Date(Date.now() - 3570000),
  },
];

const MOCK_CODE: CodeChange = {
  file: "src/middleware/auth.ts",
  language: "typescript",
  before: `export function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  // TODO: Add validation
  next();
}`,
  after: `import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}`,
};

export function AgentEditorApp() {
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("3");

  return (
    <Frame
      layout={Layout.Col.Stretch.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      surface="base" override={{ p: Space.n8 }}
    >
      {/* Header */}
      <Frame
        override={{
          h: Size.n56,
          px: Space.n16,
          row: true,
          align: "center",
          gap: Space.n12,
          borderBottom: true,
        }}
        surface="raised"
      >
        <Text size={FontSize.n16} weight="medium">
          Agent Editor
        </Text>
        <Frame override={{ flex: 1 }} />
        <Text variant="caption" style={{ color: "var(--text-subtle)" }}>
          Press <strong>Cmd+K</strong> to search
        </Text>
      </Frame>

      {/* 3-Panel Layout */}
      <Frame
        override={{
          flex: 1,
          row: true,
          gap: Space.n0,
          minHeight: Size.n0,
        }}
      >
        {/* Left: History Panel */}
        <Frame
          override={{
            w: Size.n240,
            borderRight: true,
          }}
          surface="panel"
        >
          <HistoryPanel
            items={MOCK_HISTORY}
            selectedId={selectedHistoryId}
            onSelect={setSelectedHistoryId}
          />
        </Frame>

        {/* Center: Chat Panel */}
        <Frame override={{ flex: 1, minWidth: Size.n0 }}>
          <ChatPanel messages={MOCK_MESSAGES} />
        </Frame>

        {/* Right: Code Panel */}
        <Frame
          override={{
            w: Size.n320,
            borderLeft: true,
          }}
          surface="panel"
        >
          <CodePanel change={MOCK_CODE} />
        </Frame>
      </Frame>
    </Frame>
  );
}
