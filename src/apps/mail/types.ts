/**
 * Mail Client Types
 */

export type MailFolder =
  | "inbox"
  | "starred"
  | "sent"
  | "drafts"
  | "trash"
  | "spam"
  | "archive";

export interface Mail {
  id: string;
  threadId: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  snippet: string; // Preview text
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  folder: MailFolder;
  hasAttachments: boolean;
  attachmentCount?: number;
}

export interface MailThread {
  id: string;
  subject: string;
  mails: Mail[];
  lastMailDate: Date;
  participants: string[];
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  messageCount: number;
}
