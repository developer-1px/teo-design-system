# 기술 전략: 임의의 값(Arbitrary Values) 처리

## 우려 사항: 클래스 폭발 (Class Explosion)

질문:
> *"w(200) 같은 방식은 좋지만, 모든 숫자에 대해 클래스를 만들면 CSS 파일이 너무 커지지 않을까요?"*

**정확한 지적입니다.**
만약 우리가 모든 숫자에 대해 정적 CSS 클래스(`.w(200)`, `.w(201)`, `.w(202)`...)를 미리 만들어둔다면, CSS 파일 크기는 무한히 커질 것입니다. (Tailwind 같은 JIT 컴파일러를 쓰지 않는 한 불가능한 방식입니다.)

## 해결책: 하이브리드 접근 (Class + Inline Style)

우리는 **역할을 분리**함으로써, 개발자가 `w={200}`이라는 직관적인 문법을 쓰면서도 CSS 용량을 늘리지 않게 할 수 있습니다.

1.  **동작 (CSS Class)**: 레이아웃 규칙(줄어들지 않기, 늘어나기 등)을 담당합니다.
2.  **값 (Inline Style)**: 구체적인 픽셀 수치를 담당합니다.

### 구현 로직 (Implementation Logic)

`Frame` 컴포넌트가 `w`나 `h` 속성으로 **숫자**를 받을 때의 처리 방식입니다:

```typescript
// Frame.tsx 내부 로직

const isFixedW = typeof w === 'number';

// 1. 동작을 위한 범용 클래스 적용
const className = clsx(
  // ...
  isFixedW && "w(fixed)", // 이 클래스는 flex-shrink: 0 등을 강제합니다.
  w === 'fill' && "w(fill)"
);

// 2. 구체적인 값은 인라인 스타일로 적용
const style = {
  // ...
  width: isFixedW ? `${w}px` : undefined
};

return <div className={className} style={style} />;
```

### 결과물 DOM (The Resulting DOM)

**상황 A: 키워드 사용 (Fill)**
코드: `<Frame w="fill" />`
출력: `<div class="w(fill)"></div>`

**상황 B: 숫자 사용 (200px)**
코드: `<Frame w={200} />`
출력: `<div class="w(fixed)" style="width: 200px;"></div>`

### 이 방식이 완벽한 이유
1.  **용량 증가 없음 (Zero Bloat)**: `.w(fixed)`라는 단 하나의 클래스만 있으면 *모든* 고정 너비 상황을 처리할 수 있습니다.
2.  **정확한 동작**: `.w(fixed)` 클래스가 `flex-shrink: 0`을 보장하므로, 인라인 스타일로 적용된 `width: 200px`이 찌그러지지 않고 유지됩니다.
3.  **일관된 API**: 개발자는 내부 구현을 몰라도 `w={200}`이든 `w="fill"`이든 똑같은 방식으로 작성하면 됩니다.

### CSS 정의

```css
/* w(fixed)는 레이아웃 메커니즘(동작)만 정의합니다 */
/* 실제 너비 값은 style 속성에서 옵니다 */
.w\(fixed\) {
  flex-grow: 0;
  flex-shrink: 0;
  /* width: style attribute */
}
```
