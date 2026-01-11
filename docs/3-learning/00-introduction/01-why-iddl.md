# 왜 IDDL인가?

**난이도**: ⭐☆☆☆☆
**소요 시간**: 10분
**선행 학습**: 없음

---

## 📌 이 문서에서 배울 내용

- 상용 애플리케이션 개발의 디자인 문제점
- 기존 디자인 시스템의 한계
- IDDL이 해결하는 문제
- Why-based System의 핵심 가치

---

## 🎯 왜 IDDL이 필요한가?

### 문제 1: 끝없는 디자인 결정

상용 애플리케이션을 만들다 보면 이런 질문들에 계속 직면합니다:

```tsx
// 버튼 하나 만드는데도...
<button className="???">Save</button>

// 🤔 고민의 연속
- 배경색은? bg-blue-500? bg-green-600? bg-gray-800?
- 패딩은? px-4 py-2? px-6 py-3? px-8 py-4?
- 폰트는? text-sm? text-base? text-lg?
- 그림자는? shadow-md? shadow-lg? 없음?
- 둥근 모서리는? rounded? rounded-md? rounded-lg?
- hover는? hover:bg-blue-600? hover:shadow-xl?
```

**문제점**: 버튼 하나에 수십 가지 디자인 결정이 필요합니다.
**결과**: 일관성 없는 UI, 끝없는 디자인 리뷰, 개발 속도 저하

---

### 문제 2: 기존 디자인 시스템의 한계

#### Material UI, Ant Design, shadcn/ui

```tsx
// 컴포넌트는 제공하지만...
<Button variant="contained" color="primary">Save</Button>

// 🚫 한계점:
// 1. variant와 color 조합을 외워야 함
// 2. "중요한 긍정 액션"을 어떻게 표현? → variant="???" color="???"
// 3. 새로운 의미를 추가하려면? → 컴포넌트 커스터마이징
// 4. 왜 이 스타일인지 코드에서 알 수 없음
```

**문제점**: "어떻게"(How)만 제공하고 "왜"(Why)는 개발자가 해석해야 합니다.

---

#### Tailwind CSS

```tsx
<button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
  Save
</button>

// 🚫 문제점:
// 1. 긴 className (67자)
// 2. 의미 파악 불가 (왜 blue-500인지? 왜 px-6인지?)
// 3. 일관성 없음 (다른 개발자는 다른 값 사용)
// 4. 반복 작성 (모든 버튼마다 이 className 복사)
```

**문제점**: 유연하지만 일관성과 의미가 사라집니다.

---

### 문제 3: 스케일링 불가능

팀이 커지고 앱이 복잡해질수록:

```tsx
// 개발자 A
<button className="bg-blue-500 px-6 py-3">Save</button>

// 개발자 B
<button className="bg-blue-600 px-4 py-2">Save</button>

// 개발자 C
<button className="bg-indigo-500 px-5 py-2.5">Save</button>

// 🤦 같은 "저장 버튼"인데 3가지 버전
```

**문제점**: 디자인 시스템을 강제할 방법이 없습니다.

---

## 💡 IDDL의 해결책: Why-based System

### "왜"를 선언하면, "어떻게"는 따라온다

```tsx
// ✅ IDDL
<Action prominence="Strong" intent="Positive">
  Save
</Action>
```

**개발자가 선언하는 것**:
- `prominence="Strong"` → "이건 **중요한** 액션이야"
- `intent="Positive"` → "이건 **긍정적인** 의미야"

**시스템이 자동으로 처리하는 것**:
- ✅ 배경색: `bg-green-500` (Positive는 green)
- ✅ 패딩: `px-6 py-3` (Strong는 큰 패딩)
- ✅ 폰트: `font-semibold` (Strong는 강조)
- ✅ Hover: `hover:bg-green-600`
- ✅ Focus: `focus:ring-2 focus:ring-green-500`
- ✅ ARIA: `role="button"` 자동 설정
- ✅ 키보드: Enter/Space 자동 처리

