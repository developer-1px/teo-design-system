# 주목도 시스템 (Prominence System)

**디자인을 못하는 사람을 위한 Design 시스템**

## 핵심 개념

### 문제 정의

기존 디자인 시스템의 문제점:
- 개발자가 "디자인적 고민"을 해야 함
- 같은 레벨에서 컨텐츠를 어떻게 구분할지 매번 결정해야 함
- 텍스트 색상, 폰트 크기, 여백 등을 일일이 지정해야 함

### 해결 방법

**주목도(Prominence)를 공식화**하여:
- 개발자는 **그룹화(Layout depth) + 주목도(prominence)**만 지정
- 부모 Layout의 depth에 따라 주목도별 스타일이 **자동으로 결정**됨
- 디자인 고민 없이 일관된 UI 구현 가능

## 주목도 레벨

3단계 주목도 시스템:

| 레벨 | 용도 | 예시 |
|------|------|------|
| **primary** | 가장 중요한 내용 | 제목, 핵심 정보, 주요 액션 |
| **secondary** | 보조 내용 | 설명, 부가 정보, 일반 텍스트 |
| **tertiary** | 덜 중요한 내용 | 메타 정보, 추가 설명, 힌트 |

## 수학적 공식

### 1. 텍스트 투명도

```typescript
primary:   100%  // 가장 선명
secondary:  70%  // 보조 정보
tertiary:   50%  // 덜 중요
```

### 2. 폰트 Weight

```typescript
primary:   600  // semibold
secondary: 500  // medium
tertiary:  400  // normal
```

### 3. 폰트 크기 배율

```typescript
primary:   100%   // 기본 크기
secondary: 87.5%  // 약간 작게
tertiary:  75%    // 더 작게
```

### 4. 배경 강도 (depth에 따라 달라짐)

```typescript
공식: baseIntensity + (depth × depthMultiplier)

primary:
  - base: 2%
  - depthMultiplier: 1.5%
  - 예: depth 0 → 2%, depth 3 → 6.5%

secondary:
  - base: 1%
  - depthMultiplier: 0.8%
  - 예: depth 0 → 1%, depth 3 → 3.4%

tertiary:
  - base: 0%
  - depthMultiplier: 0%
  - 항상 투명
```

### 5. 여백 배율

```typescript
primary:   100%  // 표준 여백
secondary:  75%  // 조금 줄어듦
tertiary:   50%  // 더 줄어듦
```

### 6. 라인 높이

```typescript
primary:   1.5  // 여유 있는 행간
secondary: 1.4  // 표준 행간
tertiary:  1.3  // 좁은 행간
```

## 사용 방법

### 기본 사용법

```tsx
import { Layout } from '@/components/ui/Layout';
import { Content } from '@/components/ui/Content';

function MyComponent() {
  return (
    <Layout depth={2}>
      <Content prominence="primary">
        <h2>제목 - 가장 중요한 정보</h2>
      </Content>

      <Content prominence="secondary">
        <p>설명 - 보조 정보</p>
      </Content>

      <Content prominence="tertiary">
        <span>마지막 수정: 2025-01-08</span>
      </Content>
    </Layout>
  );
}
```

### Depth별 차이

같은 prominence라도 depth에 따라 다르게 렌더링됩니다:

```tsx
// Depth 0 (App base)
<Layout depth={0}>
  <Content prominence="primary">
    배경: 2%, 투명도: 100%, weight: 600
  </Content>
</Layout>

// Depth 3 (Primary surface)
<Layout depth={3}>
  <Content prominence="primary">
    배경: 6.5%, 투명도: 100%, weight: 600
  </Content>
</Layout>
```

**깊이가 증가할수록 배경 강도가 증가**하여 시각적 계층 구조를 자동으로 표현합니다.

### ContentGroup으로 그룹화

여러 Content를 간격을 두고 배치:

```tsx
import { ContentGroup } from '@/components/ui/Content';

<Layout depth={2}>
  <ContentGroup gap={12}>
    <Content prominence="primary">제목</Content>
    <Content prominence="secondary">설명</Content>
    <Content prominence="tertiary">메타 정보</Content>
  </ContentGroup>
</Layout>
```

## 실전 예시

### Before (디자인 고민 필요)

```tsx
// ❌ 개발자가 일일이 스타일 결정
<div className="p-4 bg-white">
  <h2 className="text-lg font-semibold text-gray-900">
    제목
  </h2>
  <p className="text-sm text-gray-600 mt-2">
    설명
  </p>
  <span className="text-xs text-gray-400 mt-1">
    메타 정보
  </span>
</div>
```

