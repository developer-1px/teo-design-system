# 카테고리 네이밍 논쟁: 레드팀 vs 블루팀

**목적**: 최상위 카테고리 이름 결정을 위한 양측 입장 분석
**방법**: 레드팀(보수적/산업 표준) vs 블루팀(혁신적/의미론적) 토론
**작성일**: 2026-01-14

---

## 🎯 핵심 논쟁: Form vs Field

### 비교표

| 관점 | Form | Field |
|------|------|-------|
| **산업 표준** | ✅ Material Design, shadcn/ui, Carbon 모두 사용 | ❌ 비표준 용어 |
| **의미론적 정확성** | 🟡 "양식 전체"를 의미 (Form 요소 집합) | ✅ "입력 단위"를 의미 (개별 Input) |
| **검색 가능성** | ✅ "form component library" 검색 용이 | ❌ "field component" 검색 시 혼란 |
| **MDK 현재 구현** | ❌ Form 컴포넌트 없음 | ✅ Field 컴포넌트 이미 존재 |
| **계층 구조 명확성** | 🟡 Form.Input (양식 안의 입력?) | ✅ Field.Input (입력 필드의 타입) |
| **일상 언어** | 🟡 "로그인 폼" (전체 UI) | ✅ "이메일 필드" (개별 입력) |
| **React 생태계** | ✅ React Hook Form, Formik | 🟡 FieldArray (React Hook Form 하위) |
| **HTML 시맨틱** | ✅ `<form>` 태그 (양식 컨테이너) | 🟡 `<input>`, `<textarea>` (필드 자체) |
| **범위 명확성** | 🟡 Form.Submit (양식 제출 = 액션?) | ✅ Field.Submit (제출 필드 = 입력 단위) |
| **추상화 수준** | 🟡 높음 (비즈니스 로직 포함 느낌) | ✅ 낮음 (UI 프리미티브) |

### 레드팀 주장: Form을 써야 한다

**산업 표준 준수**
- Material Design 3: "Text inputs", "Selection" (Form 관련 카테고리)
- shadcn/ui: "Forms & Input" (60+ 컴포넌트 중 명시적 카테고리)
- Carbon Design System: "Form Patterns"
- Ant Design: "Data Entry" (Form 포함)
- **결론**: 모든 주요 디자인 시스템이 Form 용어 사용

**검색 최적화**
- "form component library react" → 수백만 검색 결과
- "field component library react" → 혼란스러운 결과 (DB field, form field 혼재)
- **결론**: 개발자들이 찾기 쉬운 용어

**React 생태계 일관성**
- React Hook Form: `useForm()`, `<Form>` 컴포넌트
- Formik: 가장 유명한 form 라이브러리
- **결론**: React 개발자에게 익숙한 용어

**완전성**
- Form.Input, Form.Select, Form.Checkbox (명확)
- Form.Submit, Form.Reset (양식 액션 포함 가능)
- Form.Validation, Form.ErrorMessage (양식 관련 유틸리티)
- **결론**: 전체 양식 생태계를 표현 가능

**대외 커뮤니케이션**
- "We built a comprehensive form component library" (자연스러움)
- "We built a field component library" (설명 필요)
- **결론**: 마케팅 및 문서화에 유리

---

### 블루팀 주장: Field를 써야 한다

**의미론적 정확성**
- Form = 양식 전체 (여러 필드의 집합 + 제출 로직)
- Field = 입력 필드 (개별 UI 프리미티브)
- **MDK는 UI 프리미티브를 제공하지, 비즈니스 로직(Form)을 제공하지 않음**
- **결론**: Field가 MDK의 추상화 수준과 일치

**프레임워크 중립성**
- "Form"은 React Hook Form, Formik 등 상태 관리 라이브러리를 연상
- "Field"는 순수 UI 프리미티브 (프레임워크 독립적)
- **결론**: MDK는 어떤 form 라이브러리와도 호환되는 순수 UI 제공

**기존 구현 일관성**
- 현재 MDK에는 `Field` 컴포넌트가 이미 존재
- 사용자들이 이미 `<Field>` 사용 중
- **결론**: 기존 사용자 혼란 최소화

**계층 구조 명확성**
```tsx
// Form 사용 시 혼란
<Form.Input />       // 양식의 입력? 입력 양식?
<Form.Submit />      // 양식 제출? (Action 카테고리와 중복?)

// Field 사용 시 명확
<Field.Input />      // 입력 필드 (UI)
<Field.Submit />     // 제출 필드 (UI, 버튼처럼 보이지만 필드)
```

**일상 언어 정확성**
- "이메일 **필드**를 입력하세요" (개별 입력)
- "로그인 **폼**을 작성하세요" (전체 양식)
- **MDK는 개별 UI를 제공** → Field가 적합

**추상화 수준 일관성**
- Frame: 레이아웃 프리미티브
- Field: 입력 프리미티브
- Overlay: 플로팅 프리미티브
- Prose: 콘텐츠 프리미티브
- **결론**: 모두 "프리미티브" 수준, Form은 "패턴" 수준

