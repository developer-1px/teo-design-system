# 컨텍스트 인식 레이아웃: "Fill"의 모호성 해결

## 1. 도전 과제: 축(Axis) 의존성

사용자분께서 매우 날카로운 지적을 해주셨습니다:
> *"w='fill'을 만들면 부모가 Row인지 Column인지 알아야 동작을 결정할 수 있지 않나요?"*

**네, 맞습니다.**
"너비를 채운다(Fill Width)"는 동작은 부모의 Flex 방향에 따라 구현 방식이 완전히 달라집니다.

| 부모 컨텍스트 (Parent Context) | "너비 채움" 구현 방식 | 메커니즘 |
| :--- | :--- | :--- |
| **Row (`hbox`)** | `flex-grow: 1` | 주축(Main Axis) 확장 |
| **Column (`vbox`)** | `width: 100%` (또는 `align-self: stretch`) | 교차축(Cross Axis) 늘리기 |

이것을 JavaScript(React Context)로 계산하려면 다음 문제가 발생합니다:
1.  **렌더링 오버헤드**: 모든 Frame이 LayoutContext를 구독해야 합니다.
2.  **복잡성**: Context를 전달하기 위한 Provider와 Wrapper 지옥이 생길 수 있습니다.

---

## 2. 해결책: CSS 자식 결합자 (Child Combinators) - 런타임 제로

**CSS의 자식 선택자(`>`)**를 활용하면 JavaScript 계산 없이 이 문제를 우아하게 해결할 수 있습니다.
핵심은 모든 Flex 컨테이너에 명확한 클래스(`hbox` 또는 `vbox`)를 부여하는 것입니다.

### 기술적 전략 (Technical Strategy)

#### 1단계: 부모에 명확한 클래스 부여
`Frame` 컴포넌트가 레이아웃 속성에 따라 의미론적 클래스를 렌더링하도록 합니다.
```typescript
// Frame.tsx
const className = clsx(
  layout === 'hbox' && 'hbox',
  layout === 'vbox' && 'vbox',
  // ...
);
```

#### 2단계: 자식에 데이터 속성 부여
`w="fill"` 값을 스타일로 바로 변환하지 않고, 데이터 속성(Data Attribute)으로 마크업에 남깁니다.
```typescript
// Child Frame
<div data-sizing-w="fill" />
```

#### 3단계: 컨텍스트 인식 CSS (Context-Aware CSS)
전역 CSS에 "관계"를 정의합니다. 브라우저가 알아서 "부모가 누구냐"에 따라 스타일을 갈아끼웁니다.

```css
/* 상황 A: 자식이 Row(HBox) 안에 있을 때 */
/* w="fill"은 "가로 공간 나누기"를 의미 -> Flex Grow */
.hbox > [data-sizing-w="fill"] {
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0; /* auto 최소 너비 문제 해결! */
  width: auto;
}

/* 상황 B: 자식이 Column(VBox) 안에 있을 때 */
/* w="fill"은 "가로로 늘어나기"를 의미 -> Width 100% */
.vbox > [data-sizing-w="fill"] {
  align-self: stretch;
  width: 100%;
  flex-grow: 0; /* 세로로 늘어나는 부작용 방지 */
}
```

### 결과
이제 개발자는 구현 세부 사항을 신경 쓰지 않고 Figma처럼 사고할 수 있습니다:

```tsx
<Frame layout="vbox">
  {/* 자동으로 width: 100% 가 적용됨 */}
  <Frame w="fill" /> 
  
  <Frame layout="hbox">
    {/* 자동으로 flex: 1 이 적용됨 */}
    <Frame w="fill" /> 
  </Frame>
</Frame>
```

---

## 3. 대안: "유니버설 스트레치" (Flex-1 Hack)

더 단순하지만 완벽하지 않은 방법도 있습니다.
```css
[w="fill"] {
  flex: 1 1 0px;
  width: 100%;
}
```
- 이렇게 하면 대부분의 경우 동작합니다.
- 하지만 **Column** 레이아웃에서 `w="fill"`을 줬을 때(너비만 채우고 싶을 때), `flex: 1` 때문에 **높이까지 늘어나는 부작용**이 발생할 수 있습니다.

**결론**: **CSS 자식 결합자 전략**이 가장 강력하고 스마트한 해결책입니다. `hbox`/`vbox` 클래스 체계만 엄격히 지킨다면, 성능 저하 없이 완벽한 Context-Aware 레이아웃을 구현할 수 있습니다.
