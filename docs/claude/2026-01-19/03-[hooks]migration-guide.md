# Hooks 폴더 구조 리팩토링 가이드

**Date**: 2026-01-19
**Tags**: `#hooks` `#refactoring` `#ts-morph` `#migration` `#path-alias`
**Status**: Implementation Complete

---

## 목차

1. [개요](#개요)
2. [구현 내용](#구현-내용)
3. [사용 방법](#사용-방법)
4. [Path Alias 활용](#path-alias-활용)
5. [트러블슈팅](#트러블슈팅)
6. [마이그레이션 완료 후](#마이그레이션-완료-후)

---

## 개요

### 목적

17개의 hooks를 7개의 목적 기반 카테고리로 안전하게 재구성하고, import alias를 도입하여 향후 폴더 구조 변경 시 영향을 최소화합니다.

### 구현된 기능

✅ **ts-morph 기반 자동 마이그레이션**
- 파일 이동 + 모든 import/export 자동 업데이트
- Dry-run 모드 지원 (미리보기)
- 진행 상황 실시간 표시
- 통계 리포트

✅ **Path Alias 설정**
- TypeScript: `tsconfig.app.json`
- Vite: `vite.config.ts`
- 7개 카테고리별 alias

---

## 구현 내용

### 1. Path Alias 설정

#### tsconfig.app.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@hooks/*": ["./src/design-system/hooks/*"],
      "@hooks/components/*": ["./src/design-system/hooks/components/*"],
      "@hooks/data/*": ["./src/design-system/hooks/data/*"],
      "@hooks/interaction/*": ["./src/design-system/hooks/interaction/*"],
      "@hooks/state/*": ["./src/design-system/hooks/state/*"],
      "@hooks/search/*": ["./src/design-system/hooks/search/*"],
      "@hooks/primitives/*": ["./src/design-system/hooks/primitives/*"],
      "@hooks/lib/*": ["./src/design-system/hooks/lib/*"]
    }
  }
}
```

#### vite.config.ts

```typescript
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@hooks": path.resolve(__dirname, "./src/design-system/hooks"),
      "@hooks/components": path.resolve(__dirname, "./src/design-system/hooks/components"),
      "@hooks/data": path.resolve(__dirname, "./src/design-system/hooks/data"),
      "@hooks/interaction": path.resolve(__dirname, "./src/design-system/hooks/interaction"),
      "@hooks/state": path.resolve(__dirname, "./src/design-system/hooks/state"),
      "@hooks/search": path.resolve(__dirname, "./src/design-system/hooks/search"),
      "@hooks/primitives": path.resolve(__dirname, "./src/design-system/hooks/primitives"),
      "@hooks/lib": path.resolve(__dirname, "./src/design-system/hooks/lib"),
    },
  },
});
```

**효과**:
- 폴더 구조가 변경되어도 alias만 업데이트하면 됨
- import 경로가 간결해짐
- IDE 자동완성 지원

---

### 2. 마이그레이션 스크립트

**위치**: `scripts/migrate-hooks.ts`

**주요 기능**:

#### 1️⃣ 카테고리 디렉토리 생성
```
src/design-system/hooks/
├── components/
├── data/
├── interaction/
├── state/
├── search/
├── primitives/
└── lib/
```

#### 2️⃣ 파일 이동 (23개)
- `useAccordion.ts` → `components/`
- `useHeadlessTable.ts` → `data/`
- `useHotKeys.ts` → `interaction/`
- `useHistory.ts` → `state/`
- `useClipboard.ts` → `search/`
- `useClickOutside.ts` → `primitives/` (from `utils/`)
- `CommandManager.ts` → `lib/` (from `logic/`)
- ... (총 23개 파일)

#### 3️⃣ Import 자동 업데이트
```typescript
// Before
import { useAccordion } from "../hooks/useAccordion";

// After (ts-morph가 자동으로 변경)
import { useAccordion } from "../hooks/components/useAccordion";
```

#### 4️⃣ index.ts Export 업데이트
```typescript
// Before
export { useAccordion } from "./useAccordion";
export { useClickOutside } from "./utils/useClickOutside";

