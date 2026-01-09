/**
 * MarkdownDocs - JSDoc을 마크다운으로 렌더링
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Section } from '@/components/types/Section/Section.tsx';
import { cn } from '@/shared/lib/utils';

interface MarkdownDocsProps {
  content: string;
}

export function MarkdownDocs({ content }: MarkdownDocsProps) {
  return (
    <Section role="Container" prominence="Standard" className="p-4 rounded-lg">
      <div className="markdown-body max-w-none text-sm">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // 제목 (작은 사이즈로)
            h1: ({ node, children, ...props }) => (
              <h1
                className="text-xl font-bold mt-4 mb-2 text-text leading-tight border-b border-border pb-2"
                {...props}
              >
                {children}
              </h1>
            ),
            h2: ({ node, children, ...props }) => (
              <h2 className="text-lg font-semibold mt-3 mb-2 text-text leading-snug" {...props}>
                {children}
              </h2>
            ),
            h3: ({ node, children, ...props }) => (
              <h3 className="text-base font-semibold mt-2 mb-1 text-text" {...props}>
                {children}
              </h3>
            ),
            h4: ({ node, children, ...props }) => (
              <h4 className="text-sm font-medium mt-2 mb-1 text-text" {...props}>
                {children}
              </h4>
            ),

            // 단락
            p: ({ node, children, ...props }) => (
              <p className="my-2 text-sm text-text leading-relaxed" {...props}>
                {children}
              </p>
            ),

            // 코드
            code: ({ node, className, children, ...props }) => {
              const isInline = !className?.includes('language-');
              return (
                <code
                  className={cn(
                    'px-1 py-0.5 rounded text-xs font-mono bg-surface-sunken text-accent border border-border',
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            },

            // 리스트
            ul: ({ node, children, ...props }) => (
              <ul className="my-2 ml-4 space-y-1 list-disc marker:text-accent text-sm" {...props}>
                {children}
              </ul>
            ),
            ol: ({ node, children, ...props }) => (
              <ol
                className="my-2 ml-4 space-y-1 list-decimal marker:text-accent marker:font-medium text-sm"
                {...props}
              >
                {children}
              </ol>
            ),
            li: ({ node, children, ...props }) => (
              <li className="text-sm leading-relaxed" {...props}>
                {children}
              </li>
            ),

            // 링크
            a: ({ node, children, ...props }) => (
              <a
                className="text-accent hover:text-accent/80 underline decoration-accent/30 hover:decoration-accent/60 underline-offset-2 transition-colors"
                {...props}
              >
                {children}
              </a>
            ),

            // 강조
            strong: ({ node, children, ...props }) => (
              <strong className="font-semibold text-text" {...props}>
                {children}
              </strong>
            ),
            em: ({ node, children, ...props }) => (
              <em className="italic text-text" {...props}>
                {children}
              </em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </Section>
  );
}
