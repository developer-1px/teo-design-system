# 폴더 구조 개선 방안 보고서

**작성일**: 2026-01-09
**작성자**: Claude Code Analysis
**목적**: 현재 프로젝트의 폴더 구조를 분석하고 향후 확장 가능한 아키텍처 제안

---

## 📊 현재 구조 분석

### 전체 통계
- **총 TypeScript 파일**: 170개
- **앱 개수**: 8개 (IDE, PPT, JSON, EMOJI, DOCS, DSLBuilder, showcase, tokens)
- **위젯 파일**: 45개
- **컴포넌트 카테고리**: 7개 (atoms, database, dev, dsl, modal, ui, workspace)

### 현재 폴더 구조

```
src/
├── apps/                    # 8개 애플리케이션 (464KB)
│   ├── DOCS/               # 112KB - 가장 큰 앱
│   ├── showcase/           # 80KB
│   ├── IDE/                # 56KB
│   ├── DSLBuilder/         # 52KB
│   ├── PPT/                # 48KB
│   ├── tokens/             # 44KB
│   ├── JSON/               # 40KB
│   └── EMOJI/              # 32KB
│
├── components/             # 공유 컴포넌트
│   ├── atoms/             # IDDL 원자 컴포넌트 (Button, Input 등)
│   ├── dsl/               # IDDL DSL 컴포넌트 (Page, Section, Group 등)
│   ├── ui/                # 복합 UI 컴포넌트 (Layout, Panel 등)
│   ├── workspace/         # 워크스페이스 특화 컴포넌트
│   ├── modal/             # 모달 컴포넌트 (Settings, Command Palette)
│   ├── database/          # 데이터베이스 뷰 컴포넌트
│   └── dev/               # 개발 도구 컴포넌트
│
├── lib/                    # 비즈니스 로직 & 유틸리티
│   ├── keyboard/          # 키보드 관리
│   ├── emoji-designer/    # 이모지 디자이너 로직
│   ├── dsl-builder/       # DSL 빌더 로직
│   ├── docs/              # 문서 관련
│   ├── app-context.tsx    # 앱 컨텍스트
│   ├── theme.ts           # 테마 시스템
│   └── utils.ts           # 공통 유틸리티
│
├── design-system/         # 디자인 토큰
├── styles/                # 글로벌 스타일
├── utils/                 # 유틸리티 함수
└── shared/                # 공유 리소스 (현재 비어있음)

vite-plugins/              # Vite 플러그인
└── debug-panel/          # 디버그 패널 (TypeScript 모듈화)
```

### 각 앱의 구조 (현재 패턴)

```
src/apps/{APP_NAME}/
├── App{APP_NAME}.tsx      # 앱 진입점 (FSD Pages-First)
├── pages/                 # 페이지 레벨 컴포넌트
│   └── {page-name}/
│       └── {PageName}Page.tsx
└── widgets/               # 위젯 레벨 컴포넌트 (재사용 가능한 블록)
    └── {widget-group}/
        └── {WidgetName}.tsx
```

**예시 - IDE 앱**:
```
src/apps/IDE/
├── AppIDE.tsx             # export { IDEPage as AppIDE }
├── pages/
│   └── ide/
│       └── IDEPage.tsx
└── widgets/
    ├── sidebar/
    │   └── RightSidebar.tsx
    ├── chat/
    │   └── AIAgentChat.tsx
    ├── file-tree/
    │   └── FileTree.tsx
    └── editor/
        ├── ComponentPreview.tsx
        ├── MarkdownViewer.tsx
        ├── EditorTabs.tsx
        └── CodeEditor.tsx
```

---

## 🔍 문제점 분석

### 1. **Barrel Export 혼재** ⚠️

**현재 상태**:
- `~/.claude/CLAUDE.md`에서 "never barrel export" 원칙 명시
- 그러나 실제로는 barrel export 존재:
  - `src/components/ui/index.ts` (re-export from atoms)
  - `src/components/atoms/index.ts`
  - `src/components/dsl/index.ts`
  - 일부 앱의 `index.ts` 파일들

