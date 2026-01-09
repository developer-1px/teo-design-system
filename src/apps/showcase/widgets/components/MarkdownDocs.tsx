/**
 * MarkdownDocs - JSDoc을 마크다운으로 렌더링
 */

import ReactMarkdown from 'react-markdown';
import { Section } from '@/components/Section/Section.tsx';

interface MarkdownDocsProps {
  content: string;
}

export function MarkdownDocs({ content }: MarkdownDocsProps) {
  return (
    <Section role="Container" prominence="Secondary" className="p-4 rounded-lg prose prose-sm max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </Section>
  );
}
