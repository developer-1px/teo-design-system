import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Section } from '@/components/types/Section/Section.tsx';
import { cn } from '@/shared/lib/utils';

interface MarkdownViewerProps {
  content: string;
  filename?: string;
}

export const MarkdownViewer = ({ content, filename }: MarkdownViewerProps) => {
  return (
    <Section role="Container" className="flex-1 overflow-y-auto bg-layer-3">
      <div className="mx-auto max-w-4xl px-8 py-6">
        {/* File name header */}
        {filename && (
          <div className="mb-8 pb-4 border-b-2 border-border">
            <h1 className="text-3xl font-bold text-text tracking-tight">{filename}</h1>
          </div>
        )}

        {/* Markdown content */}
        <div className="markdown-body max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={{
              // 제목 (fluid typography with clamp)
              h1: ({ node, children, ...props }) => (
                <h1
                  className="text-[clamp(2rem,5vw,3rem)] font-bold mt-12 mb-6 text-text leading-tight tracking-tight border-b border-border pb-3 first:mt-0"
                  {...props}
                >
                  {children}
                </h1>
              ),
              h2: ({ node, children, ...props }) => (
                <h2
                  className="text-[clamp(1.5rem,4vw,2rem)] font-semibold mt-10 mb-4 text-text leading-snug tracking-tight border-b border-border pb-2"
                  {...props}
                >
                  {children}
                </h2>
              ),
              h3: ({ node, children, ...props }) => (
                <h3
                  className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold mt-8 mb-3 text-text leading-snug"
                  {...props}
                >
                  {children}
                </h3>
              ),
              h4: ({ node, children, ...props }) => (
                <h4
                  className="text-[clamp(1.1rem,2.5vw,1.25rem)] font-medium mt-6 mb-2 text-text leading-normal"
                  {...props}
                >
                  {children}
                </h4>
              ),
              h5: ({ node, children, ...props }) => (
                <h5 className="text-lg font-medium mt-4 mb-2 text-text" {...props}>
                  {children}
                </h5>
              ),
              h6: ({ node, children, ...props }) => (
                <h6 className="text-base font-medium mt-3 mb-2 text-muted" {...props}>
                  {children}
                </h6>
              ),

              // 단락
              p: ({ node, children, ...props }) => (
                <p
                  className="my-4 text-[15px] text-text leading-[1.7] [&:first-child]:mt-0"
                  {...props}
                >
                  {children}
                </p>
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

              // 삭제선
              del: ({ node, children, ...props }) => (
                <del className="line-through text-muted" {...props}>
                  {children}
                </del>
              ),

              // 링크
              a: ({ node, children, ...props }) => (
                <a
                  className="text-accent hover:text-accent/80 underline decoration-accent/30 hover:decoration-accent/60 underline-offset-2 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              ),

              // 리스트
              ul: ({ node, children, ...props }) => (
                <ul
                  className="my-4 ml-6 space-y-2 list-disc marker:text-accent text-text"
                  {...props}
                >
                  {children}
                </ul>
              ),
              ol: ({ node, children, ...props }) => (
                <ol
                  className="my-4 ml-6 space-y-2 list-decimal marker:text-accent marker:font-medium text-text"
                  {...props}
                >
                  {children}
                </ol>
              ),
              li: ({ node, children, ...props }) => (
                <li className="text-[15px] leading-[1.7] pl-1" {...props}>
                  {children}
                </li>
              ),

              // 코드
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;

                if (isInline) {
                  return (
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
                }

                return (
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
                );
              },

              // pre (코드 블록용, 위에서 이미 처리)
              pre: ({ node, children, ...props }) => {
                return <>{children}</>;
              },

              // 인용구
              blockquote: ({ node, children, ...props }) => (
                <blockquote
                  className="my-6 pl-6 pr-4 py-4 border-l-4 border-accent bg-accent/5 rounded-r-lg"
                  {...props}
                >
                  <div className="text-text-secondary [&>p]:my-2 [&>p]:leading-relaxed">
                    {children}
                  </div>
                </blockquote>
              ),

              // 수평선
              hr: ({ node, ...props }) => (
                <hr className="my-8 border-0 border-t-2 border-border" {...props} />
              ),

              // 테이블
              table: ({ node, children, ...props }) => (
                <div className="my-8 overflow-x-auto rounded-lg border border-border">
                  <table className="w-full border-collapse" {...props}>
                    {children}
                  </table>
                </div>
              ),
              thead: ({ node, children, ...props }) => (
                <thead className="bg-surface-raised" {...props}>
                  {children}
                </thead>
              ),
              tbody: ({ node, children, ...props }) => (
                <tbody className="divide-y divide-border" {...props}>
                  {children}
                </tbody>
              ),
              tr: ({ node, children, ...props }) => (
                <tr className="hover:bg-surface-raised transition-colors" {...props}>
                  {children}
                </tr>
              ),
              th: ({ node, children, ...props }) => (
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-text border-b-2 border-border"
                  {...props}
                >
                  {children}
                </th>
              ),
              td: ({ node, children, ...props }) => (
                <td className="px-4 py-3 text-sm text-text" {...props}>
                  {children}
                </td>
              ),

              // 이미지
              img: ({ node, ...props }) => (
                <img
                  className="my-6 rounded-lg border border-border max-w-full h-auto"
                  {...props}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>

          <style jsx global>{`
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
      </div>
    </Section>
  );
};
