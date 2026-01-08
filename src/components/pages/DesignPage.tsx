/**
 * DesignPage - Design System Documentation
 * docs 폴더의 문서들을 자동으로 스캔하여 보여주는 페이지
 */

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/Layout';
import { DocsSidebar } from '@/components/design-system/DocsSidebar';
import { DocsViewer } from '@/components/design-system/DocsViewer';
import {
  loadDocsFromFiles,
  getFirstDoc,
  getDocById,
  type DocCategory,
} from '@/lib/docs-loader';

export const DesignPage = () => {
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [activeDocId, setActiveDocId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const loadedCategories = await loadDocsFromFiles();
        setCategories(loadedCategories);

        // 첫 번째 문서 자동 선택
        const firstDoc = getFirstDoc(loadedCategories);
        if (firstDoc) {
          setActiveDocId(firstDoc.id);
        }
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocs();
  }, []);

  const handleDocSelect = (docId: string) => {
    setActiveDocId(docId);
  };

  const activeDoc = getDocById(categories, activeDocId);

  if (isLoading) {
    return (
      <Layout depth={0} className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-secondary">문서를 불러오는 중...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout depth={0} className="flex h-full w-full">
      {/* Sidebar */}
      <DocsSidebar
        categories={categories}
        activeDocId={activeDocId}
        onDocSelect={handleDocSelect}
      />

      {/* Main Content */}
      <DocsViewer doc={activeDoc || null} />
    </Layout>
  );
};
