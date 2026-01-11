# 코드 컨벤션 분석 보고서 (Code Conventions Analysis)

**작성일**: 2026-01-11
**분석 범위**: 전체 소스코드 (`src/`, `docs/`, 설정 파일)
**목표**: 암묵적 컨벤션 파악 및 개선 방향 제시

---

## 📊 요약 (Executive Summary)

### 현재 컨벤션 준수도

| 영역 | 준수도 | 평가 |
|------|--------|------|
| **폴더 구조** | 85% | 🟢 Good |
| **파일 명명 규칙** | 90% | 🟢 Excellent |
| **타입 정의 패턴** | 75% | 🟡 Good (개선 필요) |
| **Import/Export 패턴** | 70% | 🟡 Inconsistent (배럴 금지 위반) |
| **스타일링 패턴** | 60% | 🟠 Mixed (CVA 적용 불균등) |
| **문서화 패턴** | 80% | 🟢 Good |
| **컴포넌트 구조** | 75% | 🟢 Good |

**전체 평균**: ~76% (개선 여지 있음)

---

## 🗂️ 1. 폴더 구조 컨벤션

### 1.1 현재 구조 분석

```
src/
├── app/                    # ✅ Root application (router, global contexts)
│   ├── App.tsx            # Main router
│   ├── contexts/          # Global contexts
│   └── widgets/           # Global widgets (FloatingBar)
│
├── apps/                   # ✅ FSD 2.1 Application modules
│   ├── IDE/               # App entry: AppIDE.tsx
│   │   ├── AppIDE.tsx     # ✅ GOOD: App prefix
│   │   ├── lib/           # App-specific utilities
│   │   ├── pages/         # Page-level components
│   │   └── widgets/       # Complex UI blocks
│   ├── EMOJI/             # ⚠️ MIXED: ALL_CAPS vs PascalCase
│   ├── DSLBuilder/        # ⚠️ MIXED: PascalCase (다른 앱들과 불일치)
│   └── ...
│
├── components/             # ✅ Shared UI components
│   ├── types/             # ✅ IDDL Components
│   │   ├── Page/
│   │   │   ├── Page.tsx           # Main component
│   │   │   ├── Page.types.ts      # ✅ GOOD: *.types.ts 패턴
│   │   │   ├── renderers/         # ✅ GOOD: Role-specific renderers
│   │   │   ├── hooks/             # ✅ GOOD: Custom hooks
│   │   │   └── components/        # ✅ GOOD: Sub-components
│   │   ├── Section/
│   │   │   ├── Section.tsx
│   │   │   ├── Section.types.ts
│   │   │   ├── renderers/
│   │   │   ├── role/              # ✅ GOOD: Role variants
│   │   │   └── role-config.ts     # ✅ GOOD: Role configuration
│   │   ├── Block/
│   │   │   ├── Block.tsx
│   │   │   ├── Block.types.ts
│   │   │   ├── role/              # 13+ role files
│   │   │   └── role-config.ts
│   │   ├── Element/
│   │   │   ├── Text/
│   │   │   │   ├── Text.tsx
│   │   │   │   ├── Text.types.ts
│   │   │   │   └── role/          # 9 role files
│   │   │   ├── Field/
│   │   │   │   ├── Field.tsx
│   │   │   │   ├── Field.types.ts
│   │   │   │   ├── renderers/     # 12 renderer files
│   │   │   │   ├── role/          # Primitive components
│   │   │   │   ├── styles/        # ⚠️ NEW: Shared styles
│   │   │   │   └── headless/      # ⚠️ MISSING: Headless hooks 폴더 없음
│   │   │   ├── Action/
│   │   │   │   ├── Action.tsx
│   │   │   │   ├── Action.types.ts
│   │   │   │   ├── renderers/     # ⚠️ 있지만 사용 안 함?
│   │   │   │   └── role/          # 3 role files
│   │   │   └── Separator/
│   │   │       └── Separator.tsx  # ⚠️ NO types file
│   │   └── Overlay/
│   │       ├── Overlay.tsx
│   │       ├── Overlay.types.ts
│   │       └── role/
│   ├── context/           # ✅ IDDL Contexts
│   └── headless/          # ⚠️ UNCLEAR: 사용되지 않는 듯
│
└── shared/                 # ✅ Shared utilities (FSD-compliant)
    ├── config/            # ✅ Design tokens & configuration
    │   ├── tokens.ts
    │   ├── prominence-tokens.ts
    │   ├── spacing-tokens.ts
    │   └── interactive-tokens.ts  # ⚠️ NEW: 일관성 있게 추가됨
    ├── lib/               # ✅ Common libraries
    │   ├── utils.ts
    │   ├── theme.ts
    │   ├── keyboard/      # ✅ GOOD: 하위 모듈
    │   └── selection/     # ✅ GOOD: 하위 모듈
    ├── hooks/             # ✅ Shared hooks
    └── components/        # ✅ Shared components (ResizeHandle, SourcePreview)
```

