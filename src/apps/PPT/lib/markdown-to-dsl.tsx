import { Frame } from '@/components/dsl/shared/Frame';
/**
 * Markdown to DSL Converter
 *
 * 마크다운 텍스트를 IDDL DSL 컴포넌트로 변환합니다.
 * PPT 슬라이드 렌더링을 위한 변환 유틸리티입니다.
 *
 * @see apps/ppt/ai-era-slides.md
 * @see spec/iddl-spec-1.0.1.md
 */

import type { ReactNode } from 'react';
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Text } from '@/components/dsl/Element/Text/Text';

/**
 * 마크다운 라인 타입
 */
type LineType =
  | { type: 'heading1'; content: string }
  | { type: 'heading2'; content: string }
  | { type: 'heading3'; content: string }
  | { type: 'blockquote'; content: string }
  | { type: 'list'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'empty' };

/**
 * 마크다운 라인을 분석하여 타입 결정
 */
function parseLine(line: string): LineType {
  const trimmed = line.trim();

  if (!trimmed) {
    return { type: 'empty' };
  }

  // Heading 1
  if (trimmed.startsWith('# ')) {
    return {
      type: 'heading1',
      content: trimmed.replace(/^#\s+/, ''),
    };
  }

  // Heading 2
  if (trimmed.startsWith('## ')) {
    return {
      type: 'heading2',
      content: trimmed.replace(/^##\s+/, ''),
    };
  }

  // Heading 3
  if (trimmed.startsWith('### ')) {
    return {
      type: 'heading3',
      content: trimmed.replace(/^###\s+/, ''),
    };
  }

  // Blockquote
  if (trimmed.startsWith('> ')) {
    return {
      type: 'blockquote',
      content: trimmed.replace(/^>\s+/, ''),
    };
  }

  // List item
  if (trimmed.match(/^[-*]\s+/)) {
    return {
      type: 'list',
      content: trimmed.replace(/^[-*]\s+/, ''),
    };
  }

  // Regular paragraph
  return {
    type: 'paragraph',
    content: trimmed,
  };
}

/**
 * 인라인 마크다운 파싱 (Bold, Italic 등)
 *
 * Note: Text 컴포넌트는 children을 받지 않으므로,
 * Bold 텍스트는 단순히 제거하고 일반 텍스트로 반환합니다.
 */
function parseInlineMarkdown(text: string): string {
  // **bold** 제거 (향후 개선 가능)
  return text.replace(/\*\*(.+?)\*\*/g, '$1');
}

/**
 * 마크다운을 DSL 컴포넌트로 변환
 *
 * @param markdown - 마크다운 텍스트
 * @returns DSL 컴포넌트 배열
 */
export function markdownToDSL(markdown: string): ReactNode {
  const lines = markdown.split('\n');
  const elements: ReactNode[] = [];
  const listItems: ReactNode[] = [];
  let key = 0;

  // 리스트를 flush하는 헬퍼 함수
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <Block key={`list-${key++}`} role="List" density="Compact">
          {listItems.map((item, i) => (
            <Frame.Inline key={i} density="Compact">
              <Text role="Body" content="•" intent="Brand" />
              <Frame.Column>{item}</Frame.Column>
            </Frame.Inline>
          ))}
        </Block>
      );
      listItems.length = 0; // Clear array
    }
  };

  // 각 라인 처리
  lines.forEach((line) => {
    const parsed = parseLine(line);

    switch (parsed.type) {
      case 'empty':
        flushList();
        break;

      case 'heading1':
        flushList();
        elements.push(
          <Text key={`h1-${key++}`} role="Title" prominence="Hero" content={parsed.content} />
        );
        break;

      case 'heading2':
        flushList();
        elements.push(<Text key={`h2-${key++}`} role="Title" content={parsed.content} />);
        break;

      case 'heading3':
        flushList();
        elements.push(<Text key={`h3-${key++}`} role="Title" content={parsed.content} />);
        break;

      case 'blockquote':
        flushList();
        elements.push(
          <Frame.Column key={`quote-${key++}`}>
            <Text role="Body" content={parsed.content} />
          </Frame.Column>
        );
        break;

      case 'list':
        // 리스트 아이템 누적
        listItems.push(<Text role="Body" content={parsed.content} />);
        break;

      case 'paragraph': {
        flushList();
        const content = parseInlineMarkdown(parsed.content);
        elements.push(<Text key={`p-${key++}`} role="Body" content={content} />);
        break;
      }
    }
  });

  // 마지막 리스트 flush
  flushList();

  return <>{elements}</>;
}

/**
 * 슬라이드 전체를 DSL Section으로 래핑
 */
export function slideContentToDSL(content: string): ReactNode {
  return (
    <Frame.Column density="Comfortable">
      {markdownToDSL(content)}
    </Frame.Column>
  );
}
