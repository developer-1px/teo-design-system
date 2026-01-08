/**
 * MDXContent - MDX 문서를 렌더링하는 래퍼 컴포넌트
 */

import { cn } from '@/lib/utils';

interface MDXContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MDXContent = ({ children, className }: MDXContentProps) => {
  return (
    <div
      className={cn(
        "mdx-content",
        "w-full h-full overflow-auto p-8 bg-layer-0",
        className
      )}
    >
      <div className="max-w-6xl mx-auto prose prose-invert">
        {children}
      </div>
    </div>
  );
};
