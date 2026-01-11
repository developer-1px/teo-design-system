# IDDL Spec Violations - Cleanup Report

**작성일**: 2026-01-11
**목적**: IDDL 명세를 위반하는 불필요한 props 및 패턴 제거

---

## 🚨 핵심 IDDL 원칙 (위반 금지)

### 1. Canonical Props만 사용
- **허용**: `role`, `prominence`, `intent`, `density`, `spec`, `name`, `description`, `label`, `content`
- **금지**: 표현 속성 직접 지정 (`size`, `padding`, `gap`, `color`, `variant` 등)

### 2. 자동 결정 시스템
```
prominence × intent × density × state → className (자동 생성)
```

### 3. Role-specific Props는 spec으로 통합
- `spec` 객체 안에 role-dependent 파라미터 모아야 함
- 개별 props로 분산 금지

---

## 📋 발견된 위반 사항

### 1. Block.types.ts - Layout Helpers (심각)

**위치**: `src/components/types/Block/Block.types.ts:202-210`

**위반 코드**:
```typescript
// Layout Helpers (Practical)
padding?: string;      // ❌ density로 자동 결정
justify?: string;      // ❌ role에서 자동 결정
align?: string;        // ❌ role에서 자동 결정
flex?: string | number; // ❌ role에서 자동 결정
divider?: string;      // ❌ spec로 이동
width?: string | number; // ❌ 픽셀값 직접 지정 금지
height?: string | number; // ❌ 픽셀값 직접 지정 금지
orientation?: 'horizontal' | 'vertical'; // ❌ role에서 결정
```

**문제**:
- 표현 속성을 직접 props로 노출
- IDDL의 선언적 의도 시스템 우회

**해결책**:
1. 모두 제거
2. 필요 시 `spec` 객체로 이동
3. 대부분은 `role × prominence × density`로 자동 결정되도록 수정

**영향도**: 🔴 High (전체 Block 사용처 수정 필요)

---

### 2. Block.types.ts - layout prop

**위치**: `src/components/types/Block/Block.types.ts:158`

**위반 코드**:
```typescript
layout?: Layout; // v1.0.1
```

**문제**:
- `role`이 layout을 자동으로 결정해야 하는데 override 가능하게 노출

**해결책**:
1. Deprecated 처리 후 제거
2. role-config에서 자동 결정되도록 수정

**영향도**: 🟡 Medium

---

### 3. Block.types.ts - gap prop

**위치**: `src/components/types/Block/Block.types.ts:171`

**위반 코드**:
```typescript
gap?: number | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
```

**문제**:
- 간격은 `density`로 자동 결정되어야 함
- 직접 픽셀값 또는 크기 지정 금지

**해결책**:
1. 제거
2. `density` prop으로 자동 계산
3. 특수한 경우 `spec.gap` 사용

**영향도**: 🟡 Medium

---

### 4. Block.types.ts - Role-specific Props 과다

**위치**: `src/components/types/Block/Block.types.ts:186-218`

**위반 코드**:
```typescript
// Toolbar-specific props (v4.1)
sticky?: boolean;
border?: 'top' | 'bottom' | 'both' | 'none';

// Accordion-specific props (v4.0)
mode?: 'single' | 'multiple';
defaultValue?: string | string[];
accordionValue?: string | string[];
onValueChange?: (value: string | string[]) => void;

// SortableList-specific props (v4.0)
items?: any[];
onReorder?: (items: any[]) => void;
renderItem?: (item: any, index: number) => ReactNode;

// Tree-specific props (v4.1)
data?: any[];
icons?: Record<string, string>;
onNodeClick?: (node: any) => void;
expandable?: boolean;
selectable?: boolean;
defaultExpandedIds?: string[];
```

**문제**:
- Role-specific props가 BlockProps에 직접 노출됨
- Props 폭발 (조합 복잡도 증가)
- IDDL 명세의 `spec` 패턴 위반

**해결책**:
모두 `spec` 객체로 통합:

```typescript
// ❌ Before
<Block role="Toolbar" sticky={true} border="bottom" />
<Block role="Accordion" mode="single" defaultValue="item1" />

// ✅ After
<Block role="Toolbar" spec={{ sticky: true, border: 'bottom' }} />
<Block role="Accordion" spec={{ mode: 'single', defaultValue: 'item1' }} />
```

