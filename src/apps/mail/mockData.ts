/**
 * Mock Mail Data
 */

import type {Mail, MailThread} from "./types"

const mockMails: Mail[] = [
  {
    id: "m1",
    threadId: "t1",
    from: {
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
    },
    to: ["me@example.com"],
    subject: "Q4 Design System Review",
    snippet:
      "Hi team, I've reviewed the latest design system updates and have some feedback...",
    body: `Hi team,

I've reviewed the latest design system updates and have some feedback on the token structure. The new Layout presets are working great, but I think we should discuss the spacing scale.

Can we schedule a meeting this week?

Best,
Sarah`,
    date: new Date("2024-01-15T09:30:00"),
    isRead: false,
    isStarred: true,
    labels: ["work", "important"],
    folder: "inbox",
    hasAttachments: true,
    attachmentCount: 2,
  },
  {
    id: "m2",
    threadId: "t2",
    from: {
      name: "GitHub",
      email: "noreply@github.com",
    },
    to: ["me@example.com"],
    subject: "[developer-1px/teo-design-system] Pull Request #18",
    snippet:
      "feat: implement CRM app with Tanstack Table and MDK design system...",
    body: `Pull Request #18 has been created

feat: implement CRM app with Tanstack Table and MDK design system

Review the changes at: https://github.com/developer-1px/teo-design-system/pull/18`,
    date: new Date("2024-01-15T08:45:00"),
    isRead: false,
    isStarred: false,
    labels: ["work"],
    folder: "inbox",
    hasAttachments: false,
  },
  {
    id: "m3",
    threadId: "t3",
    from: {
      name: "Design Team",
      email: "design@company.com",
    },
    to: ["me@example.com", "team@company.com"],
    cc: ["manager@company.com"],
    subject: "Weekly Design Sync - Jan 15",
    snippet: "Agenda: 1. MDK Updates, 2. Mail Client Demo, 3. Q&A...",
    body: `Hi everyone,

Here's the agenda for today's sync:
1. MDK Design System Updates
2. Mail Client Demo
3. Component Library Status
4. Q&A

Join: meet.google.com/abc-defg-hij

See you soon!`,
    date: new Date("2024-01-15T07:00:00"),
    isRead: true,
    isStarred: false,
    labels: ["work"],
    folder: "inbox",
    hasAttachments: false,
  },
  {
    id: "m4",
    threadId: "t4",
    from: {
      name: "Newsletter",
      email: "newsletter@designsystems.com",
    },
    to: ["me@example.com"],
    subject: "Design Systems Weekly - Issue #247",
    snippet:
      "This week: New component patterns, accessibility best practices, and more...",
    body: `Design Systems Weekly - Issue #247

📚 This week's highlights:
- New component composition patterns
- Accessibility in design systems
- Token naming conventions
- Case study: Airbnb's design system

Read more: designsystems.com/weekly/247`,
    date: new Date("2024-01-14T18:00:00"),
    isRead: true,
    isStarred: false,
    labels: ["social"],
    folder: "inbox",
    hasAttachments: false,
  },
  {
    id: "m5",
    threadId: "t5",
    from: {
      name: "Alex Kim",
      email: "alex.kim@company.com",
    },
    to: ["me@example.com"],
    subject: "Re: MDK Layout System",
    snippet:
      "Thanks for the explanation! The 3-tier intent system makes so much sense now...",
    body: `Thanks for the explanation!

The 3-tier intent system makes so much sense now. I can see how it helps maintain consistency across components.

I'll update the documentation accordingly.

Alex`,
    date: new Date("2024-01-14T16:30:00"),
    isRead: true,
    isStarred: false,
    labels: ["work"],
    folder: "sent",
    hasAttachments: false,
  },
  {
    id: "m6",
    threadId: "t6",
    from: {
      name: "Me",
      email: "me@example.com",
    },
    to: ["draft@"],
    subject: "Draft: Component API Proposal",
    snippet:
      "I've been thinking about how we can improve the Table component API...",
    body: `I've been thinking about how we can improve the Table component API...

[Draft in progress]`,
    date: new Date("2024-01-14T14:00:00"),
    isRead: true,
    isStarred: false,
    labels: ["work"],
    folder: "drafts",
    hasAttachments: false,
  },
];

// Group mails into threads
export const mockThreads: MailThread[] = [
  {
    id: "t1",
    subject: "Q4 Design System Review",
    mails: [mockMails[0]],
    lastMailDate: mockMails[0].date,
    participants: ["Sarah Chen"],
    isRead: false,
    isStarred: true,
    labels: ["work", "important"],
    messageCount: 1,
  },
  {
    id: "t2",
    subject: "[developer-1px/teo-design-system] Pull Request #18",
    mails: [mockMails[1]],
    lastMailDate: mockMails[1].date,
    participants: ["GitHub"],
    isRead: false,
    isStarred: false,
    labels: ["work"],
    messageCount: 1,
  },
  {
    id: "t3",
    subject: "Weekly Design Sync - Jan 15",
    mails: [mockMails[2]],
    lastMailDate: mockMails[2].date,
    participants: ["Design Team"],
    isRead: true,
    isStarred: false,
    labels: ["work"],
    messageCount: 1,
  },
  {
    id: "t4",
    subject: "Design Systems Weekly - Issue #247",
    mails: [mockMails[3]],
    lastMailDate: mockMails[3].date,
    participants: ["Newsletter"],
    isRead: true,
    isStarred: false,
    labels: ["social"],
    messageCount: 1,
  },
];
