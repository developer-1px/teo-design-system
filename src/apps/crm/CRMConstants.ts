export type DealStage =
  | "Lead"
  | "Qualified"
  | "Proposal"
  | "Negotiation"
  | "Closed";

export interface Deal {
  id: string;
  name: string;
  company: string;
  stage: DealStage;
  value: string;
  owner: string;
  closeDate: string;
  avatarColor: string;
}

export const DEALS: Deal[] = [
  {
    id: "1",
    name: "Enterprise License",
    company: "Acme Corp",
    stage: "Negotiation",
    value: "$120,000",
    owner: "Sarah A.",
    closeDate: "Oct 24, 2024",
    avatarColor: "#E11D48",
  },
  {
    id: "2",
    name: "Q4 Expansion",
    company: "Linear Orbit",
    stage: "Qualified",
    value: "$45,000",
    owner: "Mike R.",
    closeDate: "Nov 12, 2024",
    avatarColor: "#2563EB",
  },
  {
    id: "3",
    name: "Startup Plan",
    company: "Vercel",
    stage: "Proposal",
    value: "$12,000",
    owner: "John D.",
    closeDate: "Oct 30, 2024",
    avatarColor: "#000000",
  },
  {
    id: "4",
    name: "Global Rollout",
    company: "Stripe",
    stage: "Lead",
    value: "$250,000",
    owner: "Sarah A.",
    closeDate: "Dec 15, 2024",
    avatarColor: "#6366F1",
  },
  {
    id: "5",
    name: "Security Add-on",
    company: "Raycast",
    stage: "Closed",
    value: "$8,500",
    owner: "Mike R.",
    closeDate: "Sep 28, 2024",
    avatarColor: "#DC2626",
  },
  {
    id: "6",
    name: "Design Systems",
    company: "Figma",
    stage: "Negotiation",
    value: "$85,000",
    owner: "John D.",
    closeDate: "Nov 01, 2024",
    avatarColor: "#10B981",
  },
];