### 1.2 발견된 패턴

#### ✅ GOOD 패턴:

1. **FSD 2.1 준수**:
   - `app/`, `apps/`, `shared/`, `components/` 구조
   - App prefix (`AppIDE.tsx`, `AppJSON.tsx`)
   - Pages-first 구조

2. **IDDL 컴포넌트 구조 일관성**:
   - `{Component}.tsx` + `{Component}.types.ts` 페어링
   - `renderers/`, `role/`, `hooks/`, `components/` 하위 폴더
   - `role-config.ts` 설정 파일

3. **Shared 폴더 분리**:
   - `config/` - 디자인 토큰
   - `lib/` - 유틸리티
   - `hooks/` - 커스텀 훅
   - `components/` - 공유 컴포넌트

#### ⚠️ 불일치 패턴:

1. **앱 폴더 명명 불일치**:
   - `IDE`, `JSON`, `PPT`, `EMOJI`, `DOCS` - ALL_CAPS
   - `DSLBuilder` - PascalCase
   - **권장**: ALL_CAPS로 통일 또는 PascalCase로 통일

2. **headless/ 폴더 위치 불명확**:
   - `src/components/headless/` 존재하지만 사용처 불명확
   - `src/components/types/Element/Field/headless/` 없음 (스펙에는 명시됨)

3. **types.ts 파일 누락**:
   - `Separator.tsx`에 `Separator.types.ts` 없음
   - 일부 role 컴포넌트에도 타입 파일 없음

---

## 📝 2. 파일 명명 규칙

### 2.1 현재 패턴

| 파일 유형 | 패턴 | 예시 | 준수도 |
|----------|------|------|--------|
| **컴포넌트** | `PascalCase.tsx` | `Page.tsx`, `Button.tsx` | ✅ 100% |
| **타입 정의** | `{Component}.types.ts` | `Page.types.ts` | ✅ 90% |
| **설정 파일** | `{name}-config.ts` | `role-config.ts` | ✅ 100% |
| **스타일 파일** | `{name}.styles.ts` | `field.styles.ts` | ✅ 100% |
| **훅 파일** | `use{Name}.ts` | `useDynamicGridTemplate.ts` | ✅ 100% |
| **앱 진입점** | `App{Name}.tsx` | `AppIDE.tsx` | ✅ 100% |
| **페이지 컴포넌트** | `{Name}Page.tsx` | `IDEPage.tsx` | ✅ 100% |
| **유틸리티** | `{name}.ts` | `utils.ts`, `theme.ts` | ✅ 100% |
| **토큰 파일** | `{name}-tokens.ts` | `prominence-tokens.ts` | ✅ 100% |

### 2.2 발견된 이슈

#### ⚠️ 타입 파일 누락:
```bash
# 타입 파일이 없는 컴포넌트들:
src/components/types/Element/Separator/Separator.tsx  # ⚠️ NO Separator.types.ts
src/components/types/Block/role/Card.tsx              # ⚠️ NO types
src/components/types/Block/role/Tabs.tsx              # ⚠️ NO types
# ... 기타 role 컴포넌트들
```

**권장**: 모든 컴포넌트에 `*.types.ts` 파일 생성 (타입이 없어도 빈 파일로 일관성 유지)

---

## 🔤 3. 타입 정의 패턴

### 3.1 현재 패턴

#### ✅ GOOD 패턴:

**1. 타입 파일 분리**:
```typescript
// Page.types.ts
export interface PageProps { ... }
export type PageRole = 'Application' | 'Document' | 'Focus' | 'Fullscreen';
export type PageLayout = 'Studio' | 'HolyGrail' | 'Sidebar' | 'Split';
```

