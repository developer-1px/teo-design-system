# Section vs Block 구분 (IDDL 1.0)

> **Note**: IDDL 1.0에서 기존의 `Group` 개념은 `Block`으로 통합되었습니다.

## 핵심 개념

### Section = 시맨틱 영역 (Layout Layer)
**"Page가 만들어주는 물리적 영역"**

- **Level**: 1
- **목적**: 화면의 물리적 구획 (Header, Sidebar, Main 등)
- **Role**: `Header`, `Footer`, `Main`, `Sidebar`, `Drawer`, `Modal` (필수)
- **자식**: 오직 `<Block>`만 가능

```tsx
<Page>
  <Section role="Sidebar">...</Section> 'Sidebar' 역할 
  <Section role="Main">...</Section>    'Main' 역할
</Page>
```

### Block = 기능적 컴포넌트 (Component Layer)
**"의미적 덩어리 또는 레이아웃 컨테이너"**

- **Level**: 2
- **목적**: 정보의 그룹핑, 컴포넌트 패턴 (Card, Form, List 등)
- **Role**: `Card`, `List`, `Form`, `Toolbar`, `Grid` 등 (선택)
- **자식**: `<Block>` 또는 `<Element>`

```tsx
<Section role="Main">
  {/* 의미적 Block */}
  <Block role="Card">
    <Element role="Title" ... />
  </Block>

  {/* 레이아웃용 Block (구 Group) */}
  <Block role="Toolbar">
    <Element role="Button" ... />
  </Block>
</Section>
```

## 주요 차이점

| 측면 | Section (Level 1) | Block (Level 2) |
|------|-------------------|-----------------|
| **역할** | 물리적 Layout 영역 | 논리적 Component / Group |
| **필수** | Role 필수 | Role 선택 (없으면 단순 그룹) |
| **배치** | Page의 큰 틀 (Top/Left/Center) | Section 내부의 흐름 (Stack/Grid) |
| **자식** | Block만 가능 | Block / Element 가능 |
