/**
 * DocsViewer - 문서 뷰어 (IDDL v1.0.1 전용)
 *
 * /apps/docs 폴더 구조 기반 문서 뷰어
 * - 순수 IDDL 컴포넌트로만 구성 (Page, Section, Group, Text, Field, Action)
 * - 상단 헤더 고정
 * - 사이드바 네비게이션
 * - 반응형 레이아웃
 */

import { useState, useEffect } from 'react';
import { Page, Section, Group, Text, Action } from '@/components/dsl';
import { DocsTree } from './DocsTree.tsx';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';
import { getAllDocs } from '@/lib/docs-scanner.ts';

export const DocsViewer = () => {
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [docContent, setDocContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 첫 번째 문서 자동 선택
  useEffect(() => {
    if (!selectedPath) {
      const docs = getAllDocs();
      if (docs.length > 0) {
        setSelectedPath(docs[0].path);
      }
    }
  }, [selectedPath]);

  // 문서 내용 로드
  useEffect(() => {
    if (!selectedPath) return;

    setIsLoading(true);

    // Vite의 동적 import 사용
    fetch(selectedPath)
      .then((res) => res.text())
      .then((content) => {
        setDocContent(content);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load document:', err);
        setDocContent('# 문서를 불러올 수 없습니다\n\n오류가 발생했습니다.');
        setIsLoading(false);
      });
  }, [selectedPath]);

  const handleFileClick = (path: string) => {
    setSelectedPath(path);
  };

  // 검색 필터링 (간단한 구현)
  const filteredDocs = searchQuery
    ? getAllDocs().filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Page layout="full">
      {/* 상단 고정 헤더 */}
      <Section
        role="Header"
        prominence="Primary"
        density="Compact"
      >
        <Group role="Toolbar" layout="inline">
          <Text role="Title" content="문서" prominence="Primary" />
        </Group>
      </Section>

      {/* 메인 레이아웃: 사이드바 + 콘텐츠 */}
      <Section role="Container" className="flex h-[calc(100vh-57px)] overflow-hidden">
        {/* 사이드바 - 네비게이션 */}
        <Section
          role="Navigator"
          prominence="Secondary"
          density="Compact"
          className="flex flex-col"
        >
          {/* 검색 */}
          <Group role="Form">
            {/* TODO: Field에 clearable 기능 필요 - 요구사항 문서 참조 */}
            <input
              type="text"
              placeholder="문서 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Group>

          {/* 문서 트리 */}
          <Group role="List" layout="stack" className="flex-1 overflow-y-auto">
            {searchQuery ? (
              // 검색 결과
              <Group role="List" layout="stack">
                {filteredDocs.map((doc) => (
                  <Action
                    key={doc.path}
                    label={doc.title}
                    prominence="Tertiary"
                    intent="Neutral"
                    behavior={{ action: 'command', command: 'docs.select', args: { path: doc.path } }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFileClick(doc.path);
                    }}
                  />
                ))}
                {filteredDocs.length === 0 && (
                  <Text
                    role="Body"
                    content="검색 결과가 없습니다"
                    prominence="Tertiary"
                  />
                )}
              </Group>
            ) : (
              // 트리 구조
              <DocsTree onFileClick={handleFileClick} />
            )}
          </Group>
        </Section>

        {/* 메인 콘텐츠 영역 */}
        <Section role="Container" prominence="Primary" className="flex-1 overflow-y-auto">
          {selectedPath ? (
            <>
              {/* 문서 제목 */}
              <Group role="Container">
                <Text
                  role="Title"
                  content={
                    getAllDocs().find((d) => d.path === selectedPath)?.title || '문서'
                  }
                  prominence="Hero"
                />
              </Group>

              {/* 문서 내용 */}
              <Group role="Container">
                {isLoading ? (
                  <Text
                    role="Body"
                    content="로딩 중..."
                    prominence="Secondary"
                  />
                ) : (
                  <MarkdownRenderer content={docContent} />
                )}
              </Group>
            </>
          ) : (
            <Group role="Container">
              <Text
                role="Title"
                content="문서를 선택하세요"
                prominence="Primary"
              />
              <Text
                role="Body"
                content="왼쪽 사이드바에서 문서를 선택하면 내용이 표시됩니다"
                prominence="Secondary"
              />
            </Group>
          )}
        </Section>
      </Section>
    </Page>
  );
};
