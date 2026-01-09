import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * CodeBlock - 멀티라인 코드 블록
 *
 * 여러 줄의 코드를 표시하는 블록 요소
 */
export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  /**
   * language - 코드 언어 (표시용)
   */
  language?: string;

  /**
   * showLineNumbers - 라인 넘버 표시 여부
   */
  showLineNumbers?: boolean;
}

export const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ className, language, showLineNumbers, children, ...props }, ref) => {
    return (
      <div className="relative">
        {/* Language Label */}
        {language && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-surface-base/80 rounded text-xs text-subtle font-mono">
            {language}
          </div>
        )}

        {/* Code Block */}
        <pre
          ref={ref}
          className={cn(
            'p-4 rounded-lg overflow-x-auto',
            'bg-surface-sunken border border-default',
            'text-sm font-mono leading-relaxed',
            'shadow-inset',
            showLineNumbers && 'pl-12',
            className
          )}
          {...props}
        >
          <code className="text-text">{children}</code>
        </pre>
      </div>
    );
  }
);

CodeBlock.displayName = 'CodeBlock';
