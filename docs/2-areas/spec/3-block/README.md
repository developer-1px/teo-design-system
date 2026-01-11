# 3-block: Block (Group) 컴포넌트 스펙

Block은 **논리적 그룹핑을 담당하는 컴포넌트**로, IDDL 스펙에서는 "Group"으로 명명되지만 코드에서는 "Block"으로 구현되어 있습니다.

## 📄 스펙 문서

> **현재 작성 중**: Block 컴포넌트의 공식 스펙 문서를 작성해야 합니다.

계획된 문서:
- `block.spec.md` - Block 컴포넌트 공식 스펙
- `block-roles-catalog.md` - BlockRole 카탈로그

## 🎯 Block의 역할

Block은 **Section 내에서 관련된 Element들을 논리적으로 묶는** 역할을 합니다.

### BlockRole 타입 (예상)

| Role | 용도 | 예시 |
|------|------|------|
| **Form** | 입력 폼 그룹 | 로그인 폼, 설정 폼 |
| **Card** | 카드 형태 콘텐츠 | 대시보드 카드, 정보 카드 |
| **Toolbar** | 도구 모음 | 에디터 툴바, 액션 버튼 그룹 |
| **List** | 리스트 아이템 그룹 | 파일 목록, 메뉴 리스트 |
| **Grid** | 그리드 레이아웃 | 이미지 그리드, 제품 그리드 |
| **Tabs** | 탭 컨테이너 | 설정 탭, 에디터 탭 |
| **Accordion** | 아코디언 | FAQ, 설정 그룹 |
| **DataTable** | 데이터 테이블 | 사용자 목록, 상품 목록 |

## 🔧 주요 기능 (예상)

### 1. Layout Control

```tsx
<Block role="Toolbar" layout="inline" gap={2}>
  <Action>Save</Action>
  <Action>Cancel</Action>
</Block>
```

### 2. Prominence & Intent

```tsx
<Block role="Card" prominence="Primary" intent="Brand">
  <Text role="Title">Featured</Text>
  <Text role="Body">This is a featured card</Text>
</Block>
```

### 3. Interactive States

```tsx
<Block role="List">
  <Block clickable selected>Item 1</Block>
  <Block clickable>Item 2</Block>
</Block>
```

## 📁 구조 예시

```tsx
<Section role="Container">
  <Block role="Form">
    <Field label="Email" dataType="email" />
    <Field label="Password" dataType="password" />

    <Block role="Toolbar">
      <Action prominence="Secondary">Cancel</Action>
      <Action prominence="Primary" intent="Positive">Submit</Action>
    </Block>
  </Block>
</Section>
```

## 🚧 현재 상태

**구현 상태**:
- ✅ 코드 구현됨 (`src/components/types/Block/`)
- ⚠️ 스펙 문서 필요 (이 디렉토리에 작성 예정)

**다음 작업**:
1. `block.spec.md` 작성 - 공식 스펙 정의
2. BlockRole 카탈로그 작성 - 모든 role 타입 문서화
3. 구현 예시 추가 - 실전 사용 패턴

## 🔗 관련 문서

- [../0-core/](../0-core/) - IDDL 핵심 스펙
- [../2-section/](../2-section/) - Section 컴포넌트 스펙
- [../4-element/](../4-element/) - Element (Item) 컴포넌트 스펙

## 📍 구현 위치

- **Component**: `src/components/types/Block/Block.tsx`
- **Roles**: `src/components/types/Block/role/`

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**상태**: 🚧 스펙 문서 작성 필요
