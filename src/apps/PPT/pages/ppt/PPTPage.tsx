/**
 * PPTPage - Presentation View with IDDL Page v2.0
 *
 * IDDL Structure:
 * - Page[App]: 프레젠테이션 애플리케이션 루트
 *   - PresentationView: 내부 컨텐츠
 */

import { Page } from '@/components/dsl/Page';
import { PresentationView } from '@/apps/PPT/widgets/presentation/PresentationView';

export const PPTPage = () => {
  return (
    <Page role="App" density="Compact" prominence="Primary">
      <PresentationView />
    </Page>
  );
};
