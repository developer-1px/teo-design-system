/**
 * MarkdownRenderer - 마크다운 렌더링 컴포넌트
 */

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { AtomsShowcase } from '@/apps/DOCS/widgets/docs/interactive/AtomsShowcase';
import { ComponentsShowcase } from '@/apps/DOCS/widgets/docs/interactive/ComponentsShowcase';
import { Section } from '@/components/Section/Section.tsx';
import { cn } from '@/lib/utils.ts';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * 인터랙티브 컴포넌트 매핑
 * <!-- INTERACTIVE:ComponentName --> 형식을 지원
 */
const INTERACTIVE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  ComponentsShowcase: ComponentsShowcase,
  AtomsShowcase: AtomsShowcase,
};

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  const [processedContent, setProcessedContent] = useState(content);

  useEffect(() => {
    // 인터랙티브 컴포넌트 처리
    let processed = content;

    // <!-- INTERACTIVE:ComponentName --> 를 실제 컴포넌트로 변환
    const interactiveRegex = /<!-- INTERACTIVE:(\w+)(?:\s+(.+?))? -->/g;
    const matches = Array.from(content.matchAll(interactiveRegex));

    if (matches.length > 0) {
      // 각 인터랙티브 마커를 div로 교체 (나중에 컴포넌트로 렌더링)
      matches.forEach((match, index) => {
        const componentName = match[1];
        const props = match[2] || '';
        processed = processed.replace(
          match[0],
          `<div data-interactive="${componentName}" data-props="${props}" data-index="${index}"></div>`
        );
      });
    }

    setProcessedContent(processed);
  }, [content]);

  return (
    <div className={cn('prose prose-slate max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkFrontmatter]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // 커스텀 컴포넌트 렌더링
          div: ({ node, className, children, ...props }: any) => {
            const dataInteractive = props['data-interactive'];
            if (dataInteractive && INTERACTIVE_COMPONENTS[dataInteractive]) {
              const Component = INTERACTIVE_COMPONENTS[dataInteractive];
              const dataProps = props['data-props'];

              // props 파싱 (간단한 key=value 형식)
              const parsedProps: Record<string, any> = {};
              if (dataProps) {
                const propPairs = dataProps.split(/\s+/);
                propPairs.forEach((pair: string) => {
                  const [key, value] = pair.split('=');
                  if (key && value) {
                    parsedProps[key] = value.replace(/['"]/g, '');
                  }
                });
              }

              return (
                <div className="my-8 not-prose">
                  <Section role="Container" prominence="Secondary" className="p-6">
                    <Component {...parsedProps} />
                  </Section>
                </div>
              );
            }

            return (
              <div className={className} {...props}>
                {children}
              </div>
            );
          },

          // 코드 블록
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <Section role="Container" prominence="Primary" className="overflow-x-auto my-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </Section>
            ) : (
              <code
                className={cn('px-1.5 py-0.5 rounded text-sm bg-layer-1', className)}
                {...props}
              >
                {children}
              </code>
            );
          },

          // 테이블
          table: ({ node, children, ...props }: any) => (
            <div className="my-6 overflow-x-auto">
              <Section role="Container" prominence="Secondary">
                <table className="w-full border-collapse" {...props}>
                  {children}
                </table>
              </Section>
            </div>
          ),

          // 인용구
          blockquote: ({ node, children, ...props }: any) => (
            <Section
              role="Container"
              prominence="Primary"
              className="my-4 pl-4 border-l-4 border-accent"
            >
              <blockquote className="text-text-secondary italic" {...props}>
                {children}
              </blockquote>
            </Section>
          ),

          // 링크
          a: ({ node, children, ...props }: any) => (
            <a
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),

          // 제목
          h1: ({ node, children, ...props }: any) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 text-text" {...props}>
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }: any) => (
            <h2
              className="text-3xl font-semibold mt-6 mb-3 text-text border-b border-border pb-2"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }: any) => (
            <h3 className="text-2xl font-semibold mt-4 mb-2 text-text" {...props}>
              {children}
            </h3>
          ),
          h4: ({ node, children, ...props }: any) => (
            <h4 className="text-xl font-medium mt-3 mb-2 text-text" {...props}>
              {children}
            </h4>
          ),

          // 단락
          p: ({ node, children, ...props }: any) => (
            <p className="my-3 text-text leading-relaxed" {...props}>
              {children}
            </p>
          ),

          // 리스트
          ul: ({ node, children, ...props }: any) => (
            <ul className="my-3 ml-6 list-disc text-text" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }: any) => (
            <ol className="my-3 ml-6 list-decimal text-text" {...props}>
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }: any) => (
            <li className="my-1 text-text" {...props}>
              {children}
            </li>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