**차별화**
- 다른 라이브러리: Form 로직 제공 (React Hook Form, Formik)
- MDK: UI 프리미티브만 제공
- **결론**: Field 사용으로 차별화 명확

**확장성**
```tsx
// Field는 비-폼 컨텍스트에서도 사용 가능
<Field.Search />     // 검색 필드 (폼 아님)
<Field.Filter />     // 필터 필드 (폼 아님)
<Field.Inline />     // 인라인 편집 필드 (폼 아님)

// Form은 폼 컨텍스트로 제한됨
<Form.Search />      // 검색 폼? 어색함
```

---

## 🏆 최종 권고: Field 채택

### 결정 이유

1. **MDK 철학과 일치**: 프리미티브 UI 제공, 비즈니스 로직 배제
2. **기존 구현 보존**: Field 컴포넌트 이미 존재
3. **의미론적 정확성**: 개별 입력 단위 = Field
4. **차별화**: 다른 form 라이브러리와 명확히 구분
5. **확장성**: 비-폼 컨텍스트에서도 사용 가능

### 트레이드오프 수용

- ❌ 산업 표준 용어 포기 (Form → Field)
- ❌ 검색 최적화 불리
- ✅ 의미론적 정확성 우선
- ✅ MDK 고유 철학 확립

---

## 📊 전체 카테고리 네이밍 논쟁

### 카테고리 1: Frame (합의)

| 레드팀 제안 | 블루팀 제안 | 최종 결정 | 이유 |
|------------|------------|---------|------|
| Layout | Frame | **Frame** ✅ | Layout은 Frame의 하위 개념. Frame이 프리미티브. |

**합의 근거**:
- Layout.Stack, Layout.Row는 Frame의 프리셋
- Frame은 Universal Layout Primitive
- 다른 시스템에 없는 MDK 고유 개념

---

### 카테고리 2: Field (블루팀 승)

| 레드팀 제안 | 블루팀 제안 | 최종 결정 | 이유 |
|------------|------------|---------|------|
| Form | Field | **Field** ✅ | UI 프리미티브, 비즈니스 로직 배제 |

**블루팀 승리 이유**:
- 의미론적 정확성 (입력 단위 vs 양식 전체)
- 기존 MDK 구현 일치
- 프레임워크 중립성

---

### 카테고리 3: Data (합의)

| 레드팀 제안 | 블루팀 제안 | 최종 결정 | 이유 |
|------------|------------|---------|------|
| Data | Display | **Data** ✅ | 산업 표준, 명확한 의미 |

**합의 근거**:
- Ant Design: "Data Display"
- Carbon DS: "Data Visualization"
- shadcn/ui: "Data & Tables"
- **Data가 압도적 표준**

**블루팀 Display 제안 이유**: "표시"라는 동작 강조
**레드팀 반박**: Data는 명사로 더 명확, Display는 모든 카테고리에 해당

---

### 카테고리 4: Feedback (합의)

| 레드팀 제안 | 블루팀 제안 | 최종 결정 | 이유 |
|------------|------------|---------|------|
| Feedback | Communication | **Feedback** ✅ | 사용자 관점 명확 |

**합의 근거**:
- Material Design 3: "Communication" 사용
- 하지만 Feedback이 더 직관적
- Toast, Alert, Progress는 "피드백"이 자연스러움

**레드팀 Communication 고려 이유**: Material Design 따라가기
**블루팀 승리 이유**: 사용자 중심 용어

---

### 카테고리 5: Overlay (합의)

| 레드팀 제안 | 블루팀 제안 | 최종 결정 | 이유 |
|------------|------------|---------|------|
| Modal | Overlay | **Overlay** ✅ | 상위 개념, 확장성 |

**합의 근거**:
- Modal, Dialog, Tooltip, Popover 모두 포함
- Overlay가 기술적으로 정확 (z-index layer)
- shadcn/ui: "Dialogs & Overlays" 병행 사용

**레드팀 Modal 제안 이유**: 더 직관적, 일상 용어
**블루팀 승리 이유**: Modal은 Overlay의 한 종류일 뿐

---

### 카테고리 6: Navigation (합의)

| 레드팀 제안 | 블루팀 제안 | 최종 결정 | 이유 |
|------------|------------|---------|------|
| Navigation | Nav | **Navigation** ✅ | 명확성, 표준 |

**합의 근거**:
- Material Design 3: "Navigation" (7개 컴포넌트)
- 모든 시스템이 Navigation 사용
- Nav는 축약어로 덜 공식적

**블루팀 Nav 제안 이유**: 짧고 개발자 친화적
**레드팀 승리 이유**: 문서화 명확성 우선

---

### 카테고리 7: Prose (합의)

| 레드팀 제안 | 블루팀 제안 | 최종 결정 | 이유 |
|------------|------------|---------|------|
| Content | Prose | **Prose** ✅ | 차별화, 명확한 범위 |

**합의 근거**:
- US Web Design System: "Prose" 카테고리 존재
- Tailwind CSS: "Prose" 플러그인 (타이포그래피)
- Content는 너무 넓은 개념

