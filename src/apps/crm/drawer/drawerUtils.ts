import {Calendar, Globe, Hash, Mail, User} from "lucide-react"
import type {DataRow} from "../types"
import {formatForDrawer} from "./nestedValueFormatter"

// Icon mapping for common field types
const FIELD_ICON_MAP: Record<string, React.ElementType> = {
  company: Globe,
  companies: Globe,
  email: Mail,
  phone: Mail,
  owner: User,
  assignee: User,
  date: Calendar,
  closeDate: Calendar,
  dueDate: Calendar,
  startDate: Calendar,
  deadline: Calendar,
  value: Hash,
  revenue: Hash,
  budget: Hash,
  progress: Hash,
  employees: User,
};

export function getFieldIcon(key: string): React.ElementType {
  const lowerKey = key.toLowerCase();
  return FIELD_ICON_MAP[lowerKey] || Hash;
}

export function formatValue(value: unknown): string {
  return formatForDrawer(value, {
    maxDepth: 1, // Drawer: show one level of nesting
    maxArrayItems: 3, // Show up to 3 items in arrays
    maxStringLength: 100, // Longer strings allowed in drawer
    arrayOfObjectsStrategy: "summary", // Array of objects: show summary
  });
}

export function getDisplayTitle(data: DataRow): string {
  const titleFields = ["name", "title", "company", "id"];

  for (const field of titleFields) {
    if (field in data && data[field as keyof DataRow]) {
      return String(data[field as keyof DataRow]);
    }
  }

  return "Detail View";
}

export function getAvatarColor(data: DataRow): string {
  if ("avatarColor" in data && typeof data.avatarColor === "string") {
    return data.avatarColor;
  }
  const title = getDisplayTitle(data);
  const colors = [
    "#E11D48",
    "#2563EB",
    "#7C3AED",
    "#059669",
    "#DC2626",
    "#0891B2",
  ];
  const index = title.charCodeAt(0) % colors.length;
  return colors[index];
}
