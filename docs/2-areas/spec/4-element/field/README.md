# Field Element 스펙

Field는 **사용자 입력을 받는 Element**로, 폼 데이터 바인딩과 검증을 담당합니다. IDDL에서 가장 복잡하고 중요한 컴포넌트입니다.

## 📄 스펙 문서

- **[field.spec.md](./field.spec.md)** ✅ - Field 컴포넌트 공식 스펙
  - 21개 dataType 전체 카탈로그
  - FieldRole 정의
  - Props API 레퍼런스
  - 검증 및 에러 처리

## 🎯 Field의 핵심 개념

### 1. dataType (21개)

Field는 **dataType prop**으로 입력 형식을 결정합니다:

#### 텍스트 입력 (6개)
- `text` - 일반 텍스트
- `email` - 이메일 주소
- `password` - 비밀번호
- `url` - URL 주소
- `tel` - 전화번호
- `search` - 검색어

#### 숫자 입력 (3개)
- `number` - 숫자
- `currency` - 통화
- `percentage` - 퍼센트

#### 날짜/시간 (5개)
- `date` - 날짜
- `time` - 시간
- `datetime` - 날짜+시간
- `month` - 월
- `week` - 주
- `daterange` - 날짜 범위

#### 선택 (4개)
- `select` - 단일 선택 드롭다운
- `radio` - 라디오 버튼 그룹
- `checkbox` - 체크박스
- `multiselect` - 다중 선택

#### 리치 입력 (3개)
- `textarea` - 멀티라인 텍스트
- `richtext` - 리치 텍스트 에디터
- `rating` - 별점
- `color` - 색상 선택

### 2. Headless + Renderer Pattern

Field는 **로직과 UI를 완전히 분리**합니다:

```
Field.tsx (Main Component)
  ├─ headless/           # 로직만 (NO UI)
  │   ├─ useTextField.ts
  │   ├─ useNumberField.ts
  │   ├─ useSelectField.ts
  │   └─ ... (21개)
  ├─ renderers/          # UI만 (NO 로직)
  │   ├─ TextField.tsx
  │   ├─ NumberField.tsx
  │   ├─ SelectField.tsx
  │   └─ ... (21개)
  └─ role/               # Primitive 컴포넌트
      ├─ Input.tsx
      ├─ Select.tsx
      ├─ Checkbox.tsx
      └─ Radio.tsx
```

**장점**:
- 로직 재사용 (React, Vue, Svelte)
- UI 교체 가능 (Material, Ant Design, shadcn/ui)
- 테스트 용이성

### 3. 검증 시스템

```tsx
<Field
  label="Email"
  dataType="email"
  required
  validation={{
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email"
  }}
/>
```

## 💡 사용 예시

```tsx
// 텍스트 입력
<Field
  label="Username"
  dataType="text"
  placeholder="Enter your username"
  required
/>

// 이메일 입력
<Field
  label="Email"
  dataType="email"
  helpText="We'll never share your email"
/>

// 숫자 입력
<Field
  label="Age"
  dataType="number"
  min={0}
  max={120}
/>

// 선택 (Select)
<Field
  label="Country"
  dataType="select"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'kr', label: 'South Korea' }
  ]}
/>

// 체크박스
<Field
  label="I agree to terms"
  dataType="checkbox"
  required
/>

// 날짜 입력
<Field
  label="Birth Date"
  dataType="date"
/>

// 리치 텍스트
<Field
  label="Description"
  dataType="richtext"
  toolbar={['bold', 'italic', 'link']}
/>
```

## 📊 구현 현황

| dataType | Headless Hook | Renderer | Primitive | 상태 |
|----------|--------------|----------|-----------|------|
| text | ✅ | ✅ | ✅ | 완료 |
| email | ✅ | ✅ | ✅ | 완료 |
| password | ✅ | ✅ | ✅ | 완료 |
| number | ✅ | ✅ | ✅ | 완료 |
| select | ✅ | ✅ | ✅ | 완료 |
| checkbox | ✅ | ✅ | ✅ | 완료 |
| radio | ✅ | 🚧 | ✅ | 진행중 |
| date | ⚠️ | ⚠️ | ⚠️ | 필요 |
| textarea | ⚠️ | ⚠️ | ⚠️ | 필요 |
| ... | ... | ... | ... | ... |

**Phase 1 목표**: text, email, password, number, select, checkbox, radio (7개) ✅

## 🔗 관련 문서

- [../../0-core/](../../0-core/) - IDDL 핵심 스펙
- [../text/](../text/) - Text Element 스펙
- [../action/](../action/) - Action Element 스펙

## 📍 구현 위치

- **Component**: `src/components/types/Element/Field/Field.tsx`
- **Headless**: `src/components/types/Element/Field/headless/`
- **Renderers**: `src/components/types/Element/Field/renderers/`
- **Roles**: `src/components/types/Element/Field/role/`

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**상태**: ✅ 스펙 완료, 🚧 구현 진행중 (~40%)
