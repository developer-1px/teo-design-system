/**
 * App.tsx - IDDL 기반 루트 애플리케이션 (Wouter 라우팅)
 *
 * IDDL Structure:
 * - Router (Wouter): Hash-based routing
 *   - AppProvider: 앱 타입별 테마 관리
 *     - Route: 각 앱별 라우트 (각 앱이 자체 Page 관리)
 *     - FloatingBar: 전역 앱 선택 바
 *     - CommandPalette: 전역 명령 팔레트
 */

import { Redirect, Route, Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { AppDOCS } from '@/apps/DOCS/AppDOCS.tsx';
import { AppDSLBuilder } from '@/apps/DSLBuilder/AppDSLBuilder.tsx';
import { AppEMOJI } from '@/apps/EMOJI/AppEMOJI.tsx';
import { AppIDE } from '@/apps/IDE/AppIDE.tsx';
import { FloatingBar } from '@/app/widgets/FloatingBar.tsx';
import { AppJSON } from '@/apps/JSON/AppJSON.tsx';
import { AppLayout } from '@/apps/LAYOUT/AppLayout.tsx';
import { AppPPT } from '@/apps/PPT/AppPPT.tsx';
import { AppShowcase } from '@/apps/showcase/AppShowcase.tsx';
import { AppTokens } from '@/apps/tokens/AppTokens.tsx';
import { AppPage } from '@/apps/PAGE/AppPage.tsx';
import { AppSection } from '@/apps/SECTION/AppSection.tsx';
import { AppOverlay } from '@/apps/OVERLAY/AppOverlay.tsx';
import { AppGroup } from '@/apps/GROUP/AppGroup.tsx';
import { AppField } from '@/apps/FIELD/AppField.tsx';
import { AppAction } from '@/apps/ACTION/AppAction.tsx';
import { AppText } from '@/apps/TEXT/AppText.tsx';
import { CommandPalette } from '@/components/types/Overlay/CommandPalette.tsx';
import { AppProvider } from '@/app/contexts/app-context.tsx';

function App() {
  // Note: Theme initialization moved to main.tsx (before React renders)

  return (
    <Router hook={useHashLocation}>
      <AppProvider>
        {/* Wouter Routes - 각 앱이 자체 Page/Section 관리 */}
        <Route path="/ide" component={AppIDE} />
        <Route path="/ppt" component={AppPPT} />
        <Route path="/notion" component={AppJSON} />
        <Route path="/emoji" component={AppEMOJI} />
        <Route path="/design" component={AppDOCS} />
        <Route path="/builder" component={AppDSLBuilder} />
        <Route path="/showcase" component={AppShowcase} />
        <Route path="/tokens" component={AppTokens} />
        <Route path="/layout" component={AppLayout} />
        {/* IDDL Component Showcases */}
        <Route path="/page" component={AppPage} />
        <Route path="/section" component={AppSection} />
        <Route path="/overlay" component={AppOverlay} />
        <Route path="/group" component={AppGroup} />
        <Route path="/field" component={AppField} />
        <Route path="/action" component={AppAction} />
        <Route path="/text" component={AppText} />

        {/* Default redirect to IDE */}
        <Route path="/">
          <Redirect to="/ide" />
        </Route>

        {/* 전역 UI 요소 (모든 앱에서 공통) */}
        <FloatingBar />
        <CommandPalette />
      </AppProvider>
    </Router>
  );
}

export default App;