**문제**:
- FSD 2.1 원칙 위반
- 순환 의존성 가능성
- 빌드 시간 증가 (tree-shaking 방해)
- IDE 자동완성 성능 저하

**사용 현황**:
- 16개 파일이 `@/components/atoms` import
- 38개 파일이 `@/components/dsl` import
- 27개 파일이 `@/components/ui` import

### 2. **컴포넌트 계층 혼란** 🤔

**현재 3가지 컴포넌트 철학 공존**:
1. **atoms** - Atomic Design 원칙 (가장 작은 단위)
2. **dsl** - IDDL DSL 컴포넌트 (선언적 UI)
3. **ui** - 복합 컴포넌트 (atoms를 re-export + 추가 컴포넌트)

**문제**:
- `ui/index.ts`가 atoms를 re-export하면서 계층 구조가 모호함
- 개발자가 어디서 import 해야 할지 혼란:
  - `@/components/atoms/Button` vs `@/components/ui/Button`?
  - `@/components/dsl/Section` vs 직접 import?
- atoms와 ui 사이 역할 분리 불명확

### 3. **앱별 코드 vs 공유 코드 경계 모호** 📂

**문제 사례**:
- `components/workspace/` - 이건 공유인가? IDE 전용인가?
- `components/database/` - 어느 앱이 사용하나?
- `lib/emoji-designer/` - EMOJI 앱 전용인데 왜 lib에?
- `lib/dsl-builder/` - DSLBuilder 앱 전용인데 왜 lib에?

**질문**:
- 2개 이상 앱이 쓰면 shared?
- 앱 전용 로직은 앱 폴더 안으로?

### 4. **Features 레이어 부재** 🏗️

**현재 구조**:
```
app → pages → widgets → components (atoms/dsl/ui)
```

**FSD 2.1 표준**:
```
app → pages → widgets → features → entities → shared
```

**문제**:
- features 레이어가 없어서 **비즈니스 로직 재사용**이 어려움
- 예: "파일 트리 필터링", "테마 전환", "키보드 단축키" 등이 feature로 분리되지 않음
- widgets가 너무 많은 책임을 짐 (UI + 비즈니스 로직 혼재)

### 5. **lib 폴더의 역할 불명확** 📚

**현재 lib 내용**:
- `keyboard/` - 키보드 관리 (공유 기능)
- `emoji-designer/` - EMOJI 앱 전용 로직 ❌
- `dsl-builder/` - DSLBuilder 앱 전용 로직 ❌
- `docs/` - DOCS 앱 전용? 공유?
- `theme.ts` - 공유 유틸리티 ✅
- `app-context.tsx` - 공유 컨텍스트 ✅

**문제**:
- 앱 전용 로직이 lib에 섞임
- lib는 shared의 하위 개념인데 같은 레벨에 존재

### 6. **shared 폴더 미사용** 📦

**현재**: `src/shared/` 폴더가 비어있음

**문제**:
- FSD에서 shared는 최하위 레이어 (모든 앱이 사용 가능)
- 현재는 components, lib, utils가 scattered됨
- shared로 통합되어야 할 것들:
  - design-system tokens
  - ui/atoms/dsl components
  - lib utilities
  - common types

---

## 💡 권장 구조 (FSD 2.1 기반)

### 전체 구조 제안

