# IDDL Minimal Design Renderer 요구사항

**작성일**: 2026-01-09
**작성자**: DOCS 앱 개발팀
**우선순위**: Medium

---

## 요약

DOCS 앱을 순수 IDDL로 재구성하면서 발견한 IDDL 렌더러의 개선 필요 사항들을 정리합니다. 대부분 role 기반 기본 스타일 제공과 관련된 요구사항입니다.

---

## 1. Field 컴포넌트 - Clearable 기능

### 현재 문제
- `Field` 컴포넌트에 검색 입력 등에 필요한 clear 버튼 기능이 없음
- 현재는 `<input>` 태그를 직접 사용해야 함

### 요구사항
```tsx
<Field
  label="검색"
  model="searchQuery"
  dataType="text"
  placeholder="문서 검색..."
  clearable={true}  // 👈 이 기능 추가 필요
/>
```

### 기대 동작
- `clearable={true}` 시 입력 필드 오른쪽에 X 버튼 표시
- 버튼 클릭 시 필드 값을 빈 문자열로 초기화
- 값이 없을 때는 X 버튼 숨김

### 우선순위
**High** - 검색 UI는 매우 일반적인 패턴

### 구현 상태
✅ **완료** (v1.0.2 - 2026-01-09)
- `FieldProps`에 `clearable?: boolean` 추가
- text, password, email, url, phone 타입에서 동작
- 입력 값이 있을 때만 clear 버튼 표시
- X 아이콘 클릭 시 값 초기화
- 파일 위치: `src/components/dsl/Field.tsx`, `src/components/dsl/types.ts`
- 스펙 업데이트: `spec/iddl-spec-1.0.1.md`

---

## 2. Section 컴포넌트 - Role별 자동 레이아웃

### 현재 문제
- `Section[role="Navigator"]`가 사이드바로 동작하려면 `className="flex flex-col"` 필요
- `Section[role="Container"]`가 flex 레이아웃을 가지려면 `className="flex"` 필요
- 레이아웃을 위해 className override가 과도하게 필요함

### 요구사항

#### Navigator Role 개선
```tsx
// 현재 (className 필요)
<Section role="Navigator" className="flex flex-col">

// 기대 (자동 적용)
<Section role="Navigator">
  {/* 자동으로 flex-col, 고정 너비, border-right 적용 */}
</Section>
```

**제안 기본 스타일**:
- `display: flex; flex-direction: column;`
- `width: 18rem` (w-72, 288px)
- `border-right: 1px solid var(--color-border-default)`
- `overflow-y: auto`

#### Container Role - 자식 기반 자동 레이아웃
```tsx
// 현재
<Section role="Container" className="flex">
  <Section role="Navigator" />
  <Section role="Container" />
</Section>

// 기대 (자동 감지)
<Section role="Container">
  <Section role="Navigator" />  {/* Navigator 자식이 있으면 자동으로 flex */}
  <Section role="Container" />
</Section>
```

**제안**: Container가 Navigator나 Aside 자식을 가지면 자동으로 `display: flex` 적용

### 우선순위
**Medium** - 일반적인 레이아웃 패턴이지만, className으로 해결 가능

---

## 3. Group 컴포넌트 - Role별 기본 스타일

### 현재 문제
- `Group[role="List"]`가 `className="flex-1 overflow-y-auto"` 필요
- `Group[role="Form"]`의 기본 스타일이 명확하지 않음

### 요구사항

#### List Role
```tsx
// 현재
<Group role="List" layout="stack" className="flex-1 overflow-y-auto">

// 기대
<Group role="List" layout="stack">
  {/* 자동으로 flex-1, overflow-y-auto 적용 */}
</Group>
```

**제안 기본 스타일**:
- 부모가 flex일 때 `flex: 1` 자동 적용
- `overflow-y: auto` 기본 적용

#### Form Role
```tsx
<Group role="Form">
  {/* border-bottom으로 구분 */}
</Group>
```