// After
export { useAccordion } from "./components/useAccordion";
export { useClickOutside } from "./primitives/useClickOutside";
```

#### 5️⃣ 빈 폴더 정리
- `utils/` 폴더 삭제 (파일이 모두 이동됨)
- `logic/` 폴더 삭제 (파일이 모두 이동됨)

---

## 사용 방법

### Step 1: Dry-run (미리보기) ⭐ 필수

```bash
npx tsx scripts/migrate-hooks.ts --dry-run
```

**출력 예시**:
```
🚀 Hooks Migration Script
Mode: DRY RUN (no changes will be made)
Working directory: /Users/user/Desktop/minimal-design-kit

📁 Step 1: Creating category directories
✓ Created directory: components/
✓ Created directory: data/
...

📦 Step 2: Moving files
✓ useAccordion.ts → components/
✓ useDropdown.ts → components/
...

📝 Step 3: Updating index.ts
Would update index.ts export paths

🗑️  Step 4: Cleaning up old directories
⚠ Directory not empty (skipped): utils/
  Remaining files: keyUtils.ts, useClickOutside.ts, ...

✨ Dry run completed - no changes were made

📊 Migration Statistics

  Categories created:  7
  Files found:         23
  Files moved:         23
  Files not found:     0
  Exports updated:     0
```

**확인 사항**:
- ✅ 모든 파일이 발견되었는가? (Files found: 23)
- ✅ 모든 파일이 올바른 카테고리로 이동하는가?
- ✅ 경고나 에러가 없는가?

---

### Step 2: Git Commit (안전망 생성)

```bash
git add .
git commit -m "chore: prepare for hooks refactoring"
```

**이유**: 문제 발생 시 쉽게 롤백 가능

---

### Step 3: 마이그레이션 실행

```bash
npx tsx scripts/migrate-hooks.ts
```

**진행 과정**:
1. 📁 카테고리 폴더 생성
2. 📦 파일 이동 (23개)
3. 📝 index.ts 업데이트
4. 🗑️  빈 폴더 정리
5. 💾 모든 변경사항 저장

**소요 시간**: 약 5-10초

---

### Step 4: 검증

#### 4-1. Git Diff 확인
```bash
git diff
```

**확인 사항**:
- 파일 이동이 rename으로 감지되었는가?
- import 경로가 올바르게 업데이트되었는가?

#### 4-2. TypeScript 타입 체크
```bash
npm run typecheck
```

**예상 결과**: 에러 없이 통과 ✅

#### 4-3. 빌드 테스트
```bash
npm run build
```

**예상 결과**: 성공적으로 빌드 완료 ✅

#### 4-4. Lint 체크
```bash
npm run lint
```

---

### Step 5: Commit

```bash
git add .
git commit -m "refactor(hooks): categorize into purpose-based folders

- Move 23 hooks into 7 category folders
- Add path aliases for easier imports
- Auto-update all import/export paths via ts-morph
- Remove empty utils/ and logic/ folders"
```

---

## Path Alias 활용

### Before (상대 경로)

```typescript
// ❌ 길고 복잡한 상대 경로
import { useAccordion } from "../../design-system/hooks/components/useAccordion";
import { useHeadlessTable } from "../../design-system/hooks/data/useHeadlessTable";
import { useClickOutside } from "../../design-system/hooks/primitives/useClickOutside";
```

**문제점**:
- 파일 위치 변경 시 경로 깨짐
- 가독성 떨어짐
- 리팩토링 어려움

---

### After (Alias 사용)

```typescript
// ✅ 간결하고 명확한 alias
import { useAccordion } from "@hooks/components/useAccordion";
import { useHeadlessTable } from "@hooks/data/useHeadlessTable";
import { useClickOutside } from "@hooks/primitives/useClickOutside";