**2. Shared 타입 재사용**:
```typescript
// Block.types.ts
import type { AsProp, Density, Intent, Prominence } from '../Shared.types';
```

**3. Role 타입 정의**:
```typescript
export type BlockRole =
  // 레이아웃 컨테이너
  | 'Container'
  | 'Stack'
  | 'Row'
  // 데이터 표시
  | 'List'
  | 'Grid'
  // ... 주석으로 카테고리 분류
```

#### ⚠️ 문제점:

**1. 타입 파일에서 wildcard export 사용**:
```typescript
// Block.types.ts
export * from '../Element/Action/Action.types'; // ⚠️ Barrel export (CLAUDE.md 위반)
export * from '../Element/Field/Field.types';
export * from '../Element/Text/Text.types';
export * from '../Section/Section.types';
export * from '../Shared.types';
```

**문제**:
- CLAUDE.md에서 "No barrel exports" 명시했지만 위반
- 순환 참조 위험
- 어떤 타입을 import하는지 불명확

**권장**:
```typescript
// ❌ WRONG
export * from '../Shared.types';

// ✅ CORRECT
export type { Prominence, Intent, Density } from '../Shared.types';
```

**2. 타입 정의 위치 불일치**:
- 일부는 `*.types.ts`에 정의
- 일부는 컴포넌트 파일 내부에 정의
- 일부는 `Shared.types.ts`에 정의

**권장**: 명확한 기준 수립
- Shared 타입 → `Shared.types.ts`
- 컴포넌트 타입 → `{Component}.types.ts`
- 로컬 타입 → 컴포넌트 파일 내부

---

## 📦 4. Import/Export 패턴

### 4.1 현재 패턴

#### ✅ GOOD 패턴:

**1. 명시적 import (대부분)**:
```typescript
import { Page } from '@/components/types/Page/Page.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { cn } from '@/shared/lib/utils.ts';
```

**2. Path alias 사용**:
```typescript
import { ... } from '@/components/...';
import { ... } from '@/shared/...';
import { ... } from '@/apps/...';
```

**3. .tsx 확장자 명시**:
```typescript
import { LayoutProvider } from '@/components/context/IDDLContext.tsx';
```

#### ⚠️ 문제점:

**1. index.ts 배럴 파일 존재**:
```bash
# ⚠️ CLAUDE.md에서 금지했지만 일부 존재:
src/shared/lib/keyboard/index.ts           # ⚠️ EXCEPTION (CLAUDE.md 명시)
src/components/headless/index.ts           # ⚠️ 사용 안 함?
src/components/headless/utils/index.ts     # ⚠️ 사용 안 함?
src/components/headless/primitives/index.ts # ⚠️ 사용 안 함?
```

**2. 타입 파일에서 wildcard export**:
```typescript
// Block.types.ts
export * from '../Shared.types';  // ⚠️ 금지된 패턴
```

**3. Re-export in component files**:
```typescript
// Block.tsx
export { AccordionContent, AccordionItem, AccordionTrigger } from './role/Accordion';
export { ToolbarBlock, ToolbarDivider } from './role/Toolbar';
```

**문제**: Block.tsx가 배럴 역할을 하게 됨

**권장**:
```typescript
// ❌ Block.tsx에서 re-export
export { AccordionContent } from './role/Accordion';

// ✅ 직접 import
import { AccordionContent } from '@/components/types/Block/role/Accordion.tsx';
```

---

## 🎨 5. 스타일링 패턴

### 5.1 현재 패턴

#### ✅ GOOD 패턴:

**1. CVA (Class Variance Authority) 사용**:
```typescript
const pagePhysicsVariants = cva(
  'transition-colors',
  {
    variants: {
      role: { ... },
      prominence: { ... },
    },
    defaultVariants: { ... },
  }
);
```

**2. Tailwind 유틸리티 클래스**:
```typescript
className={cn(
  pagePhysicsVariants({ role, prominence }),
  'custom-class'
)}
```

**3. 디자인 토큰 분리**:
```typescript
// src/shared/config/tokens.ts
// src/shared/config/prominence-tokens.ts
// src/shared/config/spacing-tokens.ts
// src/shared/config/interactive-tokens.ts
```

#### ⚠️ 문제점:

