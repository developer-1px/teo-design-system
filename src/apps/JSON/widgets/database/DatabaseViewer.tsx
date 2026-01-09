/**
 * DatabaseViewer - Notion Database 스타일 메인 컨테이너
 *
 * 다양한 뷰로 JSON 데이터를 표시
 */

import { useMemo, useState } from 'react';
import { Group } from '@/components/types/Group/Group.tsx';
import { Divider } from '@/components/types/Group/role/Divider.tsx';
import { Action } from '@/components/types/Atom/Action/Action.tsx';
import { Badge } from '@/components/types/Atom/Text/role/Badge.tsx';
import { Text } from '@/components/types/Atom/Text/Text.tsx';
import type { DatabaseConfig, JsonArray } from '@/components/types/Atom/types.ts';
import { Page } from '@/components/types/Page/Page.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { ViewSwitcher } from './ViewSwitcher.tsx';
import { BoardView } from './views/BoardView.tsx';
import { GalleryView } from './views/GalleryView.tsx';
import { ListView } from './views/ListView.tsx';
import { TableView } from './views/TableView.tsx';

interface DatabaseViewerProps {
  data: JsonArray;
  views?: DatabaseConfig['views'];
  defaultView?: string;
  title?: string;
  description?: string;
  showStats?: boolean;
}

export const DatabaseViewer = ({
  data,
  views: customViews,
  defaultView,
  title,
  description,
  showStats = true,
}: DatabaseViewerProps) => {
  const [density, setDensity] = useState<'compact' | 'normal'>('compact');

  // 기본 뷰 설정
  const views = useMemo(() => {
    if (customViews && customViews.length > 0) {
      return customViews;
    }

    // 자동으로 생성된 기본 뷰들
    return [
      { id: 'table', type: 'table' as const, name: 'Table' },
      { id: 'board', type: 'board' as const, name: 'Board', group: { by: 'status' } },
      { id: 'gallery', type: 'gallery' as const, name: 'Gallery', cardSize: 'md' as const },
      { id: 'list', type: 'list' as const, name: 'List' },
    ];
  }, [customViews]);

  const [activeViewId, setActiveViewId] = useState(defaultView || views[0]?.id || 'table');

  const activeView = views.find((v) => v.id === activeViewId) || views[0];

  // 통계
  const stats = useMemo(() => {
    if (data.length === 0) return { rows: 0, cols: 0 };

    const firstItem = data[0];
    const cols =
      typeof firstItem === 'object' && firstItem !== null ? Object.keys(firstItem).length : 0;

    return { rows: data.length, cols };
  }, [data]);

  return (
    <Page>
      <Section role="Container" className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <Section className="border-b border-default bg-surface">
          <Group role="Container" className="px-6 py-4 gap-2">
            {title && (
              <Text role="Title" prominence="Hero" className="text-2xl font-bold" content={title} />
            )}
            {description && <Text role="Body" className="text-muted" content={description} />}
          </Group>

          {/* Controls */}
          <Group
            role="Toolbar"
            direction="horizontal"
            className="px-6 py-3 border-t border-default justify-between"
          >
            <Group role="navigation" direction="horizontal" className="items-center gap-4">
              <ViewSwitcher
                views={views}
                activeView={activeViewId}
                onViewChange={setActiveViewId}
              />

              {showStats && (
                <>
                  <Divider orientation="vertical" spacing="none" className="h-4" />
                  <Group role="Info" direction="horizontal">
                    <Badge variant="default" size="sm">
                      {stats.rows} rows
                    </Badge>
                    <Badge variant="info" size="sm">
                      {stats.cols} cols
                    </Badge>
                  </Group>
                </>
              )}
            </Group>

            {/* Density toggle (Table 뷰에서만) */}
            {activeView.type === 'table' && (
              <Action
                role="IconButton"
                icon={density === 'compact' ? 'Maximize2' : 'Minimize2'}
                label={density === 'compact' ? 'Normal view' : 'Compact view'}
                density="Compact"
                onClick={() => setDensity(density === 'compact' ? 'normal' : 'compact')}
              />
            )}
          </Group>
        </Section>

        {/* View Content */}
        <div className="flex-1 min-h-0 bg-surface">
          {activeView.type === 'table' && (
            <TableView data={data} viewConfig={activeView} density={density} />
          )}
          {activeView.type === 'board' && <BoardView data={data} viewConfig={activeView} />}
          {activeView.type === 'gallery' && <GalleryView data={data} viewConfig={activeView} />}
          {activeView.type === 'list' && <ListView data={data} />}
        </div>
      </Section>
    </Page>
  );
};
