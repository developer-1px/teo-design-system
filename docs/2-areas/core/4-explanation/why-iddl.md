# Why IDDL?

> **IDDL(Intent-Driven Design Language)이 필요한 이유**

---

## 🎯 핵심 질문

**"UI를 만들 때, 왜 '어떻게'가 아닌 '왜'를 명시해야 하나?"**

---

## 문제: 기존 UI 개발의 한계

### 1. How-based Approach (어떻게 기반)

```tsx
// ❌ 기존 방식: "어떻게" 보일지 명시
<button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold
                   hover:bg-blue-600 focus:ring-2 focus:ring-blue-400">
  Save
</button>
```

**문제점**:
- ❌ **일관성 부족**: 개발자마다 다른 스타일 (`bg-blue-500` vs `bg-indigo-600`)
- ❌ **유지보수 어려움**: 색상 변경 시 모든 버튼 수정 필요
- ❌ **AI 생성 불확실**: AI가 매번 다른 스타일 생성
- ❌ **접근성 누락**: ARIA 속성, 키보드 네비게이션 빠뜨리기 쉬움
- ❌ **의도 불명확**: 코드만 봐선 "왜 파란색인지" 알 수 없음

### 2. 컴포넌트 라이브러리의 한계

```tsx
// Material-UI, Ant Design 방식
<Button variant="contained" color="primary" size="large">
  Save
</Button>
```

**문제점**:
- ❌ **"How" 중심**: `variant="contained"`는 "어떻게" 보일지
- ❌ **의미 모호**: `color="primary"`가 "왜" primary인지 불명확
- ❌ **디자인 시스템 종속**: MUI에서 Ant Design으로 변경 시 전체 수정

---

## 해결: Why-First Design

### IDDL Approach (왜 기반)

```tsx
// ✅ IDDL: "왜" 이 버튼인지 명시
<Action
  label="Save"
  prominence="Primary"   // "이게 가장 중요한 액션이야"
  intent="Positive"      // "긍정적인 결과를 가져와"
  behavior="submit"      // "폼을 제출해"
/>
```

**장점**:
- ✅ **의도 명확**: prominence="Primary" → "가장 중요한 버튼"
- ✅ **일관성 보장**: 같은 prominence는 항상 같은 스타일
- ✅ **AI 친화적**: AI가 "중요한 저장 버튼"을 이해하고 일관되게 생성
- ✅ **접근성 자동**: behavior="submit" → 자동으로 `role="button"`, Enter 키 바인딩
- ✅ **유지보수 쉬움**: 토큰만 변경하면 전체 반영

---

## IDDL이 해결하는 3가지 핵심 문제

### 1. AI 시대의 코드 생성

**문제**: AI가 일관성 없는 코드 생성

```tsx
// AI 생성 코드 1
<button className="bg-blue-500 px-4 py-2">Save</button>

// AI 생성 코드 2 (같은 프롬프트)
<button className="bg-indigo-600 px-6 py-3">Save</button>

// AI 생성 코드 3
<button style={{ background: '#007bff', padding: '10px 20px' }}>Save</button>
```

**IDDL 해결**:

```tsx
// 프롬프트: "주요 저장 버튼 만들어"
// AI는 항상 이렇게 생성:
<Action role="Button" prominence="Primary" intent="Positive">
  Save
</Action>

// 시스템이 자동으로 적용:
// - accent 색상
// - 적절한 패딩 (prominence="Primary" → 큰 사이즈)
// - hover/focus 상태
// - ARIA 속성
```

**결과**: AI가 명확한 규칙을 이해하고 일관된 코드 생성

---

### 2. 접근성 민주화

**문제**: 접근성은 전문가 영역

```tsx
// ❌ 접근성 없는 코드 (대부분의 개발자)
<div onClick={handleClick}>
  Click me
</div>

// ✅ 접근성 있는 코드 (전문가만 작성)
<button
  onClick={handleClick}
  aria-label="Save document"
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
>
  Save
</button>
```

**IDDL 해결**:

```tsx
// 개발자는 의도만 명시
<Action
  label="Save document"
  behavior="submit"
/>

// 시스템이 자동 적용:
// - <button> 태그 (semantic HTML)
// - aria-label
// - Enter 키 바인딩
// - tabIndex
// - focus-visible 스타일
```

**결과**: 접근성이 "선택"이 아닌 "기본값"

---

### 3. 디자인 시스템 일관성

**문제**: 팀원마다 다른 스타일

```tsx
// 개발자 A
<button className="bg-blue-500 px-4 py-2">Save</button>

// 개발자 B
<button className="bg-primary px-6 py-3">Save</button>

// 개발자 C
<button style={{ padding: '12px 24px', background: 'var(--primary)' }}>Save</button>
```

**IDDL 해결**:

```tsx
// 모든 개발자가 같은 방식으로 작성
<Action prominence="Primary">Save</Action>

// 시스템이 16개 토큰으로 자동 적용:
// - 색상: accent (6가지 중 1개)
// - 패딩: 16px (4가지 간격 중 1개)
// - 폰트: 600 (2가지 굵기 중 1개)
```

**결과**: 팀 전체가 일관된 UI 생성

---

## IDDL의 핵심 개념

### 1. Prominence (주목도)

**"얼마나 중요한가?"**

```typescript
'Hero'      // 최상위 강조 (거대함)
'Primary'   // 주요 (가장 흔한 중요 요소)
'Secondary' // 보조 (덜 중요)
'Tertiary'  // 미약 (최소한의 주목)
```

