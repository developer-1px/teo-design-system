# 다크모드처럼 보이는 현상 분석 보고서

**작성일:** 2026-01-09
**분석자:** Claude Code
**심각도:** Medium
**상태:** 확인됨

---

## 1. 현상 요약

현재 애플리케이션이 의도하지 않게 다크모드로 렌더링되고 있습니다.

## 2. 근본 원인

### 2.1 시스템 다크모드 자동 감지

**파일:** `src/styles/themes.css:184-213`

```css
@media (prefers-color-scheme: dark) {
  @theme {
    /* Surface - Dark mode (7-Layer System) */
    --color-surface-base: var(--color-gray-950);  /* #0a0a0a */
    --color-surface-sunken: var(--color-gray-900); /* #171717 */
    --color-surface: var(--color-gray-900);        /* #171717 */
    /* ... */
  }
}
```

**문제점:**
- 사용자의 **macOS/Windows 시스템 설정**이 다크모드인 경우, CSS Media Query `prefers-color-scheme: dark`가 자동으로 활성화됨
- 애플리케이션 내부의 테마 토글과 무관하게 시스템 설정에 반응
- 명시적으로 라이트모드를 선택해도 시스템 설정이 우선 적용됨

### 2.2 테마 우선순위 구조

현재 테마 적용 우선순위:

```
1. [data-theme='dark'] (수동 설정)
2. @media (prefers-color-scheme: dark) (시스템 자동 감지) ← 문제!
3. 기본 라이트 테마
```

시스템이 다크모드인 경우, `@media` 쿼리가 항상 활성화되어 기본값을 덮어씁니다.

## 3. 영향 범위

### 3.1 영향받는 토큰

**Surface (배경색):**
- `--color-surface-base`: `#fafafa` → `#0a0a0a`
- `--color-surface`: `white` → `#171717`
- `--color-surface-elevated`: `white` → `#262626`

**Text (텍스트색):**
- `--color-text`: `#171717` → `#fafafa`
- `--color-text-muted`: `#525252` → `#a3a3a3`

**Border:**
- `--color-border-default`: `#e5e5e5` → `#404040`

### 3.2 영향받는 컴포넌트

모든 디자인 시스템 컴포넌트가 영향을 받습니다:
- Layer 컴포넌트 (배경색)
- Button, Input (컴포넌트 토큰)
- 모든 텍스트 요소
- 모든 border 사용 요소

## 4. 재현 방법

### 4.1 시스템 설정 확인

**macOS:**
```
시스템 설정 > 디스플레이 > 외관 모드
→ "다크" 또는 "자동" 선택 시 발생
```

**Windows:**
```
설정 > 개인 설정 > 색 > 모드 선택
→ "다크" 선택 시 발생
```

### 4.2 브라우저 DevTools 확인

Chrome/Edge DevTools:
```
1. F12 → Elements 탭
2. :root 또는 <html> 선택
3. Computed Styles 확인
   → --color-surface-base 값이 #0a0a0a인지 확인
```

## 5. 해결 방안

### 5.1 권장 해결책: 시스템 자동 감지 비활성화

애플리케이션이 **명시적 테마 제어**를 원한다면:

```css
/* src/styles/themes.css */

/* 기존 @media 쿼리 제거 또는 주석 처리 */
/*
@media (prefers-color-scheme: dark) {
  @theme {
    ...
  }
}
*/

/* [data-theme='dark']만 유지 */
[data-theme='dark'] {
  --color-surface-base: var(--color-gray-950);
  --color-surface: var(--color-gray-900);
  /* ... */
}
```

**장점:**
- 사용자가 애플리케이션 내에서 테마를 완전히 제어 가능
- 시스템 설정과 독립적으로 동작
- 예측 가능한 동작

**단점:**
- 시스템 다크모드 사용자의 초기 경험이 라이트모드로 고정됨

### 5.2 대안 1: 시스템 설정을 기본값으로 사용

시스템 다크모드를 **기본값**으로 인정하고, 사용자가 명시적으로 변경할 수 있도록:

```typescript
// App.tsx 초기화 시
useEffect(() => {
  // 시스템 설정 감지
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // localStorage에 저장된 설정이 없으면 시스템 설정 따르기
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}, []);
```

**장점:**
- 사용자의 시스템 설정을 존중
- 업계 표준 UX 패턴

**단점:**
- 추가 로직 필요
- 초기 로딩 시 테마 깜빡임 가능성

### 5.3 대안 2: Opt-in 다크모드

`@media` 쿼리 대신 명시적 클래스 사용:

```css
/* 기본값: 라이트모드 */
:root {
  --color-surface-base: #fafafa;
  /* ... */
}

/* 수동 다크모드만 */
[data-theme='dark'] {
  --color-surface-base: var(--color-gray-950);
  /* ... */
}
```

그리고 사용자에게 "시스템 설정 따르기" 옵션 제공:

```typescript
// 설정 UI
const options = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
  { value: 'system', label: '시스템 설정 따르기' }
];
```

## 6. 즉시 조치 사항

### 6.1 임시 해결 (개발 중)

개발자가 라이트모드로 작업하려면:

```
macOS: 시스템 설정 → 디스플레이 → 외관 모드 → "라이트" 선택
Windows: 설정 → 개인 설정 → 색 → "밝게" 선택
```

또는 DevTools에서 강제 설정:

```javascript
// Console
document.documentElement.setAttribute('data-theme', 'light');
```

### 6.2 영구 수정

`src/styles/themes.css` 수정:

```css
/* 184-213 라인 주석 처리 또는 삭제 */
/*
@media (prefers-color-scheme: dark) {
  @theme {
    ...
  }
}
*/
```

## 7. 관련 파일

- `src/styles/themes.css:184-213` - 시스템 다크모드 자동 감지
- `src/styles/themes.css:216-238` - 수동 다크모드 설정
- `src/components/ui/FloatingBar.tsx` - 테마 토글 UI
- `src/components/modal/CommandPalette.tsx` - 테마 명령어
- `src/design-system/tokens.ts` - 디자인 토큰 정의

## 8. 참고 자료

- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [TailwindCSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## 9. 다음 액션 아이템

- [ ] 팀 회의: 시스템 자동 감지 정책 결정
- [ ] UX 디자인: 테마 선택 UI 설계 (라이트/다크/시스템)
- [ ] 개발: 선택된 방안 구현
- [ ] 테스트: macOS/Windows 시스템 설정별 테스트
- [ ] 문서화: 테마 시스템 사용 가이드 작성

---

**결론:**

현재 다크모드처럼 보이는 이유는 `themes.css`의 `@media (prefers-color-scheme: dark)` 쿼리가 사용자의 **시스템 다크모드 설정**을 자동으로 감지하여 다크모드 토큰을 적용하기 때문입니다.

의도된 동작인지, 수정이 필요한지 팀 논의가 필요합니다.
