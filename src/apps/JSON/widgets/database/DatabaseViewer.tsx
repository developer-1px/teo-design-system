/**
 * DatabaseViewer - Notion Database 스타일 메인 컨테이너
 *
 * 다양한 뷰로 JSON 데이터를 표시
 */

import { useMemo, useState } from 'react';
import type { DatabaseConfig, JsonArray } from '@/apps/JSON/widgets/database/types';
import { Block } from '@/components/types/Block/Block.tsx';
import { Divider } from '@/components/types/Block/role/Divider.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';
import { Badge } from '@/components/types/Element/Text/role/Badge.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
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
      <Section role="Container">
        {/* Header */}
        <Section role="Header">
          <Block role="Container">
            {title && <Text role="Title" prominence="Hero" content={title} />}
            {description && <Text role="Body" prominence="Subtle" content={description} />}
          </Block>

          {/* Controls */}
          <Block role="Toolbar">
            <Block role="Container">
              <ViewSwitcher
                views={views}
                activeView={activeViewId}
                onViewChange={setActiveViewId}
              />

              {showStats && (
                <>
                  <Divider />
                  <Block role="Container">
                    <Badge>
                      {stats.rows} rows
                    </Badge>
                    <Badge>
                      {stats.cols} cols
                    </Badge>
                  </Block>
                </>
              )}
            </Block>

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
          </Block>
        </Section>

        {/* View Content */}
        <Section role="Main">
          {activeView.type === 'table' && (
            <TableView data={data} viewConfig={activeView} density={density} />
          )}
          {activeView.type === 'board' && <BoardView data={data} viewConfig={activeView} />}
          {activeView.type === 'gallery' && <GalleryView data={data} viewConfig={activeView} />}
          {activeView.type === 'list' && <ListView data={data} />}
        </Section>
      </Section>
    </Page>
  );
};
