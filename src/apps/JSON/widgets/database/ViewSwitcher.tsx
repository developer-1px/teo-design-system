/**
 * ViewSwitcher - Notion 스타일 뷰 전환 UI
 */

import { Kanban, LayoutGrid, List as ListIcon, Table } from 'lucide-react';
// ViewType might be needed? Check usage. Original imported ViewConfig, ViewType
import type { ViewConfig, ViewType } from '@/apps/JSON/widgets/database/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/dsl/Block/role/Tabs.tsx';

interface ViewSwitcherProps {
  views: ViewConfig[];
  activeView: string;
  onViewChange: (viewId: string) => void;
}

const VIEW_ICONS: Record<ViewType, React.ComponentType<{ size?: number }>> = {
  table: Table,
  board: Kanban,
  gallery: LayoutGrid,
  list: ListIcon,
  calendar: Table, // TODO: Calendar icon
  timeline: Table, // TODO: Timeline icon
};

export const ViewSwitcher = ({ views, activeView, onViewChange }: ViewSwitcherProps) => {
  return (
    <Tabs value={activeView} onValueChange={onViewChange}>
      <TabsList density="Compact">
        {views.map((view) => {
          const Icon = VIEW_ICONS[view.type];
          return (
            <TabsTrigger key={view.id} value={view.id}>
              <Icon size={16} />
              {view.name}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};
