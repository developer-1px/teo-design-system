// Dataset types
export interface DatasetMeta {
  name: string;
  label: string;
  icon: string;
  path: string;
}

// Deal types
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
  value: number;
  owner: string;
  closeDate: string;
  avatarColor: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  revenue: number;
  website: string;
  founded: string;
  location: string;
}

// Person types
export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatarColor: string;
}

// Project types
export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  team: string;
  startDate: string;
  deadline: string;
  budget: number;
}

// Task types
export type TaskStatus = "Todo" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  project: string;
}

// Generic data row type for dynamic tables
export type DataRow = Deal | Company | Person | Project | Task;

// Type guard functions
export function isDeal(data: DataRow): data is Deal {
  return "stage" in data && "value" in data && "closeDate" in data;
}

export function isCompany(data: DataRow): data is Company {
  return "industry" in data && "employees" in data && "revenue" in data;
}

export function isPerson(data: DataRow): data is Person {
  return "email" in data && "phone" in data && "role" in data;
}

export function isProject(data: DataRow): data is Project {
  return "progress" in data && "team" in data && "deadline" in data;
}

export function isTask(data: DataRow): data is Task {
  return "assignee" in data && "priority" in data && "project" in data;
}
