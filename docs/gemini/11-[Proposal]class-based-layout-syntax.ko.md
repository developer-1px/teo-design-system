# 제안서: 함수형 클래스 문법 (Functional Class Syntax)

## 1. 아이디어: 함수형 클래스 이름

사용자님께서는 복잡한 데이터 속성(`data-sizing-w="fill"`) 대신 더 직관적인 클래스 구문을 제안하셨습니다:
> `class="hbox w(fill)"`

이 방식(Functional CSS)은 DOM 출력을 단순화하고 디버깅 시 가독성을 높여줍니다. 또한 Tailwind 같은 유틸리티 프레임워크의 문법과 유사하여 개발자에게 친숙하면서도, 우리의 "컨텍스트 인식(Context-Aware)" 로직을 그대로 유지할 수 있는 훌륭한 방법입니다.

---

## 2. 기술적 타당성: `w(fill)`

CSS 클래스 이름에 괄호 `()`를 사용할 수 있을까요? **네, 가능합니다.**
CSS 명세에 따르면 문자열 이스케이프(Escape)만 처리하면 거의 모든 문자를 클래스 이름으로 사용할 수 있습니다.

### 구현 상세 (Implementation Details)

#### JSX / HTML 출력
컴포넌트 단에서는 단순히 문자열을 조합하면 됩니다.
```tsx
// Frame.tsx
const className = clsx(
  "frame",
  layout === "hbox" && "hbox",
  layout === "vbox" && "vbox",
  w === "fill" && "w(fill)",   // 훨씬 깔끔합니다!
  w === "hug" && "w(hug)",
  w === "fixed" && "w(fixed)"
);

return <div className={className} />;
```

#### CSS 구현 (이스케이프 트릭)
CSS 파일에서는 괄호 앞에 백슬래시 `\`를 붙여서 이스케이프 처리해야 합니다.
*모양: `.` + `클래스명` + `\` + `(`.*

```css
/* ----------------------------------------------------
   Context-Aware Sizing with Class Syntax
   Pattern: .부모-컨텍스트 > .자식-의도
---------------------------------------------------- */

/* 상황 A: Row (HBox) 내부 */
.hbox > .w\(fill\) {
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  width: auto;
}

.hbox > .w\(hug\) {
  width: fit-content;
  flex: 0 0 auto;
}

/* 상황 B: Column (VBox) 내부 */
.vbox > .w\(fill\) {
  align-self: stretch;
  width: 100%;
  flex-grow: 0;
}

.vbox > .w\(hug\) {
  height: fit-content; /* VBox에서 Hug는 보통 높이를 의미 */
  flex: 0 0 auto;
}
```

---

## 3. 비교: 데이터 속성 vs 클래스

| 기능 (Feature) | 데이터 속성 (`[data-w="fill"]`) | 함수형 클래스 (`.w(fill)`) |
| :--- | :--- | :--- |
| **DOM 가독성** | 장황함: `<div data-w="fill" ...>` | 깔끔함: `<div class="w(fill) ...">` |
| **CSS 문법** | 표준: `[data-w="fill"]` | 이스케이프 필요: `.w\(fill\)` |
| **우선순위(Specificity)** | 동등 (0-1-0) | 동등 (0-1-0) |
| **JS 번들링** | 영향 없음 | 일반 문자열 처리 |
| **개발 경험 (DX)** | 좋음 | **매우 우수** (직관적 멘탈 모델) |

## 4. 결론 및 권장사항

**`w(fill)` 클래스 문법 도입을 적극 권장합니다.**
이 문법은 시각적으로 명확하며, "의도(Intent)"를 함수처럼 표현(`width("fill")`)하여 전달력이 좋습니다. 또한 앞서 논의한 CSS 자식 결합자 전략(`.hbox > .child`)과도 완벽하게 호환됩니다.

결과적으로 매우 읽기 쉬운 DOM 구조를 얻게 됩니다:
```html
<div class="vbox fill surface-base">
  <!-- 헤더 -->
  <div class="hbox w(fill) h(fixed)">...</div>
  
  <!-- 콘텐츠 -->
  <div class="hbox w(fill) h(fill)">...</div>
</div>
```
