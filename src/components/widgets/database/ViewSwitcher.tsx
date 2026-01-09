/**
 * ViewSwitcher - Notion 스타일 뷰 전환 UI
 */

import { Tabs, TabsList, TabsTrigger } from '@/components/Group/role/Tabs';
import { Table, LayoutGrid, List as ListIcon, Kanban } from 'lucide-react';
import type { ViewType, ViewConfig } from '@/components/utils/types';

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
      <TabsList>
        {views.map((view) => {
          const Icon = VIEW_ICONS[view.type];
          return (
            <TabsTrigger key={view.id} value={view.id} className="gap-2">
              <Icon size={16} />
              {view.name}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};