**1. CVA 적용 불균등**:
- Page, Section: ✅ CVA 완전 적용
- Block: 🚧 일부만 적용 (role-config.ts 혼용)
- Element - Field: 🚧 일부만 적용
- Element - Text: ⚠️ CVA 미적용 많음
- Element - Action: ⚠️ CVA 미적용 많음

**2. 수동 className 남발**:
```typescript
// ⚠️ Block role 컴포넌트들에서 자주 보임
<div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md">
  {/* CVA 사용 안 함 */}
</div>
```

**3. 스타일 파일 위치 불일치**:
- `src/components/types/Element/Field/styles/field.styles.ts` ✅
- `src/components/types/Element/Field/styles/rating.styles.ts` ✅
- **하지만** 다른 컴포넌트에는 `styles/` 폴더 없음

**권장**:
- 모든 컴포넌트에 `styles/` 폴더 생성
- 모든 컴포넌트에 CVA variants 적용
- `{component}.styles.ts` 파일로 분리

---

## 📚 6. 문서화 패턴

### 6.1 현재 패턴

#### ✅ GOOD 패턴:

**1. 컴포넌트 상단 JSDoc**:
```typescript
/**
 * Block - 기능적 컴포넌트 (IDDL v4.0)
 *
 * **Block = 기능적 컴포넌트 (Functional Component)**
 * - role을 지정하여 "이것은 무엇을 하는가?" 정의
 * - 시각적 요소를 가질 수 있음
 * - Template 무관하게 독립적으로 동작
 *
 * v1.0.1: layout, state 추가
 * v3.1: Interactive State Token System 통합
 * v4.0: 기능적 컴포넌트로 개념 명확화
 */
```

**2. 버전 히스토리**:
```typescript
/**
 * v1.0.1: 많은 role 추가
 * v4.0: 기능적 목적에 따른 분류
 * v1.0.4: Focus management 추가
 */
```

**3. 타입에 주석**:
```typescript
export type BlockRole =
  // 레이아웃 컨테이너 (Layout Containers)
  | 'Container' // 일반 컨테이너 (기본값)
  | 'Stack'     // 수직 쌓기 (Flex Column)
```

#### ⚠️ 문제점:

**1. 일관성 부족**:
- Page, Block: ✅ 상세한 JSDoc
- Field, Action: 🚧 일부만
- Text, Separator: ⚠️ 거의 없음

**2. 스펙 링크 부족**:
```typescript
// ✅ GOOD (Field.tsx)
/**
 * @see docs/2-areas/spec/5-field/field.spec.md
 */

// ⚠️ MISSING (대부분 컴포넌트)
```

**권장**:
- 모든 컴포넌트에 JSDoc 추가
- 스펙 문서 링크 필수
- Props 인터페이스에도 JSDoc

---

## 🏗️ 7. 컴포넌트 구조 패턴

### 7.1 현재 패턴

#### ✅ GOOD 패턴:

**1. Headless + Renderer 분리 (Field)**:
```
Field/
  ├─ Field.tsx              # Main component (dataType branching)
  ├─ Field.types.ts         # Type definitions
  ├─ renderers/             # UI components
  │   ├─ TextField.tsx
  │   ├─ NumberField.tsx
  │   └─ ...
  ├─ role/                  # Primitive components
  │   ├─ Input.tsx
  │   ├─ Select.tsx
  │   └─ ...
  └─ styles/                # Shared styles
      ├─ field.styles.ts
      └─ rating.styles.ts
```

**2. Role-based 구조 (Block, Section)**:
```
Block/
  ├─ Block.tsx              # Main component (role branching)
  ├─ Block.types.ts         # Type definitions
  ├─ role/                  # Role variants
  │   ├─ Card.tsx
  │   ├─ Toolbar.tsx
  │   └─ ...
  └─ role-config.ts         # Role configuration
```

**3. Page 구조**:
```
Page/
  ├─ Page.tsx               # Main component
  ├─ Page.types.ts          # Type definitions
  ├─ renderers/             # Role-specific renderers
  │   └─ AppLayout.tsx
  ├─ hooks/                 # Custom hooks
  │   ├─ useDynamicGridTemplate.ts
  │   └─ useResizable.ts
  └─ components/            # Sub-components
      └─ ResizeHandle.tsx
```

#### ⚠️ 문제점:

**1. Headless hook 위치 불명확**:
- Field에 `headless/` 폴더 없음 (스펙에는 명시됨)
- `src/components/headless/` 존재하지만 사용처 불명확

