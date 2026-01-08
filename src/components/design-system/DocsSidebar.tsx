/**
 * DocsSidebar - 문서 목록 사이드바
 * docs 폴더의 문서들을 카테고리별로 표시 (자동 스캔)
 */

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocCategory, DocItem } from '@/lib/docs-loader';

interface DocsSidebarProps {
  categories: DocCategory[];
  activeDocId: string;
  onDocSelect: (docId: string) => void;
}

export const DocsSidebar = ({ categories, activeDocId, onDocSelect }: DocsSidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // categories가 로드되면 모든 카테고리 열기
  useEffect(() => {
    if (categories.length > 0) {
      setExpandedCategories(categories.map((cat) => cat.id));
    }
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
  };

  return (
    <Layout depth={2} className="flex w-64 flex-col overflow-hidden">
      {/* Header */}
      <Layout depth={1} rounded={false} className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">문서</h2>
          <span className="text-xs text-text-tertiary">
            {categories.reduce((sum, cat) => sum + cat.docs.length, 0)}개
          </span>
        </div>
      </Layout>

      {/* Categories & Docs */}
      <div className="flex-1 overflow-y-auto py-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isExpanded = isCategoryExpanded(category.id);

          return (
            <div key={category.id} className="mb-1">
              {/* Category Header */}
              <Button
                variant="ghost"
                onClick={() => toggleCategory(category.id)}
                className="w-full justify-start gap-2 px-3 py-2 mx-1 h-auto"
              >
                {/* Chevron */}
                <span className="flex-shrink-0 text-text-tertiary">
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>

                {/* Icon */}
                <Icon size={16} className="text-text-secondary" />

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {category.title}
                  </div>
                </div>

                {/* Count Badge */}
                <span className="flex-shrink-0 text-xs text-text-tertiary">
                  {category.docs.length}
                </span>
              </Button>

              {/* Document List */}
              {isExpanded && (
                <div className="mt-1 ml-6 space-y-0.5">
                  {category.docs.map((doc) => {
                    const DocIcon = doc.icon;
                    const isActive = activeDocId === doc.id;

                    return (
                      <Button
                        key={doc.id}
                        variant="ghost"
                        onClick={() => onDocSelect(doc.id)}
                        className={cn(
                          'w-full justify-start gap-2 px-3 py-2 h-auto',
                          {
                            'bg-accent/10 text-accent hover:bg-accent/10': isActive,
                          }
                        )}
                      >
                        {/* Icon */}
                        {DocIcon && (
                          <DocIcon
                            size={16}
                            className={cn({
                              'text-accent': isActive,
                              'text-text-tertiary': !isActive,
                            })}
                          />
                        )}

                        {/* Title & Description */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn('text-sm font-medium truncate', {
                              'text-accent': isActive,
                              'text-text-primary': !isActive,
                            })}
                          >
                            {doc.title}
                          </div>
                          {!isActive && (
                            <div className="text-xs text-text-tertiary truncate">
                              {doc.description}
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
};