**결과**: 67자 className → 2개 props

---

### 일관성 보장

```tsx
// 모든 개발자가 같은 방식으로 작성
<Action prominence="Strong" intent="Positive">Save</Action>
<Action prominence="Strong" intent="Positive">Submit</Action>
<Action prominence="Strong" intent="Positive">Confirm</Action>

// ✅ 자동으로 일관된 스타일 적용
// ✅ 팀원이 100명이어도 똑같은 결과
```

---

### 의미 전달

```tsx
// ❌ How-based - 의미 불명확
<button className="bg-red-500">Delete</button>
// 왜 red-500? red-600은? red-400은?

// ✅ Why-based - 의미 명확
<Action prominence="Strong" intent="Critical">Delete</Action>
// "중요한 위험한 액션"이구나!
```

코드를 읽는 사람이 **왜 이렇게 생겼는지** 바로 이해할 수 있습니다.

---

## 🔥 실전 비교: 로그인 폼

### How-based (기존 방식)

```tsx
function LoginForm() {
  return (
    <form className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button className="px-6 py-2 text-white bg-blue-500 rounded-md font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
          Sign In
        </button>
      </div>
    </form>
  );
}

// 📊 통계:
// - 총 코드: 32줄
// - className 글자 수: 538자
// - "왜 이렇게 생겼는지" 파악 시간: 30초+
```

---

### Why-based (IDDL)

```tsx
function LoginForm() {
  return (
    <Page role="Focus">
      <Section role="Container">
        <Block role="Form" prominence="Strong">
          <Text role="Title" prominence="Strong">Sign In</Text>

          <Field label="Email" dataType="email" required />
          <Field label="Password" dataType="password" required />

          <Block role="Toolbar">
            <Action prominence="Standard">Cancel</Action>
            <Action prominence="Strong" intent="Brand">Sign In</Action>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}

// 📊 통계:
// - 총 코드: 15줄 (50% 감소)
// - className: 0자 (100% 감소)
// - "왜 이렇게 생겼는지" 파악 시간: 3초
```

**차이점**:
- ✅ 코드 절반으로 감소
- ✅ className 완전히 제거
- ✅ 의미 즉시 파악 가능
- ✅ 접근성 자동 처리
- ✅ 일관성 보장

---

## 🎯 IDDL의 핵심 가치

### 1. 생산성 향상

```
기존 방식: 디자인 고민 (30%) + 코드 작성 (70%)
IDDL 방식: 의도 선언 (10%) + 시스템이 처리 (90%)

결과: 3배 빠른 개발
```

---

### 2. 일관성 보장

```
기존 방식: 개발자마다 다른 스타일
IDDL 방식: prominence × intent → 자동으로 동일한 스타일

결과: 100명이 작업해도 일관성 유지
```

---

### 3. 유지보수성

```
기존 방식: 디자인 변경 시 모든 className 수정
IDDL 방식: 토큰 파일 하나만 수정

결과: 디자인 변경이 1시간 → 1분
```

---

### 4. 접근성 자동화

```
기존 방식: 매번 ARIA, 키보드 수동 추가
IDDL 방식: 자동으로 처리

결과: 접근성 준수율 100%
```

---

### 5. 학습 곡선 완화

```
기존 방식: Tailwind 수백 개 클래스 외우기
IDDL 방식: 5 Axes (prominence, intent, density, role, type) 이해

결과: 신입 개발자도 하루 만에 숙달
```

---

### 6. IDDL: ARIA의 상위호환

IDDL은 **ARIA(Accessible Rich Internet Applications)의 상위호환 버전**으로 생각할 수 있습니다.

#### ARIA가 하는 일

```html
<!-- ARIA: 접근성을 위한 의미적 역할과 상태 선언 -->
<button
  role="button"
  aria-label="Close dialog"
  aria-pressed="false"
  aria-disabled="false"
>
  Close
</button>
```

