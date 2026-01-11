# 4-element: Element (Item) 컴포넌트 스펙

Element는 **IDDL의 가장 기본적인 구성 요소 (Primitives)**로, IDDL 스펙에서는 "Item"으로 명명되지만 코드에서는 "Element"로 구현되어 있습니다.

## 📁 하위 카테고리

Element는 **4가지 타입**으로 분류됩니다:

### 1. [text/](./text/) - 정적 콘텐츠
표시 전용 텍스트 요소

- **TextRole**: Title, Body, Label, Code, Badge, Alert, Avatar, Kbd
- **용도**: 제목, 본문, 레이블, 코드 블록, 배지, 경고, 아바타, 키보드 단축키
- **특징**: 읽기 전용, 스타일링 중심

### 2. [field/](./field/) - 데이터 바인딩 ⭐
사용자 입력을 받는 폼 요소 (21개 dataType 지원)

- **FieldRole**: TextInput, NumberInput, Select, Checkbox, Radio, DateInput, etc.
- **용도**: 폼 입력, 데이터 수집, 검증
- **특징**: 양방향 바인딩, 검증, 상태 관리
- **스펙**: [field/field.spec.md](./field/field.spec.md) ✅

### 3. [action/](./action/) - 인터랙션
사용자 액션을 트리거하는 요소

- **ActionRole**: Button, IconButton, Link, MenuItem
- **용도**: 클릭, 제출, 탐색
- **특징**: 키보드 접근성, 상호작용, 행동 트리거

### 4. [separator/](./separator/) - 시각적 구분선
UI 영역을 시각적으로 구분

- **SeparatorRole**: Horizontal, Vertical
- **용도**: 섹션 구분, 시각적 분리
- **특징**: 장식적 요소, ARIA role="separator"

## 🎯 Element의 핵심 개념

### 5 Axes System

모든 Element는 **5가지 축(Axes)**으로 정의됩니다:

1. **Type**: Element의 분류 (Text, Field, Action, Separator)
2. **Role**: 구체적인 역할 (Button, TextInput, Title, etc.)
3. **Prominence**: 시각적 중요도 (Hero, Primary, Secondary, Tertiary)
4. **Intent**: 의미적 색상 (Neutral, Brand, Positive, Caution, Critical, Info)
5. **Density**: 간격/크기 (Comfortable, Standard, Compact)

### Headless + Renderer Pattern

Element는 **로직과 UI를 분리**하는 패턴을 사용합니다:

```
Field (Example)
  ├─ headless/           # 로직만 (NO UI)
  │   └─ useTextField.ts
  ├─ renderers/          # UI만 (NO 로직)
  │   └─ TextField.tsx
  └─ role/               # Primitive 컴포넌트
      └─ Input.tsx
```

**장점**:
- 로직 재사용 가능 (React, Vue, Svelte)
- UI 교체 가능 (Material, Ant Design)
- 테스트 용이성

## 📊 현재 상태

| Element Type | 스펙 문서 | 구현 상태 | 비고 |
|--------------|----------|----------|------|
| **Text** | ⚠️ 필요 | ✅ 완료 | Label, Code, Badge, Alert, Avatar, Kbd |
| **Field** | ✅ 완료 | 🚧 진행중 | 21개 dataType 중 일부 구현 |
| **Action** | ⚠️ 필요 | ✅ 완료 | Button, IconButton 구현 |
| **Separator** | ⚠️ 필요 | ✅ 완료 | Horizontal, Vertical |

## 🔗 관련 문서

- [../0-core/](../0-core/) - IDDL 핵심 스펙
- [../3-block/](../3-block/) - Block (Group) 컴포넌트 스펙
- [../9-meta/](../9-meta/) - 구현 분석 및 로드맵

## 📍 구현 위치

- **Component**: `src/components/types/Element/`
- **Text**: `src/components/types/Element/Text/`
- **Field**: `src/components/types/Element/Field/`
- **Action**: `src/components/types/Element/Action/`
- **Separator**: `src/components/types/Element/Separator/`

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**상태**: Text/Action/Separator 스펙 문서 작성 필요