```
src/
├── app/                           # App Layer (최상위)
│   ├── App.tsx                   # Root App (Wouter Router)
│   ├── main.tsx                  # Entry point
│   └── providers/                # Global providers
│       ├── theme-provider.tsx
│       └── keyboard-provider.tsx
│
├── pages/                         # Pages Layer (라우팅 단위)
│   ├── ide/                      # /ide 라우트
│   │   ├── ui/
│   │   │   └── IDEPage.tsx
│   │   └── model/
│   │       └── use-ide-state.ts
│   ├── ppt/
│   ├── json/
│   ├── emoji/
│   ├── docs/
│   └── showcase/
│
├── widgets/                       # Widgets Layer (복합 UI 블록)
│   ├── editor/                   # 코드 에디터 위젯
│   │   ├── ui/
│   │   │   ├── CodeEditor.tsx
│   │   │   ├── EditorTabs.tsx
│   │   │   └── MarkdownViewer.tsx
│   │   ├── model/
│   │   │   └── use-editor-state.ts
│   │   └── index.ts              # Public API만 export
│   │
│   ├── file-tree/                # 파일 트리 위젯
│   │   ├── ui/
│   │   │   └── FileTree.tsx
│   │   ├── model/
│   │   │   └── use-file-tree.ts
│   │   └── index.ts
│   │
│   ├── slide-canvas/             # PPT 슬라이드 캔버스
│   ├── json-viewer/              # JSON 뷰어
│   └── emoji-canvas/             # 이모지 캔버스
│
├── features/                      # Features Layer (비즈니스 로직 단위)
│   ├── theme-switcher/           # 테마 전환 기능
│   │   ├── ui/
│   │   │   └── ThemeSwitcher.tsx
│   │   ├── model/
│   │   │   └── use-theme.ts
│   │   └── index.ts
│   │
│   ├── keyboard-shortcuts/       # 키보드 단축키
│   │   ├── ui/
│   │   │   └── KeyboardDebugPanel.tsx
│   │   ├── model/
│   │   │   ├── use-keyboard-shortcuts.ts
│   │   │   └── shortcuts.ts
│   │   └── index.ts
│   │
│   ├── command-palette/          # 명령 팔레트
│   ├── search-modal/             # 검색 모달
│   └── file-operations/          # 파일 작업 (열기/저장)
│
├── entities/                      # Entities Layer (비즈니스 엔티티)
│   ├── file/                     # 파일 엔티티
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   └── file-loader.ts
│   │   └── index.ts
│   │
│   ├── slide/                    # 슬라이드 엔티티
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   └── slide-parser.ts
│   │   └── index.ts
│   │
│   ├── emoji/                    # 이모지 엔티티
│   └── theme/                    # 테마 엔티티
│
├── shared/                        # Shared Layer (공통 리소스)
│   ├── ui/                       # 공유 UI 컴포넌트
│   │   ├── atoms/                # IDDL Atoms (최하위 UI)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── ... (NO index.ts)
│   │   │
│   │   ├── dsl/                  # IDDL DSL 컴포넌트
│   │   │   ├── Page.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── Group.tsx
│   │   │   ├── Item.tsx
│   │   │   └── ... (NO index.ts)
│   │   │
│   │   └── layout/               # 레이아웃 컴포넌트
│   │       ├── Layout.tsx
│   │       ├── Panel.tsx
│   │       ├── Sidebar.tsx
│   │       └── ... (NO index.ts)
│   │
│   ├── lib/                      # 공유 라이브러리
│   │   ├── hooks/                # 공통 훅
│   │   │   ├── use-local-storage.ts
│   │   │   └── use-media-query.ts
│   │   ├── utils/                # 유틸리티
│   │   │   ├── cn.ts
│   │   │   └── format.ts
│   │   └── validation/           # 검증 로직
│   │
│   ├── api/                      # API 클라이언트
│   │   └── base-client.ts
│   │
│   ├── config/                   # 설정
│   │   ├── routes.ts
│   │   └── constants.ts
│   │
│   └── assets/                   # 정적 자산
│       ├── icons/
│       └── images/
│
├── design-system/                 # 디자인 시스템 (shared/config로 이동 고려)
│   └── tokens.ts
│
└── styles/                        # 글로벌 스타일
    ├── index.css
    └── themes.css
```

### Import 경로 예시 (Barrel Export 제거)

```tsx
// ❌ 기존 방식 (Barrel Export)
import { Button, Input, Checkbox } from '@/components/ui';
import { Section, Group } from '@/components/dsl';

// ✅ 새로운 방식 (Direct Import)
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { Section } from '@/shared/ui/dsl/Section';
import { Group } from '@/shared/ui/dsl/Group';

// ✅ Feature는 Public API 제공 가능
import { useTheme } from '@/features/theme-switcher';
import { ThemeSwitcher } from '@/features/theme-switcher/ui/ThemeSwitcher';

// ✅ Widget도 Public API 제공 가능
import { CodeEditor } from '@/widgets/editor/ui/CodeEditor';
import { useEditorState } from '@/widgets/editor/model/use-editor-state';
```