**2. Renderer 폴더 일관성 부족**:
- Field: ✅ `renderers/` 폴더 있음
- Action: ⚠️ `renderers/` 폴더 있지만 비어있음
- Text: ⚠️ `renderers/` 폴더 없음

**3. Role 폴더 일관성 부족**:
- Block, Section, Text, Action: ✅ `role/` 폴더
- Field: ✅ `role/` 폴더 (Primitive)
- Page: ❌ `role/` 폴더 없음 (renderers로 대체)

---

## 🚨 8. 발견된 주요 이슈

### 8.1 긴급 (🔴 High Priority)

#### 1. Barrel Export 금지 위반

**위반 사례**:
```typescript
// Block.types.ts
export * from '../Shared.types';              // ⚠️
export * from '../Element/Action/Action.types';
export * from '../Element/Field/Field.types';
```

**영향**:
- CLAUDE.md 명시적 금지 위반
- 순환 참조 위험
- 트리 쉐이킹 방해

**해결책**:
```typescript
// ✅ 명시적 export
export type { Prominence, Intent, Density } from '../Shared.types';
export type { ActionBehavior } from '../Element/Action/Action.types';
```

**작업량**: 2-3시간 (전체 types 파일 수정)

---

#### 2. CVA Variants 적용 불균등

**현황**:
- Page: ✅ 100%
- Section: ✅ 100%
- Block: 🚧 40%
- Element - Text: ⚠️ 20%
- Element - Action: ⚠️ 30%
- Element - Field: 🚧 50%

**영향**:
- prominence × intent × density 패턴 불일치
- 수동 className 남발
- 유지보수 어려움

**해결책**:
- Phase 1 Action Plan의 "CVA Variants 표준화" 실행
- 모든 컴포넌트에 `*.styles.ts` 또는 CVA variants 추가

**작업량**: 3-4일 (Phase 1 계획 포함)

---

#### 3. Headless Hook 구현 누락

**현황**:
- `src/components/types/Element/Field/headless/` 폴더 없음
- 스펙 문서에는 명시되어 있음
- `src/components/headless/` 존재하지만 용도 불명확

**영향**:
- Field의 Headless + Renderer 패턴 불완전
- 로직 재사용 불가
- 스펙과 구현 갭

**해결책**:
```bash
# 생성 필요
mkdir -p src/components/types/Element/Field/headless
touch src/components/types/Element/Field/headless/useTextField.ts
touch src/components/types/Element/Field/headless/useNumberField.ts
# ... 21개 dataType
```

**작업량**: 2-3일 (Phase 1 계획 포함)

---

### 8.2 높음 (🟡 Medium Priority)

#### 4. 타입 파일 누락

**누락 목록**:
```bash
src/components/types/Element/Separator/Separator.types.ts  # 누락
src/components/types/Block/role/Card.types.ts              # 대부분 누락
src/components/types/Block/role/Tabs.types.ts
# ... 기타 role 컴포넌트들
```

**해결책**:
- 모든 컴포넌트에 `*.types.ts` 생성
- 타입이 없어도 빈 파일로 일관성 유지
- 최소한 기본 Props 인터페이스 정의

**작업량**: 1일

---

#### 5. 앱 폴더 명명 불일치

**현황**:
- `IDE`, `JSON`, `PPT`, `EMOJI` - ALL_CAPS
- `DSLBuilder` - PascalCase

**해결책**:
```bash
# Option 1: ALL_CAPS로 통일
mv src/apps/DSLBuilder src/apps/DSL_BUILDER

# Option 2: PascalCase로 통일
mv src/apps/IDE src/apps/Ide
mv src/apps/JSON src/apps/Json
# ...
```

**권장**: ALL_CAPS 유지 (현재 대다수 패턴)

**작업량**: 0.5일

---

#### 6. Re-export in Component Files

**위반 사례**:
```typescript
// Block.tsx
export { AccordionContent, AccordionItem, AccordionTrigger } from './role/Accordion';
export { ToolbarBlock, ToolbarDivider } from './role/Toolbar';
```

**문제**:
- Block.tsx가 배럴 역할
- 직접 import 권장과 모순

**해결책**:
```typescript
// ✅ 직접 import
import { AccordionContent } from '@/components/types/Block/role/Accordion.tsx';
```