**레드팀 Content 제안 이유**: 더 일반적 용어
**블루팀 승리 이유**: Prose는 "장문 콘텐츠"로 명확히 범위 한정

---

## 🎨 최종 카테고리 구조

```
MDK (Minimal Design Kit)
├── Frame           ✅ 합의 (Layout의 상위 개념)
├── Field           ✅ 블루팀 승 (Form 대신)
├── Data            ✅ 합의 (산업 표준)
├── Feedback        ✅ 합의 (Communication보다 직관적)
├── Overlay         ✅ 합의 (Modal보다 포괄적)
├── Navigation      ✅ 합의 (Nav보다 공식적)
└── Prose           ✅ 합의 (Content보다 명확)
```

---

## 📋 논쟁별 투표 결과

| 카테고리 | 레드팀 제안 | 블루팀 제안 | 승자 | 득표 |
|---------|------------|------------|-----|------|
| 1 | Layout | **Frame** | 블루팀 | **합의** |
| 2 | Form | **Field** | 블루팀 | **블루팀 단독 승** |
| 3 | **Data** | Display | 레드팀 | **합의** |
| 4 | Communication | **Feedback** | 블루팀 | **합의** |
| 5 | Modal | **Overlay** | 블루팀 | **합의** |
| 6 | **Navigation** | Nav | 레드팀 | **합의** |
| 7 | Content | **Prose** | 블루팀 | **합의** |

**최종 점수**: 블루팀 5승, 레드팀 2승 (하지만 대부분 합의)

---

## 🔍 결정 원칙

### 1. 의미론적 정확성 > 산업 표준
- Field vs Form: 의미가 정확한 Field 채택
- Frame vs Layout: 기술적으로 정확한 Frame 채택

### 2. MDK 철학 우선
- 프리미티브 UI 제공
- 비즈니스 로직 배제
- 프레임워크 중립성

### 3. 차별화 가치
- 다른 시스템과 똑같을 필요 없음
- Prose, Frame, Field로 MDK 정체성 확립

### 4. 사용자 혼란 최소화
- 기존 Field 컴포넌트 유지
- 명확한 문서화로 보완

---

## ⚠️ 예상 문제점 및 완화 전략

### 문제 1: "Field가 뭐예요?" (검색 어려움)

**완화 전략**:
```markdown
# MDK Field Components

MDK uses "Field" instead of "Form" to represent individual UI input primitives.

## Why Field, not Form?
- **Field**: Individual input unit (Input, Select, Checkbox)
- **Form**: Complete form logic (validation, submission, state management)

MDK provides Field components. You can combine them with any form library:
- React Hook Form + MDK Field.Input ✅
- Formik + MDK Field.Select ✅
- Vanilla React + MDK Field.* ✅
```

### 문제 2: React Hook Form과 혼란

**완화 전략**:
```tsx
// ✅ 명확한 사용 예제 제공
import { useForm } from 'react-hook-form'
import { Field } from '@mdk/field'

function LoginForm() {
  const { register } = useForm()

  return (
    <form>
      <Field.Input {...register('email')} />
      <Field.Submit>Login</Field.Submit>
    </form>
  )
}
```

### 문제 3: SEO 및 마케팅

**완화 전략**:
- 메타 태그: "MDK Field Components - Form Inputs & Controls"
- 부제: "React Form Input Components" (검색 최적화)
- 문서 제목: "Field (Form Input) Components"

---

## 📚 참고: 다른 시스템의 네이밍

### Material Design 3
```
- Actions (Button, FAB, Chip)
- Communication (Badge, Progress, Snackbar)
- Containment (Dialog, Sheet, Tooltip)
- Navigation
- Selection (Checkbox, Radio, Switch)
- Text inputs (Text Field)
```
→ **Text inputs를 별도 카테고리로 분리** (Field 개념과 유사)

### shadcn/ui
```
- Forms & Input
- Feedback & Display
- Data & Tables
- Dialogs & Overlays
```
→ **Forms & Input 병행 표기**

### Ant Design
```
- Data Entry (Form, Input, Select...)
- Data Display (Table, List, Card...)
```
→ **Data Entry = 입력, Data Display = 표시**

### US Web Design System
```
- Form controls
- Prose
```
→ **Form controls (복수) 사용, Prose 독립 카테고리**

---

## ✅ 최종 권고사항

### 1. Field 채택 확정
- Form 대신 Field 사용
- 문서화에서 명확히 설명

### 2. 일관된 문서화
모든 문서에서 다음 설명 포함:
> **Why "Field" instead of "Form"?**
> MDK provides UI primitives, not form logic. Field represents individual input units that work with any form library.

### 3. 검색 최적화
- 메타데이터: "field, form, input, components"
- 대체 검색어 제공: "MDK Form Components" → Field 페이지로 리다이렉트

### 4. 예제 코드 우선
- React Hook Form 통합 예제
- Formik 통합 예제
- 순수 React 예제

---

**작성자**: Claude Code
**레드팀**: 산업 표준 옹호
**블루팀**: 의미론적 정확성 옹호
**최종 결정**: 블루팀 우세 (5:2), 대부분 합의
**문서 버전**: 1.0
