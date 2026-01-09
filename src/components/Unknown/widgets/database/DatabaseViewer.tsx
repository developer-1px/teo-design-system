/**
 * DatabaseViewer - Notion Database 스타일 메인 컨테이너
 *
 * 다양한 뷰로 JSON 데이터를 표시
 */

import { Maximize2, Minimize2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { IconButton } from '@/components/Action/role/IconButton';
import { Group } from '@/components/Group/Group';
import { Page } from '@/components/Page/Page';
import { Section } from '@/components/Section/Section';
import { Badge } from '@/components/Text/role/Badge';
import { Text } from '@/components/Text/Text';
import { Divider } from '@/components/utils/Divider';
import type { DatabaseConfig, JsonArray } from '@/components/utils/types';
import { ViewSwitcher } from './ViewSwitcher';
import { BoardView } from './views/BoardView';
import { GalleryView } from './views/GalleryView';
import { ListView } from './views/ListView';
import { TableView } from './views/TableView';

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
        <Section prominence="Primary" className="border-b border-default bg-surface">
          <Group role="Container" className="px-6 py-4 gap-2">
            {title && (
              <Text role="Title" prominence="Hero" className="text-2xl font-bold" content={title} />
            )}
            {description && (
              <Text role="Body" prominence="Primary" className="text-muted" content={description} />
            )}
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
              <IconButton
                size="sm"
                onClick={() => setDensity(density === 'compact' ? 'normal' : 'compact')}
                title={density === 'compact' ? 'Normal view' : 'Compact view'}
              >
                {density === 'compact' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </IconButton>
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