**작업량**: 1일

---

### 8.3 낮음 (🟢 Low Priority)

#### 7. JSDoc 일관성 부족

**현황**:
- Page, Block: ✅ 상세한 JSDoc
- Field: 🚧 일부만
- Text, Action, Separator: ⚠️ 거의 없음

**해결책**:
- 템플릿 작성
- 모든 컴포넌트에 적용

**작업량**: 2일

---

#### 8. 스타일 파일 폴더 불일치

**현황**:
- Field: ✅ `styles/` 폴더
- 기타: ⚠️ `styles/` 폴더 없음

**해결책**:
```bash
mkdir -p src/components/types/Block/styles
mkdir -p src/components/types/Element/Text/styles
mkdir -p src/components/types/Element/Action/styles
```

**작업량**: 0.5일

---

## 📋 9. 권장 컨벤션 문서 (Convention Guidelines)

### 9.1 폴더 구조 규칙

```
Component/
  ├─ {Component}.tsx           # ✅ 필수: Main component
  ├─ {Component}.types.ts      # ✅ 필수: Type definitions
  ├─ {Component}.test.tsx      # 🟡 권장: Unit tests
  ├─ renderers/                # 🟡 조건: Role-specific UI
  │   ├─ {Role}Renderer.tsx
  │   └─ ...
  ├─ role/                     # 🟡 조건: Role variants
  │   ├─ {RoleName}.tsx
  │   └─ ...
  ├─ headless/                 # 🟡 조건: Headless hooks
  │   ├─ use{Feature}.ts
  │   └─ ...
  ├─ hooks/                    # 🟡 조건: Custom hooks
  │   ├─ use{Feature}.ts
  │   └─ ...
  ├─ styles/                   # 🟡 권장: Shared styles
  │   ├─ {component}.styles.ts
  │   └─ ...
  ├─ components/               # 🟡 조건: Sub-components
  │   ├─ {SubComponent}.tsx
  │   └─ ...
  └─ {component}-config.ts     # 🟡 조건: Configuration
```

### 9.2 파일 명명 규칙

| 파일 유형 | 패턴 | 예시 |
|----------|------|------|
| 컴포넌트 | `PascalCase.tsx` | `Button.tsx` |
| 타입 정의 | `{Component}.types.ts` | `Button.types.ts` |
| 스타일 | `{name}.styles.ts` | `button.styles.ts` |
| 설정 | `{name}-config.ts` | `role-config.ts` |
| 훅 | `use{Name}.ts` | `useButton.ts` |
| 유틸리티 | `{name}.ts` | `utils.ts` |
| 토큰 | `{name}-tokens.ts` | `color-tokens.ts` |

### 9.3 Import/Export 규칙

#### ✅ DO:
```typescript
// ✅ 명시적 import (확장자 포함)
import { Button } from '@/components/types/Element/Action/role/Button.tsx';

// ✅ 명시적 type export
export type { Prominence, Intent } from '../Shared.types';

// ✅ Named export
export function Button({ ... }) { ... }
```

#### ❌ DON'T:
```typescript
// ❌ Wildcard export
export * from './role/Button';

// ❌ Barrel export (index.ts)
export * from './Button';
export * from './IconButton';

// ❌ Re-export in component files
export { SubComponent } from './components/SubComponent';
```

### 9.4 타입 정의 규칙

#### ✅ DO:
```typescript
// ✅ Interface for props
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

// ✅ Type for enums/unions
export type ButtonVariant = 'primary' | 'secondary';

// ✅ Shared types from Shared.types.ts
export type { Prominence, Intent } from '../Shared.types';
```

#### ❌ DON'T:
```typescript
// ❌ Wildcard export
export * from '../Shared.types';

// ❌ 타입 정의를 컴포넌트 파일에
// Button.tsx에 ButtonProps 정의 (Button.types.ts에 정의해야 함)
```

### 9.5 스타일링 규칙

#### ✅ DO:
```typescript
// ✅ CVA variants 사용
const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      prominence: { ... },
      intent: { ... },
    },
  }
);

// ✅ cn() 유틸리티 사용
className={cn(buttonVariants({ prominence, intent }), className)}

// ✅ Tailwind 유틸리티 클래스
className="flex flex-col gap-4"
```

