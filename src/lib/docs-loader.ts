/**
 * Documentation Auto-Loader
 * docs 폴더의 md 파일을 자동으로 스캔하고 메타데이터 추출
 */

import {
  BookOpen,
  Layers,
  Code,
  AlertCircle,
  CheckCircle,
  FileText,
  Palette,
  type LucideIcon,
} from 'lucide-react';

export interface DocItem {
  id: string;
  title: string;
  description: string;
  filePath: string;
  icon: LucideIcon;
  category: string;
  order: number;
}

export interface DocCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  docs: DocItem[];
}

/**
 * 파일명에서 카테고리 추론
 */
const getCategoryFromFilename = (filename: string): string => {
  const lower = filename.toLowerCase();

  if (
    lower.includes('design_principles') ||
    lower.includes('design_system') ||
    lower.includes('design_decisions') ||
    lower.includes('layer_system')
  ) {
    return 'design-system';
  }

  if (lower.includes('example') || lower.includes('naming') || lower.includes('convention')) {
    return 'examples';
  }

  if (lower.includes('violation') || lower.includes('report') || lower.includes('fix')) {
    return 'reports';
  }

  return 'other';
};

/**
 * 파일명에서 아이콘 추론
 */
const getIconFromFilename = (filename: string): LucideIcon => {
  const lower = filename.toLowerCase();

  if (lower.includes('principles')) return BookOpen;
  if (lower.includes('layer')) return Layers;
  if (lower.includes('example')) return Code;
  if (lower.includes('violation')) return AlertCircle;
  if (lower.includes('fix') || lower.includes('summary')) return CheckCircle;
  if (lower.includes('decision')) return FileText;
  if (lower.includes('design_system')) return Palette;

  return FileText;
};

/**
 * 파일명에서 정렬 순서 추론
 */
const getOrderFromFilename = (filename: string): number => {
  const lower = filename.toLowerCase();

  // 디자인 시스템 카테고리
  if (lower.includes('design_principles')) return 1;
  if (lower.includes('7_layer') || lower.includes('layer_system')) return 2;
  if (lower.includes('design_system_summary')) return 3;
  if (lower.includes('design_decisions')) return 4;

  // 예제 카테고리
  if (lower.includes('examples')) return 1;
  if (lower.includes('naming')) return 2;

  // 리포트 카테고리
  if (lower.includes('violations_report')) return 1;
  if (lower.includes('fix_summary')) return 2;

  return 99;
};

/**
 * 마크다운 내용에서 제목과 설명 추출
 */
const extractMetadataFromContent = (
  content: string
): { title: string; description: string } => {
  const lines = content.split('\n');

  let title = '';
  let description = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // 첫 번째 H1 제목 찾기
    if (!title && trimmed.startsWith('# ')) {
      title = trimmed.replace(/^#\s+/, '').trim();
      continue;
    }

    // 첫 번째 blockquote 찾기 (주로 설명)
    if (!description && trimmed.startsWith('>')) {
      description = trimmed
        .replace(/^>\s*\*?\*?/, '')
        .replace(/\*?\*?:?\s*/, '')
        .trim();
      break;
    }

    // 제목을 찾았고 설명도 찾았으면 종료
    if (title && description) break;
  }

  return { title, description };
};

/**
 * 카테고리 정보
 */
const categoryInfo: Record<
  string,
  { title: string; icon: LucideIcon }
> = {
  'design-system': {
    title: '디자인 시스템',
    icon: Palette,
  },
  examples: {
    title: '예제 & 가이드',
    icon: Code,
  },
  reports: {
    title: '검토 리포트',
    icon: AlertCircle,
  },
  other: {
    title: '기타',
    icon: FileText,
  },
};

/**
 * docs 폴더의 모든 md 파일을 자동으로 로드
 */
export const loadDocsFromFiles = async (): Promise<DocCategory[]> => {
  const docs: DocItem[] = [];

  // Vite의 import.meta.glob으로 docs 폴더의 모든 .md 파일 가져오기
  const mdFiles = import.meta.glob('../../docs/*.md', {
    query: '?raw',
    import: 'default',
    eager: true
  });

  for (const [path, content] of Object.entries(mdFiles)) {
    try {
      const filename = path.split('/').pop() || '';
      const id = filename.replace('.md', '').toLowerCase();

      // 파일명에서 메타데이터 추론
      const category = getCategoryFromFilename(filename);
      const icon = getIconFromFilename(filename);
      const order = getOrderFromFilename(filename);

      // 파일 내용에서 제목과 설명 추출
      const { title, description } = extractMetadataFromContent(content as string);

      docs.push({
        id,
        title: title || filename.replace('.md', '').replace(/_/g, ' '),
        description: description || '문서 설명',
        filePath: `/docs/${filename}`,
        icon,
        category,
        order,
      });
    } catch (error) {
      console.error(`Failed to load ${path}:`, error);
    }
  }

  // 카테고리별로 그룹핑
  const categoriesMap = new Map<string, DocItem[]>();

  docs.forEach((doc) => {
    if (!categoriesMap.has(doc.category)) {
      categoriesMap.set(doc.category, []);
    }
    categoriesMap.get(doc.category)!.push(doc);
  });

  // 카테고리 배열 생성
  const categories: DocCategory[] = [];

  for (const [categoryId, categoryDocs] of categoriesMap.entries()) {
    const info = categoryInfo[categoryId] || categoryInfo.other;

    // 문서를 order 순으로 정렬
    categoryDocs.sort((a, b) => a.order - b.order);

    categories.push({
      id: categoryId,
      title: info.title,
      icon: info.icon,
      docs: categoryDocs,
    });
  }

  // 카테고리 순서: design-system, examples, reports, other
  const categoryOrder = ['design-system', 'examples', 'reports', 'other'];
  categories.sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.id);
    const bIndex = categoryOrder.indexOf(b.id);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return categories;
};

/**
 * 모든 문서를 flat한 배열로 반환
 */
export const getAllDocs = (categories: DocCategory[]): DocItem[] => {
  return categories.flatMap((category) => category.docs);
};

/**
 * ID로 문서 찾기
 */
export const getDocById = (categories: DocCategory[], id: string): DocItem | undefined => {
  return getAllDocs(categories).find((doc) => doc.id === id);
};

/**
 * 첫 번째 문서 가져오기
 */
export const getFirstDoc = (categories: DocCategory[]): DocItem | null => {
  if (categories.length === 0 || categories[0].docs.length === 0) {
    return null;
  }
  return categories[0].docs[0];
};