**예시**:

```tsx
// 페이지에 버튼 3개
<Action prominence="Primary">Save</Action>      // 크고 눈에 띔
<Action prominence="Secondary">Cancel</Action>  // 중간 크기
<Action prominence="Tertiary">Reset</Action>    // 작고 흐림
```

### 2. Intent (의도)

**"무엇을 의도하는가?"**

```typescript
'Neutral'   // 기본 (회색/검정)
'Brand'     // 브랜드 강조 (Primary 색상)
'Positive'  // 긍정/성공 (초록)
'Caution'   // 주의/경고 (노랑/주황)
'Critical'  // 위험/파괴 (빨강)
```

**예시**:

```tsx
<Action intent="Positive">Save</Action>     // 초록 (긍정적)
<Action intent="Critical">Delete</Action>   // 빨강 (위험)
<Action intent="Neutral">Cancel</Action>    // 회색 (중립)
```

### 3. Role (역할)

**"무엇을 하는가?"**

```typescript
// Action Behaviors
'navigate'  // 페이지 이동
'submit'    // 폼 제출
'delete'    // 삭제
'toggle'    // 토글 (on/off)
```

**예시**:

```tsx
<Action behavior="submit">Save</Action>
// 자동 적용:
// - Enter 키 바인딩
// - type="submit" (form 내부)
// - ARIA role="button"
```

---

## Why-First vs How-First 비교

| 측면 | How-First | Why-First (IDDL) |
|------|-----------|------------------|
| **명시** | "파란색, 패딩 16px" | "주요 저장 버튼" |
| **일관성** | ❌ 개발자마다 다름 | ✅ 시스템이 보장 |
| **AI 생성** | ❌ 매번 다른 코드 | ✅ 일관된 코드 |
| **접근성** | ❌ 수동 추가 | ✅ 자동 적용 |
| **유지보수** | ❌ 전체 수정 필요 | ✅ 토큰만 변경 |
| **학습 곡선** | ❌ 모든 클래스 암기 | ✅ 3가지 개념만 |

---

## 실제 사례

### Before: TailwindCSS (How-based)

```tsx
function LoginForm() {
  return (
    <form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Log in
      </h1>

      <input
        type="email"
        className="w-full px-4 py-2 border border-gray-300 rounded-md
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Email"
      />

      <input
        type="password"
        className="w-full px-4 py-2 border border-gray-300 rounded-md mt-4
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Password"
      />

      <button
        type="submit"
        className="w-full mt-6 px-6 py-3 bg-blue-500 text-white rounded-md
                   font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
      >
        Log in
      </button>
    </form>
  );
}
```

**문제점**:
- ❌ 50줄 이상의 className
- ❌ 일관성 없음 (`border-gray-300` vs `ring-blue-500`)
- ❌ 접근성 부족 (label 없음, 에러 메시지 없음)

### After: IDDL (Why-based)

```tsx
import { Page, Section, Group, Field, Action } from '@/components/dsl';

function LoginForm() {
  return (
    <Page title="Log in" layout="single">
      <Section role="Container" prominence="Primary">
        <Group role="Form" prominence="Primary">
          <Field
            label="Email"
            dataType="email"
            required
          />

          <Field
            label="Password"
            dataType="password"
            required
          />

          <Action
            label="Log in"
            prominence="Primary"
            intent="Brand"
            behavior="submit"
          />
        </Group>
      </Section>
    </Page>
  );
}
```

**장점**:
- ✅ 20줄 이하
- ✅ 의도 명확 (prominence="Primary", intent="Brand")
- ✅ 접근성 자동 (label, required, aria-* 자동 적용)
- ✅ 일관성 보장 (16개 토큰으로 자동 스타일링)

---

## 언제 IDDL을 사용해야 하나?

### ✅ IDDL이 적합한 경우

1. **오픈소스 프로젝트**: 기여자가 많고 일관성 필요
2. **AI 코딩 도구 사용**: Claude Code, Copilot 등
3. **접근성 중요**: WCAG 2.1 AA 준수 필요
4. **팀 개발**: 여러 개발자가 협업
5. **장기 프로젝트**: 유지보수성 중요

### ❌ IDDL이 과한 경우

1. **프로토타입**: 빠른 실험만 필요
2. **1인 개발**: 일관성 덜 중요
3. **완전히 커스텀 디자인**: 토큰으로 표현 불가능
4. **기존 프로젝트**: 전환 비용이 큼

---

## 결론

### IDDL은 다음을 가능하게 합니다:

1. **AI 시대 대비**: 명확한 규칙 → 일관된 AI 코드 생성
2. **접근성 민주화**: 전문가 없이도 WCAG 준수
3. **개발자 경험**: "왜"만 명시 → "어떻게"는 자동
4. **유지보수성**: 토큰 변경 → 전체 적용
5. **팀 협업**: 일관된 코드 베이스

### 핵심 철학

> **"개발자는 비즈니스 로직에 집중하고, 디자인 시스템은 일관성을 보장한다."**

---

## 다음 단계

- [IDDL vs Traditional](./iddl-vs-traditional.md) - 다른 방식과 상세 비교
- [Getting Started](../../1-tutorials/01-getting-started.md) - IDDL 시작하기
- [Project Philosophy](../../design-system/project-philosophy.md) - 프로젝트 전체 철학

---

**이 문서는 IDDL의 "왜"를 설명합니다. "어떻게"는 Tutorials와 How-to Guides를 참조하세요.**
