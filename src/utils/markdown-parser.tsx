export interface ParsedSlide {
  id: string;
  title: string;
  content: string;
  rawContent: string;
  backgroundColor: string;
}

/**
 * Parse markdown content into slides
 * Splits by `---` delimiter
 */
export function parseMarkdownSlides(markdown: string): ParsedSlide[] {
  // Split by slide delimiter
  const slideTexts = markdown.split(/\n---\n/).filter((text) => text.trim());

  return slideTexts.map((slideText, index) => {
    const lines = slideText.trim().split('\n');

    // Extract title (first heading)
    let title = '';
    let contentStartIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('# ')) {
        title = line.replace(/^#\s+/, '');
        contentStartIndex = i + 1;
        break;
      } else if (line.startsWith('## ')) {
        title = line.replace(/^##\s+/, '');
        contentStartIndex = i + 1;
        break;
      }
    }

    // If no title found, use first non-empty line
    if (!title) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          title = line.replace(/^#+\s+/, '');
          contentStartIndex = i + 1;
          break;
        }
      }
    }

    // Extract content (everything after title)
    const content = lines.slice(contentStartIndex).join('\n').trim();

    // Determine background color based on slide type
    let backgroundColor = '#ffffff';
    const lowerTitle = title.toLowerCase();

    if (index === 0) {
      // Title slide
      backgroundColor = '#e3f2fd';
    } else if (lowerTitle.includes('질문') || lowerTitle.includes('핵심')) {
      backgroundColor = '#fff3e0';
    } else if (lowerTitle.includes('정리') || lowerTitle.includes('결론')) {
      backgroundColor = '#f3e5f5';
    }

    return {
      id: (index + 1).toString(),
      title: title || `슬라이드 ${index + 1}`,
      content,
      rawContent: slideText,
      backgroundColor,
    };
  });
}

/**
 * Convert markdown to JSX-friendly format
 */
export function renderMarkdownContent(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1 pl-4">
          {currentList.map((item, i) => (
            <li key={i} className="text-text-secondary">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      const quoteText = trimmed.replace(/^>\s+/, '');
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="border-l-4 border-accent/50 bg-accent/5 pl-3 py-2 my-2 italic text-text-primary"
        >
          {parseInlineMarkdown(quoteText)}
        </blockquote>
      );
      return;
    }

    // List item
    if (trimmed.match(/^[-*]\s+/)) {
      const listText = trimmed.replace(/^[-*]\s+/, '');
      currentList.push(listText);
      return;
    }

    // Heading
    if (trimmed.startsWith('##')) {
      flushList();
      const headingText = trimmed.replace(/^##\s+/, '');
      elements.push(
        <h3 key={`heading-${index}`} className="text-lg font-semibold text-text-primary mt-3 mb-2">
          {parseInlineMarkdown(headingText)}
        </h3>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${index}`} className="text-text-secondary">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  // Flush any remaining list
  flushList();

  return elements;
}

/**
 * Parse inline markdown (bold, italic, code)
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  // Replace **bold**
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Bold pattern
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match;
  let lastIndex = 0;

  while ((match = boldRegex.exec(remaining)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(remaining.slice(lastIndex, match.index));
    }
    // Add bold text
    parts.push(
      <strong key={`bold-${key++}`} className="font-semibold text-text-primary">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < remaining.length) {
    parts.push(remaining.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
