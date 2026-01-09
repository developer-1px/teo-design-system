import { Section } from '@/components/Section/Section.tsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface MarkdownViewerProps {
  content: string;
  filename?: string;
}

export const MarkdownViewer = ({ content, filename }: MarkdownViewerProps) => {
  return (
    <Section
      role="Container"
      prominence="Primary"
      className="flex-1 overflow-y-auto bg-layer-3"
    >
      <div className="mx-auto max-w-4xl px-8 py-6">
        {/* File name header */}
        {filename && (
          <div className="mb-6 pb-4 border-b border-border-subtle">
            <h1 className="text-2xl font-semibold text-text">{filename}</h1>
          </div>
        )}

        {/* Markdown content */}
        <div className="markdown-content prose prose-neutral max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={{
              // Headings
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold text-text mb-4 mt-8 first:mt-0" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold text-text mb-3 mt-6" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold text-text mb-2 mt-4" {...props} />
              ),
              h4: ({ node, ...props }) => (
                <h4 className="text-lg font-semibold text-text mb-2 mt-4" {...props} />
              ),
              h5: ({ node, ...props }) => (
                <h5 className="text-base font-semibold text-text mb-2 mt-3" {...props} />
              ),
              h6: ({ node, ...props }) => (
                <h6 className="text-sm font-semibold text-text mb-2 mt-3" {...props} />
              ),

              // Paragraphs and text
              p: ({ node, ...props }) => (
                <p className="text-text-secondary mb-4 leading-7" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-text" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-text-secondary" {...props} />
              ),

              // Links
              a: ({ node, ...props }) => (
                <a
                  className="text-accent hover:text-accent-hover underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),

              // Lists
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside mb-4 text-text-secondary space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside mb-4 text-text-secondary space-y-1" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="leading-7" {...props} />
              ),

              // Code
              code: ({ node, className, children, ...props }) => {
                const isInline = !className?.includes('language-');
                if (isInline) {
                  return (
                    <code
                      className="bg-layer-1 text-accent px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <code
                    className={`${className} text-sm`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ node, ...props }) => (
                <pre className="bg-layer-1 rounded-lg p-4 mb-4 overflow-x-auto" {...props} />
              ),

              // Blockquote
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-accent/30 pl-4 py-2 mb-4 bg-layer-1 rounded-r text-text-secondary italic"
                  {...props}
                />
              ),

              // Horizontal rule
              hr: ({ node, ...props }) => (
                <hr className="border-border my-8" {...props} />
              ),

              // Tables
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-layer-1" {...props} />
              ),
              tbody: ({ node, ...props }) => (
                <tbody {...props} />
              ),
              tr: ({ node, ...props }) => (
                <tr className="border-b border-border-subtle" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="text-left px-4 py-2 text-text font-semibold" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="px-4 py-2 text-text-secondary" {...props} />
              ),

              // Images
              img: ({ node, ...props }) => (
                <img
                  className="max-w-full h-auto rounded-lg shadow-layer-3 my-4"
                  {...props}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </Section>
  );
};
