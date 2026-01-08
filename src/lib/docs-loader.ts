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
}

export interface DocCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  docs: DocItem[];
}

/**
 * 파일 경로에서 카테고리 추출 (폴더 구조 기반)
 * /docs/category/file.md → 'category'
 * /docs/file.md → 'root'
 */
const getCategoryFromPath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  // /docs/category/file.md -> ['docs', 'category', 'file.md']
  if (parts.length > 2) {
    return parts[1]; // 'category'
  }
  return 'root'; // 루트 폴더 파일
};

/**
 * 카테고리 ID에서 아이콘 추출 (폴더명 기반)
 */
const getIconFromCategory = (category: string): LucideIcon => {
  switch (category) {
    case 'design-system':
    case 'design':
      return Palette;
    case 'examples':
      return Code;
    case 'reports':
      return AlertCircle;
    case 'guides':
      return BookOpen;
    default:
      return FileText;
  }
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
 * 카테고리 ID에서 표시 이름 생성
 */
const getCategoryTitle = (categoryId: string): string => {
  // 루트 폴더는 "전체 문서"
  if (categoryId === 'root') {
    return '전체 문서';
  }

  // 폴더명을 그대로 사용 (대문자 변환)
  return categoryId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * docs 폴더의 모든 md 파일을 자동으로 로드
 */
export const loadDocsFromFiles = async (): Promise<DocCategory[]> => {
  const docs: DocItem[] = [];

  // Vite의 import.meta.glob으로 docs 폴더의 모든 .md 파일 가져오기 (재귀적)
  // file-loader.ts와 동일한 방식 사용
  const mdFiles = import.meta.glob('/docs/**/*.md', {
    query: '?raw',
    import: 'default',
  });

  for (const [path, loader] of Object.entries(mdFiles)) {
    try {
      // 동적으로 파일 로드
      const content = await loader() as string;

      // 타입 체크: content가 문자열인지 확인
      if (typeof content !== 'string') {
        console.error(`Failed to load ${path}: content is not a string`, typeof content, content);
        continue;
      }

      const filename = path.split('/').pop() || '';
      const id = filename.replace('.md', '').toLowerCase();

      // 폴더 경로에서 카테고리 추출 (하드코딩 없음)
      const category = getCategoryFromPath(path);

      // 파일 내용에서 제목과 설명 추출
      const { title, description } = extractMetadataFromContent(content);

      docs.push({
        id,
        title: title || filename.replace('.md', '').replace(/_/g, ' '),
        description: description || '문서 설명',
        filePath: path, // 실제 파일 경로 유지
        icon: FileText, // 모든 문서에 동일한 아이콘
        category,
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

  // 카테고리 배열 생성 (폴더 구조 기반, 하드코딩 없음)
  const categories: DocCategory[] = [];

  for (const [categoryId, categoryDocs] of categoriesMap.entries()) {
    // 문서를 title 알파벳 순으로 정렬
    categoryDocs.sort((a, b) => a.title.localeCompare(b.title));

    categories.push({
      id: categoryId,
      title: getCategoryTitle(categoryId),
      icon: getIconFromCategory(categoryId),
      docs: categoryDocs,
    });
  }

  // 카테고리를 알파벳 순으로 정렬 (root는 맨 앞)
  categories.sort((a, b) => {
    if (a.id === 'root') return -1;
    if (b.id === 'root') return 1;
    return a.id.localeCompare(b.id);
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