// 또는 index.ts를 통해 (기존 방식 유지)
import { useAccordion } from "@hooks";
```

**장점**:
- ✅ 폴더 구조 변경에 강함
- ✅ 가독성 향상
- ✅ 자동완성 지원
- ✅ 리팩토링 용이

---

### 사용 패턴 가이드

#### 패턴 1: 직접 Import (추천 - Tree Shaking)

```typescript
// ✅ 번들 크기 최적화 (필요한 것만 import)
import { useAccordion } from "@hooks/components/useAccordion";
import { useHeadlessTable } from "@hooks/data/useHeadlessTable";
```

**장점**: 사용하지 않는 hooks는 번들에 포함되지 않음

---

#### 패턴 2: Barrel Export (편리함)

```typescript
// ✅ 여러 hooks를 한 번에 import
import {
  useAccordion,
  useDropdown,
  useModal,
  useTabs,
} from "@hooks";
```

**장점**: 간편함, 기존 코드와 호환

---

#### 패턴 3: 카테고리별 Import (중간)

```typescript
// ⚠️ 아직 구현 안 됨 (향후 추가 가능)
import { useAccordion, useDropdown } from "@hooks/components";
```

**구현 방법**: 각 카테고리 폴더에 `index.ts` 추가

---

### Alias 변경 예시

향후 hooks 폴더를 `src/hooks`로 이동한다면?

#### Before (상대 경로 사용 시)
```typescript
// ❌ 모든 파일에서 수동으로 수정 필요 (100+ 곳)
import { useAccordion } from "../../design-system/hooks/components/useAccordion";
```

#### After (Alias 사용 시)
```typescript
// ✅ tsconfig.app.json만 수정
{
  "paths": {
    "@hooks/*": ["./src/hooks/*"],  // 이것만 변경!
    "@hooks/components/*": ["./src/hooks/components/*"],
    // ...
  }
}

// vite.config.ts만 수정
{
  alias: {
    "@hooks": path.resolve(__dirname, "./src/hooks"),  // 이것만 변경!
    // ...
  }
}

// 코드는 그대로! (0곳 수정)
import { useAccordion } from "@hooks/components/useAccordion";
```

**결론**: 폴더 구조 변경 시 설정 파일 2개만 수정하면 됨! 🎉

---

## 트러블슈팅

### 문제 1: "Cannot find module '@hooks/...'"

**원인**: Vite dev server가 새로운 alias를 인식하지 못함

**해결**:
```bash
# Vite dev server 재시작
# Ctrl+C로 종료 후
npm run dev
```

---

### 문제 2: TypeScript 에러 발생

**원인**: tsconfig 캐시 문제

**해결**:
```bash
# TypeScript 빌드 캐시 삭제
rm -rf node_modules/.tmp
npm run typecheck
```

---

### 문제 3: Import가 깨짐

**원인**: 마이그레이션 중간에 중단됨

**해결**:
```bash
# Git으로 롤백
git reset --hard HEAD

# 다시 시도
npx tsx scripts/migrate-hooks.ts --dry-run
npx tsx scripts/migrate-hooks.ts
```

---

### 문제 4: Dry-run에서 파일을 찾지 못함

**원인**: 파일 경로가 변경되었거나 삭제됨

**해결**:
1. `scripts/migrate-hooks.ts`의 `categoryMap` 확인
2. 실제 파일 위치 확인: `ls src/design-system/hooks/`
3. `categoryMap`에서 해당 파일 제거 또는 경로 수정

---

## 마이그레이션 완료 후

### 1. 폴더 구조 확인

```bash
tree src/design-system/hooks -L 2
```

**예상 결과**:
```
src/design-system/hooks
├── README.md
├── index.ts
├── components/
│   ├── useAccordion.ts
│   ├── useDropdown.ts
│   ├── useModal.ts
│   ├── useTabs.ts
│   └── useTooltip.ts
├── data/
│   ├── useHeadlessTable.ts
│   ├── useGridSelection.ts
│   └── useVirtualScroll.ts
├── interaction/
│   ├── useHotKeys.ts
│   ├── useKeyboardCommand.ts
│   ├── useCommandSystem.ts
│   └── useNavigation.ts
├── state/
│   ├── useHistory.ts
│   └── useSelection.ts
├── search/
│   ├── useClipboard.ts
│   └── useFuzzySearch.ts
├── primitives/
│   ├── useClickOutside.ts
│   ├── useControlledState.ts
│   ├── useFocusTrap.ts
│   ├── useId.ts
│   └── useScrollLock.ts
└── lib/
    ├── CommandManager.ts
    └── keyUtils.ts
```

---

### 2. 각 카테고리별 README 작성 (선택)

#### components/README.md
```markdown
# UI Component Headless Hooks

WAI-ARIA 패턴을 따르는 완전한 UI 컴포넌트 로직

