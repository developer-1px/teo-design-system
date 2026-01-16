/**
 * Discord Mock App Type Definitions
 */

export type ChannelType = "text" | "voice";

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  category?: string;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
}

export interface Message {
  id: string;
  channelId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    status: "online" | "idle" | "dnd" | "offline";
  };
  content: string;
  timestamp: Date;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  role?: string;
}