---

## 🎯 FSD 레이어 분리 원칙

### Layer 별 역할 정의

| Layer | 역할 | 의존 방향 | Import 가능 대상 | Barrel Export |
|-------|------|-----------|------------------|---------------|
| **app** | 앱 초기화, 라우팅, 글로벌 프로바이더 | ↓ | pages, features, shared | ❌ |
| **pages** | 라우트별 페이지, 페이지 레벨 상태 | ↓ | widgets, features, entities, shared | ❌ |
| **widgets** | 복합 UI 블록 (재사용 가능) | ↓ | features, entities, shared | ✅ (Public API) |
| **features** | 비즈니스 기능 (사용자 시나리오) | ↓ | entities, shared | ✅ (Public API) |
| **entities** | 비즈니스 엔티티 (도메인 모델) | ↓ | shared | ✅ (Public API) |
| **shared** | 공통 리소스 (UI, utils, config) | - | 없음 (최하위) | ❌ |

### ✅ Barrel Export 허용 규칙

**Public API를 제공해야 하는 레이어만 허용**:
- ✅ **widgets**: 위젯의 공개 인터페이스
- ✅ **features**: 기능의 공개 인터페이스
- ✅ **entities**: 엔티티의 공개 인터페이스

**금지**:
- ❌ **shared**: 항상 direct import
- ❌ **pages**: 페이지는 외부에서 import되지 않음
- ❌ **app**: 앱 레벨은 최상위

---

## 📋 마이그레이션 전략

### Phase 1: shared 레이어 구축 (1-2일)

**목표**: components/atoms, components/dsl, components/ui를 shared로 이동

```bash
# 1. shared/ui 생성
mkdir -p src/shared/ui/{atoms,dsl,layout}

# 2. atoms 이동
mv src/components/atoms/* src/shared/ui/atoms/
rm src/components/atoms/index.ts

# 3. dsl 이동
mv src/components/dsl/* src/shared/ui/dsl/
rm src/components/dsl/index.ts

# 4. ui 복합 컴포넌트 → layout으로 이동
mv src/components/ui/Layout.tsx src/shared/ui/layout/
mv src/components/ui/Panel.tsx src/shared/ui/layout/
mv src/components/ui/Sidebar.tsx src/shared/ui/layout/
rm src/components/ui/index.ts
```

**Import 경로 수정**:
```bash
# Find & Replace (예시)
find src -name "*.tsx" -exec sed -i '' \
  's|@/components/atoms/Button|@/shared/ui/atoms/Button|g' {} +

find src -name "*.tsx" -exec sed -i '' \
  's|@/components/dsl/Section|@/shared/ui/dsl/Section|g' {} +
```

### Phase 2: lib → shared/lib 이동 (1일)

**목표**: lib 폴더를 shared/lib로 이동, 앱 전용 로직 분리

```bash
# 1. 공통 로직만 shared/lib로 이동
mkdir -p src/shared/lib/{hooks,utils,validation}
mv src/lib/theme.ts src/shared/lib/utils/
mv src/lib/utils.ts src/shared/lib/utils/
mv src/lib/keyboard src/shared/lib/keyboard

# 2. 앱 전용 로직은 해당 앱 폴더로 이동
mv src/lib/emoji-designer src/entities/emoji/model/
mv src/lib/dsl-builder src/entities/dsl/model/
mv src/lib/docs src/entities/document/model/
```

### Phase 3: widgets 레이어 생성 (2-3일)

**목표**: 현재 apps/{APP}/widgets를 최상위 widgets로 추출

```bash
# 1. widgets 디렉토리 생성
mkdir -p src/widgets

# 2. 재사용 가능한 위젯 이동
mv src/apps/IDE/widgets/editor src/widgets/editor
mv src/apps/IDE/widgets/file-tree src/widgets/file-tree
mv src/apps/PPT/widgets/presentation src/widgets/slide-canvas
mv src/apps/JSON/widgets/json-viewer src/widgets/json-viewer
mv src/apps/EMOJI/widgets/emoji-designer src/widgets/emoji-canvas
```