**ARIA의 범위**:
- ✅ 접근성 (스크린 리더, 키보드)
- ❌ 디자인 (색상, 크기, 간격)
- ❌ 레이아웃 (배치, 정렬)
- ❌ 상태 시각화 (loading, selected)

---

#### IDDL이 하는 일

```tsx
<!-- IDDL: 접근성 + 디자인 + 레이아웃 + 상태를 모두 선언 -->
<Action
  role="Button"
  prominence="Strong"
  intent="Critical"
  selected={false}
  disabled={false}
>
  Close
</Action>
```

**IDDL의 범위**:
- ✅ 접근성 (ARIA 속성 자동 생성)
- ✅ 디자인 (prominence × intent → 자동 스타일)
- ✅ 레이아웃 (role 기반 자동 배치)
- ✅ 상태 시각화 (selected, disabled, loading)

---

#### 비교표

| 항목 | ARIA | IDDL |
|------|------|------|
| **접근성** | ✅ 수동 작성 | ✅ 자동 생성 |
| **디자인** | ❌ 별도 CSS 필요 | ✅ prominence × intent |
| **레이아웃** | ❌ 별도 구조 필요 | ✅ role 기반 자동 |
| **상태** | ✅ aria-pressed 등 | ✅ selected, loading 등 |
| **일관성** | ❌ 개발자 책임 | ✅ 시스템 보장 |

---

#### 실전 예시: 탭 네비게이션

```tsx
// ❌ 전통적 방식 (ARIA + Tailwind)
<div role="tablist" className="flex border-b">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="panel-1"
    className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-semibold"
  >
    Profile
  </button>
  <button
    role="tab"
    aria-selected="false"
    aria-controls="panel-2"
    className="px-4 py-2 text-gray-600 hover:text-gray-800"
  >
    Security
  </button>
</div>

// ✅ IDDL 방식
<Block role="Tabs">
  <Action role="Tab" selected={true}>
    Profile
  </Action>
  <Action role="Tab" selected={false}>
    Security
  </Action>
</Block>
```

**IDDL이 자동으로 처리**:
- ✅ `role="tablist"` 설정
- ✅ `aria-selected` 설정
- ✅ `aria-controls` 설정 (필요시)
- ✅ selected 상태 시각화 (border-bottom, text-color)
- ✅ hover 상태 스타일
- ✅ 키보드 탐색 (Arrow keys)
- ✅ flex 레이아웃, border-b

**코드 감소**: 67자 className → 2개 props

---

#### 핵심: "의미를 선언하면, 구현은 따라온다"

ARIA는 **"이것이 무엇인가"**(what)만 선언합니다.
IDDL은 **"이것이 무엇이고, 왜 중요하고, 어떤 의미인가"**(what + why + meaning)를 선언합니다.

```
ARIA: role="button"
     → 시스템: "버튼이구나. 키보드 탐색 가능하게."

IDDL: role="Button" prominence="Strong" intent="Critical"
     → 시스템: "중요한 위험한 버튼이구나.
                키보드 탐색 + 빨간 배경 + 큰 패딩 + 경고 아이콘"
```

**결론**: IDDL은 ARIA의 접근성 개념을 확장해서, **접근성 + 디자인 + 레이아웃 + 상태**를 모두 선언적으로 표현하는 시스템입니다.

---

## ✅ 이 문서를 읽고 나면

- [x] 기존 디자인 시스템의 한계를 이해했다
- [x] Why-based System의 개념을 이해했다
- [x] IDDL이 해결하는 문제를 파악했다
- [x] IDDL의 핵심 가치를 알게 되었다

---

## 🔗 다음 단계

[핵심 개념](./02-core-concept.md) - IDDL의 5 Axes System과 동작 원리를 배웁니다.

---

**최종 업데이트**: 2026-01-11
**난이도**: 입문
**예상 소요 시간**: 10분
