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
import { Section } from '@/components/types/Section/Section.tsx';
import { cn } from '@/shared/lib/utils';

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
    <div className={cn('markdown-body max-w-none', className)}>
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
                  <Section role="Container" className="p-6">
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
              <div className="relative my-6 rounded-lg overflow-hidden bg-surface-sunken border border-border">
                <div className="absolute top-0 right-0 px-3 py-1 text-xs text-muted bg-surface-raised rounded-bl">
                  {match[1]}
                </div>
                <pre className="overflow-x-auto p-4">
                  <code className={cn('text-sm font-mono', className)} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className={cn(
                  'px-1.5 py-0.5 mx-0.5 rounded text-[0.9em] font-mono bg-surface-sunken text-accent border border-border',
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },

          // 코드 블록 pre (highlight.js용)
          pre: ({ node, children, ...props }: any) => {
            return <>{children}</>;
          },

          // 테이블
          table: ({ node, children, ...props }: any) => (
            <div className="my-8 overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ node, children, ...props }: any) => (
            <thead className="bg-surface-raised" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ node, children, ...props }: any) => (
            <tbody className="divide-y divide-border" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ node, children, ...props }: any) => (
            <tr className="hover:bg-surface-raised transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ node, children, ...props }: any) => (
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-text border-b-2 border-border"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ node, children, ...props }: any) => (
            <td className="px-4 py-3 text-sm text-text" {...props}>
              {children}
            </td>
          ),

          // 인용구
          blockquote: ({ node, children, ...props }: any) => (
            <blockquote
              className="my-6 pl-6 pr-4 py-4 border-l-4 border-accent bg-accent/5 rounded-r-lg"
              {...props}
            >
              <div className="text-text-secondary [&>p]:my-2 [&>p]:leading-relaxed">{children}</div>
            </blockquote>
          ),

          // 링크
          a: ({ node, children, ...props }: any) => (
            <a
              className="text-accent hover:text-accent/80 underline decoration-accent/30 hover:decoration-accent/60 underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),

          // 제목 (fluid typography with clamp)
          h1: ({ node, children, ...props }: any) => (
            <h1
              className="text-[clamp(2rem,5vw,3rem)] font-bold mt-12 mb-6 text-text leading-tight tracking-tight border-b border-border pb-3"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }: any) => (
            <h2
              className="text-[clamp(1.5rem,4vw,2rem)] font-semibold mt-10 mb-4 text-text leading-snug tracking-tight border-b border-border pb-2"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }: any) => (
            <h3
              className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold mt-8 mb-3 text-text leading-snug"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ node, children, ...props }: any) => (
            <h4
              className="text-[clamp(1.1rem,2.5vw,1.25rem)] font-medium mt-6 mb-2 text-text leading-normal"
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ node, children, ...props }: any) => (
            <h5 className="text-lg font-medium mt-4 mb-2 text-text" {...props}>
              {children}
            </h5>
          ),
          h6: ({ node, children, ...props }: any) => (
            <h6 className="text-base font-medium mt-3 mb-2 text-muted" {...props}>
              {children}
            </h6>
          ),

          // 단락
          p: ({ node, children, ...props }: any) => (
            <p className="my-4 text-[15px] text-text leading-[1.7] [&:first-child]:mt-0" {...props}>
              {children}
            </p>
          ),

          // 리스트
          ul: ({ node, children, ...props }: any) => (
            <ul className="my-4 ml-6 space-y-2 list-disc marker:text-accent text-text" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }: any) => (
            <ol
              className="my-4 ml-6 space-y-2 list-decimal marker:text-accent marker:font-medium text-text"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }: any) => (
            <li className="text-[15px] leading-[1.7] pl-1" {...props}>
              {children}
            </li>
          ),

          // 수평선
          hr: ({ node, ...props }: any) => (
            <hr className="my-8 border-0 border-t-2 border-border" {...props} />
          ),

          // 강조
          strong: ({ node, children, ...props }: any) => (
            <strong className="font-semibold text-text" {...props}>
              {children}
            </strong>
          ),
          em: ({ node, children, ...props }: any) => (
            <em className="italic text-text" {...props}>
              {children}
            </em>
          ),

          // 삭제선
          del: ({ node, children, ...props }: any) => (
            <del className="line-through text-muted" {...props}>
              {children}
            </del>
          ),

          // 이미지
          img: ({ node, ...props }: any) => (
            <img className="my-6 rounded-lg border border-border max-w-full h-auto" {...props} />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>

      <style>{`
        .markdown-body {
          font-size: 16px;
          line-height: 1.6;
          word-wrap: break-word;
        }

        .markdown-body .hljs {
          background: transparent !important;
          padding: 0 !important;
        }

        /* Task lists */
        .markdown-body input[type='checkbox'] {
          margin-right: 0.5rem;
          cursor: pointer;
        }

        /* Nested lists */
        .markdown-body ul ul,
        .markdown-body ol ul,
        .markdown-body ul ol,
        .markdown-body ol ol {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};