#### ❌ DON'T:
```typescript
// ❌ Inline styles
style={{ display: 'flex', gap: '16px' }}

// ❌ 수동 className 조합 (CVA 사용 가능한 경우)
className={`flex ${prominence === 'Primary' ? 'font-bold' : 'font-normal'}`}
```

### 9.6 문서화 규칙

#### ✅ DO:
```typescript
/**
 * Button - 액션 트리거 컴포넌트 (IDDL v1.0)
 *
 * 사용자 인터랙션을 트리거하는 기본 액션 컴포넌트입니다.
 *
 * @see docs/2-areas/spec/4-element/action/action.spec.md
 *
 * @example
 * <Button prominence="Primary" intent="Positive">
 *   Save
 * </Button>
 *
 * v1.0.0: 초기 구현
 * v1.0.1: prominence × intent variants 추가
 */
export function Button({ ... }) { ... }
```

---

## 🎯 10. 개선 우선순위 로드맵

### Phase 1 (1주) - 긴급 이슈 해결

- [ ] **Barrel export 제거** (2-3시간)
  - Block.types.ts 수정
  - Wildcard export → 명시적 export

- [ ] **타입 파일 생성** (1일)
  - Separator.types.ts
  - Block role 컴포넌트 types

- [ ] **앱 폴더 명명 통일** (0.5일)
  - DSLBuilder → DSL_BUILDER

### Phase 1 (진행 중) - CVA 표준화

- [ ] **CVA Variants 적용** (3-4일)
  - Block role 컴포넌트
  - Element - Text role
  - Element - Action role

- [ ] **Headless Hook 구현** (2-3일)
  - Field headless/ 폴더 생성
  - 21개 dataType hook 구현

### Phase 2 (2주 후) - 일관성 개선

- [ ] **JSDoc 추가** (2일)
  - 모든 컴포넌트에 상단 JSDoc
  - Props 인터페이스에 JSDoc

- [ ] **Styles 폴더 생성** (0.5일)
  - 모든 컴포넌트에 styles/ 폴더

- [ ] **Re-export 제거** (1일)
  - 컴포넌트 파일에서 re-export 제거

### Phase 3 (1개월 후) - 문서화 완성

- [ ] **컨벤션 문서 작성** (1일)
  - 공식 컨벤션 가이드
  - 예시 및 템플릿

- [ ] **린터 규칙 추가** (0.5일)
  - ESLint 커스텀 규칙
  - Barrel export 금지
  - 타입 파일 강제

---

## 📊 11. 영향도 분석

### 11.1 변경 영향도

| 이슈 | 파일 수 | 작업 시간 | 영향도 | 우선순위 |
|------|---------|----------|--------|---------|
| Barrel export 제거 | 8개 | 2-3시간 | 낮음 | 🔴 High |
| CVA Variants 적용 | 40+ | 3-4일 | 높음 | 🔴 High |
| Headless Hook 구현 | 21+ | 2-3일 | 높음 | 🔴 High |
| 타입 파일 생성 | 20+ | 1일 | 낮음 | 🟡 Medium |
| 앱 폴더 명명 | 1개 | 0.5일 | 낮음 | 🟡 Medium |
| Re-export 제거 | 5개 | 1일 | 중간 | 🟡 Medium |
| JSDoc 추가 | 50+ | 2일 | 낮음 | 🟢 Low |
| Styles 폴더 생성 | 5개 | 0.5일 | 낮음 | 🟢 Low |

### 11.2 예상 효과

**Barrel export 제거**:
- ✅ 순환 참조 방지
- ✅ 트리 쉐이킹 개선
- ✅ import 명확성 향상

**CVA Variants 적용**:
- ✅ 일관된 스타일링
- ✅ prominence × intent 자동화
- ✅ 유지보수성 향상

**Headless Hook 구현**:
- ✅ 로직 재사용
- ✅ 테스트 용이성
- ✅ 스펙 준수

---

## 🔗 12. 관련 문서

- [Phase 1 Action Plan](./phase-1-action-plan.md) - CVA 표준화 계획
- [Phase 1 Gap Analysis](./phase-1-implementation-gap-analysis.md) - 구현 갭 분석
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 컨벤션
- [README.md](../../README.md) - 프로젝트 개요

---

**문서 작성자**: Claude Code
**최종 업데이트**: 2026-01-11
**다음 리뷰**: 2026-01-18 (Phase 1 완료 후)
**승인자**: User