**각 위젯에 Public API 추가**:
```tsx
// src/widgets/editor/index.ts
export { CodeEditor } from './ui/CodeEditor';
export { EditorTabs } from './ui/EditorTabs';
export { MarkdownViewer } from './ui/MarkdownViewer';
export { useEditorState } from './model/use-editor-state';
export type { EditorState, EditorTab } from './model/types';
```

### Phase 4: features 레이어 생성 (2-3일)

**목표**: 비즈니스 로직을 features로 분리

```bash
# 1. features 생성
mkdir -p src/features/{theme-switcher,keyboard-shortcuts,command-palette,search-modal}

# 2. 컴포넌트 이동
mv src/components/ui/ThemeSwitcher.tsx src/features/theme-switcher/ui/
mv src/components/modal/CommandPalette.tsx src/features/command-palette/ui/
mv src/components/modal/SearchModal.tsx src/features/search-modal/ui/
mv src/components/dev/KeyboardDebugPanel.tsx src/features/keyboard-shortcuts/ui/
```

**features에 model 추가**:
```tsx
// src/features/theme-switcher/model/use-theme.ts
export const useTheme = () => {
  const [theme, setTheme] = useState(getTheme());
  // ... 테마 로직
  return { theme, setTheme, toggleTheme };
};

// src/features/theme-switcher/index.ts
export { ThemeSwitcher } from './ui/ThemeSwitcher';
export { useTheme } from './model/use-theme';
export type { Theme, ThemeConfig } from './model/types';
```

### Phase 5: pages 레이어 재구성 (1-2일)

**목표**: apps/{APP} 구조를 pages/{route}로 플랫화

```bash
# 1. pages 디렉토리 생성
mkdir -p src/pages

# 2. 각 앱의 페이지 이동
mv src/apps/IDE/pages/ide src/pages/ide
mv src/apps/PPT/pages/ppt src/pages/ppt
mv src/apps/JSON/pages/json src/pages/json
mv src/apps/EMOJI/pages/emoji-designer src/pages/emoji
mv src/apps/DOCS/pages/design-system src/pages/docs

# 3. App.tsx 라우팅 수정
```

**App.tsx 수정**:
```tsx
import { IDEPage } from '@/pages/ide/ui/IDEPage';
import { PPTPage } from '@/pages/ppt/ui/PPTPage';
import { JSONPage } from '@/pages/json/ui/JSONPage';

<Route path="/ide" component={IDEPage} />
<Route path="/ppt" component={PPTPage} />
<Route path="/json" component={JSONPage} />
```

### Phase 6: entities 레이어 추가 (2-3일)

**목표**: 도메인 엔티티 분리

```bash
mkdir -p src/entities/{file,slide,emoji,theme,document}

# 각 엔티티의 types와 로직 분리
# 예: src/entities/file/model/types.ts, file-loader.ts
# 예: src/entities/slide/model/types.ts, slide-parser.ts
```

---

## 🔄 최종 구조 비교

### Before (현재)

```
src/
├── apps/                     # 앱별 폴더 (8개)
│   └── {APP}/
│       ├── App{APP}.tsx
│       ├── pages/
│       └── widgets/
├── components/               # 컴포넌트 (계층 혼란)
│   ├── atoms/               # Atomic Design
│   ├── dsl/                 # IDDL DSL
│   ├── ui/                  # 복합 (atoms re-export)
│   ├── workspace/           # 도메인 특화?
│   ├── modal/               # 기능 특화?
│   └── database/            # 도메인 특화?
└── lib/                      # 유틸 + 앱 전용 로직 혼재
    ├── keyboard/
    ├── emoji-designer/      # ❌ EMOJI 앱 전용
    └── dsl-builder/         # ❌ DSLBuilder 앱 전용
```

**문제점**:
- ❌ Barrel export 혼재
- ❌ 컴포넌트 계층 불명확 (atoms/dsl/ui 중복)
- ❌ 앱 전용 vs 공유 경계 모호
- ❌ features 레이어 부재
- ❌ shared 폴더 미사용

