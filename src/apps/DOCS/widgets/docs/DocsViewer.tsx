/**
 * DocsViewer - 문서 뷰어 (IDDL v1.0.1 전용)
 *
 * /apps/docs 폴더 구조 기반 문서 뷰어
 * - 순수 IDDL 컴포넌트로만 구성 (Page, Section, Block, Text, Field, Action)
 * - 상단 헤더 고정
 * - 사이드바 네비게이션
 * - 반응형 레이아웃
 */

import { useEffect, useState } from 'react';
import { getAllDocs } from '@/apps/DOCS/lib/docs-scanner';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Field } from '@/components/dsl/Element/Field/Field';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Page } from '@/components/dsl/Page/Page';
import { Section } from '@/components/dsl/Section/Section';
import { DocsTree } from './DocsTree.tsx';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';

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
    ? getAllDocs().filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <Page role="Application" layout="Sidebar">
      {/* 상단 고정 헤더 */}
      <Section role="Header" prominence="Standard">
        <Block role="Toolbar">
          <Text role="Title" content="문서" />
        </Block>
      </Section>

      {/* 사이드바 - 네비게이션 */}
      <Section role="Navigator" prominence="Standard">
        {/* 검색 */}
        <Block role="Form">
          <Field
            label=""
            type="text"
            placeholder="문서 검색..."
            model={searchQuery}
            onChange={(value) => setSearchQuery(value as string)}
          />
        </Block>

        {/* 문서 트리 - 스크롤 가능 영역 */}
        <Section role="Container">
          {searchQuery ? (
            // 검색 결과
            <Block role="List">
              {filteredDocs.map((doc) => (
                <Action
                  key={doc.path}
                  label={doc.title}
                  intent="Neutral"
                  behavior={{
                    action: 'command',
                    command: 'docs.select',
                    args: { path: doc.path },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleFileClick(doc.path);
                  }}
                />
              ))}
              {filteredDocs.length === 0 && <Text role="Body" content="검색 결과가 없습니다" />}
            </Block>
          ) : (
            // 트리 구조
            <DocsTree onFileClick={handleFileClick} />
          )}
        </Section>
      </Section>

      {/* 메인 콘텐츠 영역 */}
      <Section role="Main" prominence="Standard">
        {selectedPath ? (
          <>
            {/* 문서 제목 */}
            <Block role="Container">
              <Text
                role="Title"
                content={getAllDocs().find((d) => d.path === selectedPath)?.title || '문서'}
                prominence="Hero"
              />
            </Block>

            {/* 문서 내용 */}
            <Block role="Container">
              {isLoading ? (
                <Text role="Body" content="로딩 중..." />
              ) : (
                <MarkdownRenderer content={docContent} />
              )}
            </Block>
          </>
        ) : (
          <Block role="Container">
            <Text role="Title" content="문서를 선택하세요" />
            <Text role="Body" content="왼쪽 사이드바에서 문서를 선택하면 내용이 표시됩니다" />
          </Block>
        )}
      </Section>
    </Page>
  );
};
