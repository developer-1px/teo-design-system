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