### After (권장)

```
src/
├── app/                      # 앱 초기화 (1개)
│   ├── App.tsx
│   └── main.tsx
├── pages/                    # 페이지 (8개 라우트)
│   ├── ide/
│   ├── ppt/
│   └── ...
├── widgets/                  # 위젯 (재사용 UI 블록)
│   ├── editor/              # ✅ Public API
│   ├── file-tree/           # ✅ Public API
│   └── slide-canvas/
├── features/                 # 기능 (비즈니스 로직)
│   ├── theme-switcher/      # ✅ Public API
│   ├── keyboard-shortcuts/  # ✅ Public API
│   └── command-palette/
├── entities/                 # 엔티티 (도메인 모델)
│   ├── file/                # ✅ Public API
│   ├── slide/
│   └── emoji/
└── shared/                   # 공유 (최하위)
    ├── ui/                  # ❌ NO barrel export
    │   ├── atoms/
    │   ├── dsl/
    │   └── layout/
    ├── lib/
    │   ├── hooks/
    │   └── utils/
    └── config/
```

**장점**:
- ✅ FSD 2.1 표준 준수
- ✅ Barrel export 규칙 명확 (Public API만)
- ✅ 의존성 방향 명확 (app → pages → widgets → features → entities → shared)
- ✅ 컴포넌트 계층 정리 (shared/ui로 통합)
- ✅ 비즈니스 로직 재사용 가능 (features)
- ✅ 확장성 (새 앱/기능 추가 쉬움)

---

## 🎓 FSD 레이어별 예시

### 1. shared/ui/atoms (공통 UI 원자)

**특징**:
- ✅ 순수 UI 컴포넌트 (비즈니스 로직 없음)
- ✅ IDDL 디자인 시스템 기반
- ❌ Barrel export 금지 (direct import)

```tsx
// src/shared/ui/atoms/Button.tsx
import { cn } from '@/shared/lib/utils/cn';

export interface ButtonProps {
  variant?: 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ variant = 'ghost', size = 'md', children, onClick }: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        // ... variant 스타일
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

**사용**:
```tsx
// ✅ Direct import
import { Button } from '@/shared/ui/atoms/Button';

// ❌ Barrel import (금지)
import { Button } from '@/shared/ui/atoms';
```

### 2. entities/file (파일 엔티티)

**특징**:
- ✅ 도메인 모델 (파일 관련 타입, 로직)
- ✅ Public API 제공 (barrel export 허용)
- ❌ UI 컴포넌트 없음 (순수 로직)

```tsx
// src/entities/file/model/types.ts
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

// src/entities/file/model/file-loader.ts
export async function loadFileTree(rootPath: string): Promise<FileNode[]> {
  // 파일 트리 로드 로직
}

export function findFileByPath(tree: FileNode[], path: string): FileNode | null {
  // 파일 찾기 로직
}

// src/entities/file/index.ts (Public API)
export type { FileNode } from './model/types';
export { loadFileTree, findFileByPath } from './model/file-loader';
```

**사용**:
```tsx
// ✅ Public API를 통한 import
import { FileNode, loadFileTree } from '@/entities/file';
```

### 3. features/theme-switcher (테마 전환 기능)

**특징**:
- ✅ 비즈니스 기능 (사용자 시나리오)
- ✅ UI + 로직 포함
- ✅ Public API 제공
- ✅ entities와 shared만 의존

```tsx
// src/features/theme-switcher/model/types.ts
export type Theme = 'light' | 'dark' | 'system';

// src/features/theme-switcher/model/use-theme.ts
import { useLocalStorage } from '@/shared/lib/hooks/use-local-storage';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
};

// src/features/theme-switcher/ui/ThemeSwitcher.tsx
import { useTheme } from '../model/use-theme';
import { Button } from '@/shared/ui/atoms/Button';
import { Moon, Sun } from 'lucide-react';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme}>
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
};