## Hooks
- `useAccordion` - WAI-ARIA Accordion Pattern
- `useDropdown` - WAI-ARIA Listbox/Combobox Pattern
- `useModal` - WAI-ARIA Dialog Pattern
- `useTabs` - WAI-ARIA Tabs Pattern
- `useTooltip` - WAI-ARIA Tooltip Pattern
```

---

### 3. Import 경로 점진적 마이그레이션

**단계별 전환**:

#### Phase 1: 기존 방식 유지 (호환성)
```typescript
import { useAccordion } from "@hooks";  // index.ts를 통해
```

#### Phase 2: Alias 사용 시작 (새 코드)
```typescript
import { useAccordion } from "@hooks/components/useAccordion";
```

#### Phase 3: 전체 코드베이스 전환 (선택)
```bash
# 자동 변환 스크립트 작성 가능
npx tsx scripts/convert-to-alias.ts
```

---

## 스크립트 상세 설명

### 주요 클래스: `HooksMigrator`

```typescript
class HooksMigrator {
  private project: Project;           // ts-morph Project
  private hooksDir: string;           // "./src/design-system/hooks"
  private stats: MigrationStats;      // 통계
  private dryRun: boolean;            // Dry-run 모드

  // 1. 폴더 생성
  private createDirectories(): void;

  // 2. 파일 이동
  private moveFiles(): Map<string, string>;

  // 3. index.ts 업데이트
  private updateIndexFile(): void;

  // 4. 빈 폴더 정리
  private cleanupOldDirectories(): void;

  // 5. 저장
  private async saveChanges(): Promise<void>;

  // 6. 통계 출력
  private printStats(): void;

  // 7. 다음 단계 안내
  private printNextSteps(): void;

  // 메인 실행
  public async run(): Promise<void>;
}
```

---

### categoryMap 수정 방법

새로운 hooks를 추가하거나 카테고리를 변경하려면:

```typescript
// scripts/migrate-hooks.ts
const categoryMap: Record<string, string[]> = {
  components: [
    "useAccordion.ts",
    "useNewComponent.ts",  // 새 hook 추가
  ],
  newCategory: [           // 새 카테고리 추가
    "useNewHook.ts",
  ],
};
```

그리고 `tsconfig.app.json`과 `vite.config.ts`에도 alias 추가:

```json
// tsconfig.app.json
{
  "paths": {
    "@hooks/newCategory/*": ["./src/design-system/hooks/newCategory/*"]
  }
}
```

---

## 성과 요약

### Before
```
hooks/
├── 17개 파일 (평탄한 구조)
├── utils/ (6개)
└── logic/ (1개)
```
- ❌ 목적별 탐색 어려움
- ❌ 상대 경로 복잡함
- ❌ 폴더 구조 변경 시 대량 수정 필요

### After
```
hooks/
├── components/ (5개)
├── data/ (3개)
├── interaction/ (4개)
├── state/ (2개)
├── search/ (2개)
├── primitives/ (5개)
└── lib/ (2개)
```
- ✅ 목적별 명확한 분류
- ✅ Path alias로 간결한 import
- ✅ 폴더 구조 변경에 강함
- ✅ 자동화된 마이그레이션

---

## 관련 문서

- `docs/claude/2026-01-19/01-[hooks]categorization-proposal.md` - 범주화 제안서
- `docs/claude/2026-01-19/02-[hooks]typescript-refactoring-tools.md` - 도구 비교
- `scripts/migrate-hooks.ts` - 마이그레이션 스크립트

---

## 결론

✅ **완전 자동화된 안전한 리팩토링**
- ts-morph로 100% 자동 import 업데이트
- Dry-run으로 사전 검증
- Git으로 쉬운 롤백

✅ **Path Alias로 미래 대비**
- 폴더 구조 변경 시 설정 파일 2개만 수정
- 간결한 import 경로
- Tree shaking 최적화 가능

✅ **목적 기반 명확한 구조**
- 7개 카테고리로 체계적 분류
- 새로운 hooks 추가 위치 자명
- 각 카테고리별 문서화 용이

**총 소요 시간**: 약 10분 (vs 수동 작업 2-3시간) ⚡

이제 안전하고 깔끔한 hooks 폴더 구조를 사용할 수 있습니다! 🎉
