/**
 * DocsViewer - 마크다운 문서 뷰어
 * 선택된 문서의 내용을 표시
 */

import { useEffect, useState } from 'react';
import { Layer } from '@/components/ui/Layer';
import { FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocItem } from '@/lib/docs-config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import '@/styles/markdown.css';

interface DocsViewerProps {
  doc: DocItem | null;
}

export const DocsViewer = ({ doc }: DocsViewerProps) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doc) {
      setContent('');
      return;
    }

    const loadDocument = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // docs 폴더의 파일 로드
        const response = await fetch(doc.filePath);

        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.statusText}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error loading document:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [doc]);

  // 문서가 선택되지 않은 경우
  if (!doc) {
    return (
      <Layer level={3} className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4 text-text-tertiary" />
          <p className="text-base font-medium text-text-primary mb-2">
            문서를 선택하세요
          </p>
          <p className="text-sm text-text-tertiary">
            왼쪽 사이드바에서 문서를 선택하면 내용이 표시됩니다
          </p>
        </div>
      </Layer>
    );
  }

  // 로딩 중
  if (isLoading) {
    return (
      <Layer level={3} className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-secondary">문서를 불러오는 중...</p>
        </div>
      </Layer>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <Layer level={3} className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4 text-semantic-error" />
          <p className="text-base font-medium text-text-primary mb-2">
            문서를 불러올 수 없습니다
          </p>
          <p className="text-sm text-text-tertiary">{error}</p>
        </div>
      </Layer>
    );
  }

  return (
    <Layer level={3} className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        {doc.icon && <doc.icon size={20} className="text-accent" />}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-text-primary truncate">
            {doc.title}
          </h1>
          <p className="text-sm text-text-tertiary truncate">
            {doc.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <MarkdownContent content={content} />
        </div>
      </div>
    </Layer>
  );
};

/**
 * MarkdownContent - 마크다운 텍스트를 렌더링
 * react-markdown으로 풍부한 마크다운 렌더링
 */
interface MarkdownContentProps {
  content: string;
}

const MarkdownContent = ({ content }: MarkdownContentProps) => {
  return (
    <div className="markdown-content max-w-4xl mx-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkFrontmatter]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // 코드 블록 스타일링
          code: ({ node, inline, className, children, ...props }) => {
            return inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className={cn(className, 'hljs')} {...props}>
                {children}
              </code>
            );
          },
          // 링크는 새 탭에서 열기
          a: ({ node, children, href, ...props }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