// src/features/theme-switcher/index.ts (Public API)
export { ThemeSwitcher } from './ui/ThemeSwitcher';
export { useTheme } from './model/use-theme';
export type { Theme } from './model/types';
```

**사용**:
```tsx
// ✅ Public API를 통한 import
import { ThemeSwitcher, useTheme } from '@/features/theme-switcher';
```

### 4. widgets/editor (코드 에디터 위젯)

**특징**:
- ✅ 복합 UI 블록 (여러 컴포넌트 조합)
- ✅ 재사용 가능
- ✅ Public API 제공
- ✅ features, entities, shared 의존 가능

```tsx
// src/widgets/editor/model/types.ts
export interface EditorTab {
  id: string;
  title: string;
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'markdown';
}

export interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
}

// src/widgets/editor/model/use-editor-state.ts
import { useState } from 'react';
import type { EditorState, EditorTab } from './types';

export const useEditorState = () => {
  const [state, setState] = useState<EditorState>({
    tabs: [],
    activeTabId: null,
  });

  const addTab = (tab: EditorTab) => {
    setState(prev => ({
      ...prev,
      tabs: [...prev.tabs, tab],
      activeTabId: tab.id,
    }));
  };

  const closeTab = (tabId: string) => {
    setState(prev => ({
      ...prev,
      tabs: prev.tabs.filter(t => t.id !== tabId),
      activeTabId: prev.activeTabId === tabId ? prev.tabs[0]?.id ?? null : prev.activeTabId,
    }));
  };

  return { state, addTab, closeTab };
};

// src/widgets/editor/ui/CodeEditor.tsx
import CodeMirror from '@uiw/react-codemirror';
import { Section } from '@/shared/ui/dsl/Section';
import type { EditorTab } from '../model/types';

interface CodeEditorProps {
  tab: EditorTab;
  onChange: (value: string) => void;
}

export const CodeEditor = ({ tab, onChange }: CodeEditorProps) => {
  return (
    <Section role="Container" className="h-full">
      <CodeMirror
        value={tab.content}
        onChange={onChange}
        height="100%"
      />
    </Section>
  );
};

// src/widgets/editor/ui/EditorTabs.tsx
import { Group } from '@/shared/ui/dsl/Group';
import { Item } from '@/shared/ui/dsl/Item';
import { X } from 'lucide-react';
import type { EditorTab } from '../model/types';

interface EditorTabsProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
}

export const EditorTabs = ({ tabs, activeTabId, onSelectTab, onCloseTab }: EditorTabsProps) => {
  return (
    <Group role="navigation" direction="horizontal" className="border-b border-border">
      {tabs.map(tab => (
        <Item
          key={tab.id}
          prominence={tab.id === activeTabId ? 1 : 2}
          onClick={() => onSelectTab(tab.id)}
          className="cursor-pointer"
        >
          <span>{tab.title}</span>
          <button onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}>
            <X size={16} />
          </button>
        </Item>
      ))}
    </Group>
  );
};

// src/widgets/editor/index.ts (Public API)
export { CodeEditor } from './ui/CodeEditor';
export { EditorTabs } from './ui/EditorTabs';
export { useEditorState } from './model/use-editor-state';
export type { EditorState, EditorTab } from './model/types';
```

**사용**:
```tsx
// ✅ Public API를 통한 import
import { CodeEditor, EditorTabs, useEditorState } from '@/widgets/editor';
```

### 5. pages/ide (IDE 페이지)

**특징**:
- ✅ 라우트 단위 페이지
- ✅ widgets, features, entities, shared 조합
- ❌ Public API 없음 (외부에서 import 안 됨)
- ❌ Barrel export 금지

```tsx
// src/pages/ide/model/use-ide-state.ts
export const useIDEState = () => {
  // 페이지 레벨 상태 관리
};

// src/pages/ide/ui/IDEPage.tsx
import { Page } from '@/shared/ui/dsl/Page';
import { Section } from '@/shared/ui/dsl/Section';
import { CodeEditor, EditorTabs, useEditorState } from '@/widgets/editor';
import { FileTree } from '@/widgets/file-tree';
import { ThemeSwitcher } from '@/features/theme-switcher';
import { CommandPalette } from '@/features/command-palette';