**타입 정의**:
```typescript
export interface BlockProps extends AsProp {
  role?: BlockRole;
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  children?: ReactNode;
  spec?: BlockSpec; // Role-dependent parameters
  // ... 기타 핵심 props만
}

export type BlockSpec =
  | { role: 'Toolbar'; sticky?: boolean; border?: 'top' | 'bottom' | 'both' | 'none' }
  | { role: 'Accordion'; mode?: 'single' | 'multiple'; defaultValue?: string | string[] }
  | { role: 'SortableList'; items?: any[]; onReorder?: (items: any[]) => void }
  | { role: 'Tree'; data?: any[]; icons?: Record<string, string>; onNodeClick?: (node: any) => void }
  // ... 기타 role-specific specs
  | { role?: undefined }; // Default
```

**영향도**: 🔴 High (대규모 리팩토링 필요)

---

### 5. Action.types.ts - size prop

**위치**: `src/components/types/Element/Action/Action.types.ts:79`

**위반 코드**:
```typescript
size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
```

**문제**:
- 크기는 `prominence × density`로 자동 결정되어야 함
- 별도 size prop 존재는 IDDL 명세 위반

**해결책**:
1. 제거
2. prominence와 density 조합으로 대체

```typescript
// ❌ Before
<Action size="sm" />

// ✅ After
<Action prominence="Secondary" density="Compact" />
```

**영향도**: 🟡 Medium

---

## 🔧 수정 계획

### Phase 1: Deprecated 처리 (Breaking Changes 방지)
```typescript
// Block.types.ts
export interface BlockProps extends AsProp {
  // ... 핵심 props

  /**
   * @deprecated Use prominence × density instead
   * Will be removed in v2.0
   */
  gap?: number | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

  /**
   * @deprecated Use spec object instead
   * Will be removed in v2.0
   */
  padding?: string;
  // ... 기타 deprecated props
}
```

### Phase 2: spec 통합 (Role-specific Props)
1. BlockSpec 타입 정의 (discriminated union)
2. 기존 props → spec 마이그레이션 유틸 작성
3. 사용처 단계적 수정

### Phase 3: 완전 제거
1. Deprecated props 완전 제거
2. 타입 클린업
3. 문서 업데이트

---

## 📊 우선순위

| 항목 | 영향도 | 긴급도 | 작업량 | 우선순위 |
|------|--------|--------|--------|----------|
| Layout Helpers 제거 | 🔴 High | 🟡 Medium | Large | **P1** |
| Role-specific Props → spec | 🔴 High | 🟡 Medium | Large | **P1** |
| Action size 제거 | 🟡 Medium | 🟢 Low | Small | **P2** |
| Block layout 제거 | 🟡 Medium | 🟢 Low | Medium | **P2** |
| Block gap 제거 | 🟡 Medium | 🟢 Low | Medium | **P2** |

---

## 🎯 기대 효과

### 1. 타입 안전성 향상
- Props 수 감소 → 조합 복잡도 감소
- Discriminated union으로 타입 추론 개선

### 2. IDDL 명세 준수
- Canonical Props만 사용
- 의도 기반 선언 강제

### 3. 유지보수성 향상
- Role-specific props가 spec로 격리됨
- 새로운 role 추가 시 기존 BlockProps 수정 불필요

### 4. DX (Developer Experience) 개선
- 명확한 의도 표현
- 자동 완성 개선 (spec 내부에서 role별 타입 추론)

---

## 📝 다음 단계

1. **Deprecated 처리** (Breaking Change 방지)
   - 모든 위반 props에 `@deprecated` 주석 추가
   - 콘솔 경고 메시지 추가

2. **spec 시스템 구현**
   - BlockSpec 타입 정의 (discriminated union)
   - ActionSpec 타입 정의
   - 기존 props → spec 자동 변환 유틸

3. **사용처 마이그레이션**
   - Codemod 스크립트 작성 (가능한 경우)
   - 수동 수정 가이드 작성

4. **문서 업데이트**
   - IDDL 명세 준수 가이드
   - 마이그레이션 가이드
   - spec 패턴 Best Practices

5. **완전 제거** (v2.0)
   - Deprecated props 제거
   - 타입 클린업
   - 성능 최적화

---

**최종 업데이트**: 2026-01-11
**담당**: AI Assistant
**리뷰 필요**: Yes