**제안 기본 스타일**:
- `border-bottom: 1px solid var(--color-border-muted)`
- `padding: 1rem` (design token 기반)

### 우선순위
**Low** - className으로 충분히 해결 가능

---

## 4. Action 컴포넌트 - List 아이템 스타일

### 현재 문제
- 리스트에서 버튼처럼 동작하는 Action이 기본 버튼 스타일을 가짐
- 너비, 정렬, hover 스타일을 모두 className으로 지정해야 함

### 요구사항
```tsx
// 현재
<Action
  label="문서 제목"
  prominence="Tertiary"
  className="w-full text-left px-3 py-2 rounded-md hover:bg-hover"
/>

// 기대
<Action
  label="문서 제목"
  prominence="Tertiary"
  variant="list-item"  // 👈 새로운 variant
/>
```

**제안 variant**: `list-item`
- `width: 100%`
- `text-align: left`
- `padding: 0.5rem 0.75rem`
- `border-radius: 0.375rem`
- `&:hover { background: var(--color-hover) }`

### 우선순위
**Medium** - 리스트 네비게이션은 일반적인 패턴

---

## 5. Text 컴포넌트 - Role별 Typography

### 현재 상태
- Text role에 따른 기본 typography가 잘 정의되어 있음
- 추가 개선 불필요

### 확인 사항
```tsx
<Text role="Title" prominence="Hero" />
// ✅ 자동으로 text-3xl font-semibold 적용됨
```

**상태**: 만족스러움

---

## 6. Page 컴포넌트 - Layout 개선

### 현재 문제
- `layout="full"`일 때 padding이 없지만, 내부 Section의 레이아웃 처리는 수동

### 제안
```tsx
<Page layout="docs">  // 새로운 layout 타입
  <Section role="Header" />    {/* 자동 sticky */}
  <Section role="Navigator" />  {/* 자동 sidebar */}
  <Section role="Container" />  {/* 자동 flex-1 */}
</Page>
```

**새로운 layout 타입**: `docs` 또는 `sidebar-with-header`
- Header는 sticky
- Navigator는 고정 사이드바
- Container는 flex-1 메인 콘텐츠

### 우선순위
**Low** - 기존 `layout="sidebar"` + Header Section으로 충분

---

## 7. 디자인 토큰 활용 개선

### 현재 상태
- Section, Group의 prominence/density가 디자인 토큰 기반으로 잘 동작
- Border, spacing이 토큰 기반으로 적용됨

### 확인 사항
```tsx
<Section prominence="Secondary" density="Compact">
  {/* ✅ 자동으로 bg-surface-sunken, p-4 적용 */}
</Section>
```

**상태**: 만족스러움

---

## 우선순위 요약

| 기능 | 우선순위 | 상태 | 이유 |
|------|----------|------|------|
| Field clearable | **High** | ✅ **완료** (v1.0.2) | 검색 UI 필수 패턴 |
| Action list-item variant | **Medium** | 📋 대기 | 리스트 네비게이션 일반 패턴 |
| Section Navigator 자동 레이아웃 | **Medium** | 📋 대기 | 자주 사용되지만 className으로 해결 가능 |
| Group List 자동 스타일 | **Low** | 📋 대기 | className으로 충분 |
| Page docs layout | **Low** | 📋 대기 | 기존 layout으로 해결 가능 |

---

## 참고 코드

구현 예시: `/Users/user/Desktop/ide-ui-kit/src/apps/DOCS/widgets/docs/DocsViewer.tsx`

---

## 추가 노트

IDDL의 철학은 "의미론적 속성으로 디자인 결정"이므로, 위 요구사항들은 role과 prominence 기반으로 자동 스타일을 제공하는 방향으로 구현되어야 합니다.

className override는 예외적인 경우에만 사용되어야 하며, 일반적인 패턴은 IDDL 속성만으로 충분해야 합니다.