export const IDEPage = () => {
  const { state, addTab, closeTab } = useEditorState();

  return (
    <Page layout="full">
      {/* Header */}
      <Section role="Header">
        <ThemeSwitcher />
      </Section>

      {/* Main Content */}
      <Section role="Container" className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border">
          <FileTree onFileSelect={(file) => addTab({ /* ... */ })} />
        </aside>

        {/* Editor */}
        <main className="flex-1 flex flex-col">
          <EditorTabs
            tabs={state.tabs}
            activeTabId={state.activeTabId}
            onSelectTab={(id) => {/* ... */}}
            onCloseTab={closeTab}
          />
          {state.activeTabId && (
            <CodeEditor
              tab={state.tabs.find(t => t.id === state.activeTabId)!}
              onChange={(value) => {/* ... */}}
            />
          )}
        </main>
      </Section>

      {/* Global Features */}
      <CommandPalette />
    </Page>
  );
};
```

**사용**:
```tsx
// src/app/App.tsx
import { IDEPage } from '@/pages/ide/ui/IDEPage';

<Route path="/ide" component={IDEPage} />
```

---

## 📊 마이그레이션 우선순위

### 우선순위 매트릭스

| 작업 | 난이도 | 영향도 | 우선순위 | 예상 시간 |
|------|--------|--------|----------|-----------|
| **Phase 1**: shared 레이어 구축 | 중 | 높음 | ⭐⭐⭐ | 1-2일 |
| **Phase 2**: lib → shared/lib 이동 | 낮음 | 중간 | ⭐⭐ | 1일 |
| **Phase 3**: widgets 레이어 생성 | 중 | 높음 | ⭐⭐⭐ | 2-3일 |
| **Phase 4**: features 레이어 생성 | 중 | 중간 | ⭐⭐ | 2-3일 |
| **Phase 5**: pages 레이어 재구성 | 낮음 | 중간 | ⭐ | 1-2일 |
| **Phase 6**: entities 레이어 추가 | 높음 | 낮음 | ⭐ | 2-3일 |

### 점진적 마이그레이션 (권장)

**1단계**: shared 레이어만 먼저 구축
- components → shared/ui 이동
- Barrel export 제거
- Import 경로 수정
- **결과**: 컴포넌트 계층 정리 완료

**2단계**: widgets 추출
- 재사용 가능한 위젯 분리
- Public API 추가
- **결과**: 위젯 재사용성 향상

**3단계**: features 분리
- 비즈니스 로직 features로 이동
- **결과**: 로직 재사용성 향상

**4단계**: 나머지 레이어 (필요시)
- pages 재구성
- entities 추가

---

## 🎯 결론

### 현재 상태
- ✅ IDDL 디자인 시스템 잘 적용됨
- ✅ apps/pages/widgets 구조는 FSD와 유사
- ❌ Barrel export 혼재 (FSD 원칙 위반)
- ❌ 컴포넌트 계층 혼란 (atoms/dsl/ui)
- ❌ features 레이어 부재
- ❌ shared 폴더 미사용

### 권장 방향
1. **즉시 시작**: Phase 1 (shared 레이어 구축) - 가장 큰 효과
2. **점진적 진행**: Phase 2-3 (widgets, features)
3. **선택적**: Phase 4-6 (필요시)

### 핵심 원칙
- ✅ **Barrel Export 금지** (shared 레이어)
- ✅ **Public API 제공** (widgets, features, entities)
- ✅ **의존성 단방향** (app → pages → widgets → features → entities → shared)
- ✅ **FSD 2.1 준수**

### 기대 효과
- 🚀 빌드 시간 단축 (tree-shaking 개선)
- 🧩 모듈화 향상 (재사용성)
- 📚 가독성 개선 (명확한 계층)
- 🔧 유지보수 용이 (의존성 명확)
- 📈 확장성 향상 (새 앱/기능 추가 쉬움)

---

**작성 완료일**: 2026-01-09
**다음 단계**: Phase 1 마이그레이션 계획 수립 및 시작