### After (주목도만 지정)

```tsx
// ✅ prominence만 지정하면 자동 스타일링
<Layout depth={2}>
  <ContentGroup gap={8}>
    <Content prominence="primary">
      <h2>제목</h2>
    </Content>
    <Content prominence="secondary">
      <p>설명</p>
    </Content>
    <Content prominence="tertiary">
      <span>메타 정보</span>
    </Content>
  </ContentGroup>
</Layout>
```

## 디자인 원칙

### 1. 분리의 원칙

같은 차원(depth)에서는 **컨텐츠가 분리**되어야 합니다:

```tsx
// ✅ 올바른 분리
<Layout depth={2}>
  <Content prominence="primary">섹션 A</Content>
  <Content prominence="primary">섹션 B</Content>
</Layout>

// ❌ 분리되지 않은 컨텐츠
<Layout depth={2}>
  섹션 A 섹션 B  {/* prominence 구분 없음 */}
</Layout>
```

### 2. 주목도의 역할

분리가 되지 않는 지점에서는 **주목도를 달리**하여 구분:

```tsx
<Layout depth={2}>
  {/* 같은 공간에 있지만 주목도로 구분 */}
  <div className="flex items-baseline gap-2">
    <Content prominence="primary">
      <h3>제목</h3>
    </Content>
    <Content prominence="tertiary">
      <span>부제목</span>
    </Content>
  </div>
</Layout>
```

### 3. Depth와 주목도의 조합

- **Depth**: 물리적 계층 구조 (0-6)
- **Prominence**: 같은 depth 내에서의 중요도 (primary/secondary/tertiary)

```tsx
<Layout depth={2}>  {/* 사이드바 */}
  <Content prominence="primary">중요한 링크</Content>
  <Content prominence="secondary">일반 링크</Content>

  <Layout depth={3}>  {/* 사이드바 내부 패널 */}
    <Content prominence="primary">패널 제목</Content>
    <Content prominence="secondary">패널 내용</Content>
  </Layout>
</Layout>
```

## 기술적 구현

### Context 기반 자동 적용

Layout이 자동으로 depth를 Context로 전파:

```tsx
// Layout.tsx
<ProminenceProvider value={{ depth }}>
  <div data-layout-depth={depth}>
    {children}
  </div>
</ProminenceProvider>

// Content.tsx
const { depth } = useProminence();  // 부모의 depth 자동 참조
const styles = calculateProminenceStyles(depth, prominence);
```

### TypeScript 타입 안전성

```typescript
// prominence는 3가지 값만 허용
type ProminenceLevel = 'primary' | 'secondary' | 'tertiary';

// Content는 Layout 내부에서만 사용 가능 (useProminence가 체크)
function Content({ prominence }: { prominence?: ProminenceLevel }) {
  const { depth } = useProminence();  // Layout 밖이면 에러
  // ...
}
```

## 마이그레이션 가이드

### 1단계: Layout으로 그룹화

```tsx
// Before
<div className="p-4">
  <h2>제목</h2>
  <p>내용</p>
</div>

// After
<Layout depth={2} className="p-4">
  <h2>제목</h2>
  <p>내용</p>
</Layout>
```

### 2단계: Content로 주목도 지정

```tsx
// Before
<Layout depth={2} className="p-4">
  <h2 className="font-semibold">제목</h2>
  <p className="text-sm text-gray-600">내용</p>
</Layout>

// After
<Layout depth={2} className="p-4">
  <Content prominence="primary">
    <h2>제목</h2>
  </Content>
  <Content prominence="secondary">
    <p>내용</p>
  </Content>
</Layout>
```

### 3단계: 불필요한 스타일 제거

```tsx
// Before
<Content prominence="primary">
  <h2 className="text-lg font-semibold text-gray-900">
    제목
  </h2>
</Content>

// After (prominence가 이미 처리함)
<Content prominence="primary">
  <h2>제목</h2>
</Content>
```

## 요약

### 개발자가 해야 할 일

1. **Layout으로 그룹화** (depth 지정)
2. **Content로 주목도 지정** (prominence 지정)

### 시스템이 자동으로 하는 일

1. depth × prominence 조합으로 스타일 계산
2. 텍스트 색상, 폰트 크기, 여백 등 자동 적용
3. 일관된 시각적 계층 구조 유지

**디자인 고민 없이 prominence만 지정하면 끝!**
