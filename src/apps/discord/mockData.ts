/**
 * Discord Mock App Data
 */

import type { Member, Message, Server } from "./types";

export const mockServers: Server[] = [
  {
    id: "1",
    name: "MDK Design System",
    icon: "🎨",
    channels: [
      { id: "1-1", name: "general", type: "text", category: "TEXT CHANNELS" },
      {
        id: "1-2",
        name: "announcements",
        type: "text",
        category: "TEXT CHANNELS",
      },
      {
        id: "1-3",
        name: "design-discussion",
        type: "text",
        category: "TEXT CHANNELS",
      },
      {
        id: "1-4",
        name: "code-review",
        type: "text",
        category: "TEXT CHANNELS",
      },
      {
        id: "1-5",
        name: "General Voice",
        type: "voice",
        category: "VOICE CHANNELS",
      },
      {
        id: "1-6",
        name: "Design Sync",
        type: "voice",
        category: "VOICE CHANNELS",
      },
    ],
  },
  {
    id: "2",
    name: "React Community",
    icon: "⚛️",
    channels: [
      { id: "2-1", name: "general", type: "text", category: "TEXT CHANNELS" },
      { id: "2-2", name: "help", type: "text", category: "TEXT CHANNELS" },
      { id: "2-3", name: "showcase", type: "text", category: "TEXT CHANNELS" },
      {
        id: "2-4",
        name: "Voice Chat",
        type: "voice",
        category: "VOICE CHANNELS",
      },
    ],
  },
  {
    id: "3",
    name: "TypeScript Guild",
    icon: "📘",
    channels: [
      { id: "3-1", name: "general", type: "text", category: "TEXT CHANNELS" },
      {
        id: "3-2",
        name: "type-challenges",
        type: "text",
        category: "TEXT CHANNELS",
      },
      {
        id: "3-3",
        name: "Coding Session",
        type: "voice",
        category: "VOICE CHANNELS",
      },
    ],
  },
];

export const mockMessages: Record<string, Message[]> = {
  "1-1": [
    {
      id: "msg-1",
      channelId: "1-1",
      author: {
        id: "user-1",
        name: "Alice",
        avatar: "👩‍💻",
        status: "online",
      },
      content:
        "Hey everyone! Just finished implementing the new Layout presets 🎉",
      timestamp: new Date("2026-01-16T10:30:00"),
    },
    {
      id: "msg-2",
      channelId: "1-1",
      author: {
        id: "user-2",
        name: "Bob",
        avatar: "👨‍🎨",
        status: "online",
      },
      content: "Awesome work! The Layout.Stack.Content pattern is really clean",
      timestamp: new Date("2026-01-16T10:32:00"),
    },
    {
      id: "msg-3",
      channelId: "1-1",
      author: {
        id: "user-3",
        name: "Charlie",
        avatar: "🧑‍💼",
        status: "idle",
      },
      content: "I love how the 3-Tier Intent System makes the API so intuitive",
      timestamp: new Date("2026-01-16T10:35:00"),
    },
    {
      id: "msg-4",
      channelId: "1-1",
      author: {
        id: "user-1",
        name: "Alice",
        avatar: "👩‍💻",
        status: "online",
      },
      content: "Thanks! Should we update the documentation next?",
      timestamp: new Date("2026-01-16T10:40:00"),
    },
  ],
  "1-3": [
    {
      id: "msg-5",
      channelId: "1-3",
      author: {
        id: "user-2",
        name: "Bob",
        avatar: "👨‍🎨",
        status: "online",
      },
      content: "What are your thoughts on the new surface token system?",
      timestamp: new Date("2026-01-16T09:00:00"),
    },
    {
      id: "msg-6",
      channelId: "1-3",
      author: {
        id: "user-4",
        name: "Diana",
        avatar: "👩‍🔬",
        status: "online",
      },
      content: "I think raised/sunken/overlay provides great semantic clarity",
      timestamp: new Date("2026-01-16T09:15:00"),
    },
  ],
  "2-1": [
    {
      id: "msg-7",
      channelId: "2-1",
      author: {
        id: "user-5",
        name: "Eve",
        avatar: "🧑‍🚀",
        status: "online",
      },
      content: "React 19 is amazing! Loving the new features",
      timestamp: new Date("2026-01-16T11:00:00"),
    },
  ],
};

export const mockMembers: Member[] = [
  {
    id: "user-1",
    name: "Alice",
    avatar: "👩‍💻",
    status: "online",
    role: "Admin",
  },
  {
    id: "user-2",
    name: "Bob",
    avatar: "👨‍🎨",
    status: "online",
    role: "Designer",
  },
  {
    id: "user-3",
    name: "Charlie",
    avatar: "🧑‍💼",
    status: "idle",
    role: "Developer",
  },
  {
    id: "user-4",
    name: "Diana",
    avatar: "👩‍🔬",
    status: "online",
    role: "Developer",
  },
  {
    id: "user-5",
    name: "Eve",
    avatar: "🧑‍🚀",
    status: "dnd",
    role: "Member",
  },
  {
    id: "user-6",
    name: "Frank",
    avatar: "👨‍🏫",
    status: "offline",
    role: "Member",
  },
];

export function getChannelMessages(channelId: string): Message[] {
  return mockMessages[channelId] || [];
}

export function getServerById(serverId: string): Server | undefined {
  return mockServers.find((s) => s.id === serverId);
}

export function getChannelById(
  serverId: string,
  channelId: string,
): { server: Server; channel: Server["channels"][0] } | null {
  const server = getServerById(serverId);
  if (!server) return null;

  const channel = server.channels.find((c) => c.id === channelId);
  if (!channel) return null;

  return { server, channel };
}
