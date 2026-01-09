/**
 * docs-scanner - /apps/docs 폴더 스캔
 *
 * Vite의 import.meta.glob을 사용하여 모든 문서를 스캔
 */

export interface DocFile {
  path: string; // apps/docs/01-core-concepts/01-purpose-based-design.md
  name: string; // 01-purpose-based-design.md
  title: string; // Purpose Based Design (frontmatter 또는 파일명에서 추출)
  category: string; // 01-core-concepts
  order: number; // 01
}

export interface DocNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  title?: string;
  children?: DocNode[];
  defaultOpen?: boolean;
}

/**
 * Vite의 import.meta.glob으로 모든 .md, .mdx 파일 가져오기
 */
export const getAllDocs = (): DocFile[] => {
  // Vite의 glob import
  const modules = import.meta.glob('/apps/docs/**/*.{md,mdx}', {
    eager: false,
  });

  const files: DocFile[] = [];

  Object.keys(modules).forEach((filePath) => {
    // /apps/docs/01-core-concepts/01-purpose-based-design.md
    const path = filePath.replace('/apps/docs/', '');
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    const category = parts[0];

    // 파일명에서 순서와 제목 추출
    const match = fileName.match(/^(\d+)-(.+)\.(md|mdx)$/);
    const order = match ? parseInt(match[1], 10) : 999;
    const titleSlug = match ? match[2] : fileName.replace(/\.(md|mdx)$/, '');
    const title = titleSlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    files.push({
      path: filePath,
      name: fileName,
      title,
      category,
      order,
    });
  });

  return files.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.order - b.order;
  });
};

/**
 * DocFile 목록을 Tree 구조로 변환
 */
export const buildDocTree = (files: DocFile[]): DocNode[] => {
  const tree: Map<string, DocNode> = new Map();

  files.forEach((file) => {
    const parts = file.path.replace('/apps/docs/', '').split('/');
    const category = parts[0];

    // 카테고리 폴더가 없으면 생성
    if (!tree.has(category)) {
      const categoryMatch = category.match(/^(\d+)-(.+)$/);
      const categoryTitle = categoryMatch
        ? categoryMatch[2]
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : category;

      tree.set(category, {
        name: categoryTitle,
        type: 'folder',
        path: category,
        children: [],
        defaultOpen: true,
      });
    }

    // 파일 노드 추가
    const folder = tree.get(category)!;
    folder.children!.push({
      name: file.title,
      type: 'file',
      path: file.path,
      title: file.title,
    });
  });

  return Array.from(tree.values()).sort((a, b) => a.path.localeCompare(b.path));
};
