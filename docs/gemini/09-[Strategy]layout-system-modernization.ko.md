# 레이아웃 시스템 현대화: Figma와 CSS의 연결

## 1. 차이점: Figma AutoLayout vs CSS Flexbox

디자이너와 개발자는 서로 다른 언어로 레이아웃을 이야기합니다.
- **Figma (디자이너)**: "의도(Intent)"를 기반으로 사고합니다 (Hug, Fill, Fixed).
- **CSS (개발자)**: "메커니즘(Mechanism)"을 기반으로 사고합니다 (flex-grow, shrink, basis, min-width).

이러한 불일치는 `min-width: auto` 오버플로우 문제와 같은 버그를 유발합니다. CSS의 기본값(Default)이 "Fill"이라는 의도와 충돌하기 때문입니다.

### 대조표 (Comparison Table)

| 기능 (Feature) | Figma AutoLayout | CSS Flexbox (Raw) | 마찰 지점 (The Friction Point) |
| :--- | :--- | :--- | :--- |
| **Hug Content** | 컨테이너가 자식 요소를 감쌉니다. | `width: fit-content` / `flex: 0 0 auto` | CSS 기본값도 잘 작동하지만, 명시적인 `max-content`가 필요할 때가 있습니다. |
| **Fill Container** | 아이템이 남은 공간을 가득 채웁니다. | `flex-grow: 1` | **버그 발생지.** CSS는 기본적으로 `min-width: auto`입니다. 즉, "공간을 채우되, 내 콘텐츠보다 작아지지는 마라"는 뜻입니다. 반면 Figma의 "Fill"은 `min-width: 0`을 내포합니다(공간이 좁으면 줄어들어라). |
| **Fixed Width** | 명시적인 픽셀 값. | `width: 200px` | `width`를 줘도 CSS는 기본적으로 `flex-shrink: 1`입니다(공간 부족하면 찌그러짐). Figma의 "Fixed"는 "절대 줄어들지 마"를 의미하므로, CSS에서는 `flex-shrink: 0`이 필수입니다. |
| **Gap** | `Gap` | `gap` | (최신 CSS에서는 거의 동일함). |

---

## 2. 제안된 전략: 의도 기반 레이아웃 속성 (Intent-Based Layout Props)

원시적인 CSS 메커니즘(`flexGrow`, `flexShrink`, `minWidth`)을 노출하는 대신, 디자인 시스템(`Frame`)은 **레이아웃 의도(Layout Intent)**를 노출해야 합니다.

임시방편적인 패치(`minWith: 0`)를 매번 작성하는 것을 멈추고, `width` / `height` 속성이 **스마트 키워드**를 인식하도록 개선할 것을 제안합니다.

### "스마트 사이징" API

```typescript
// 현재 (원시적 CSS 메커니즘)
<Frame flex fill override={{ minWidth: 0, flexShrink: 0 }} />

// 제안 (의도 기반)
<Frame w="fill" />  // 자동으로 flex:1, min-width:0 설정
<Frame w="hug" />   // 자동으로 width: fit-content 설정
<Frame w={240} />   // 자동으로 width: 240px, flex-shrink: 0 설정
```

### 기술적 구현 (Technical Implementation)

`Frame` 컴포넌트는 이 토큰들을 해석하여, 해당 의도를 강제하는 "엄격한 CSS 규칙 세트"를 적용합니다.

| 의도 토큰 (Intent Token) | 파생된 CSS (Derived CSS) | 이유 (Why?) |
| :--- | :--- | :--- |
| **`w="fill"`** | `flex: 1`<br>`min-width: 0` | Figma의 "Fill"과 일치. 큰 자식 요소 때문에 레이아웃이 깨지는 것을 방지(자동 축소 허용). |
| **`w="hug"`** | `width: max-content`<br>`flex: 0 0 auto` | Figma의 "Hug"와 일치. 자식 요소에 딱 맞게 크기 조절. |
| **`w={Number}`** | `width: {N}px`<br>`flex: 0 0 auto` | Figma의 "Fixed"와 일치. **중요:** 고정 크기 요소가 찌그러지지 않도록 `flex-shrink: 0`을 강제합니다. |

---

## 3. 이점 (Benefits)

1.  **패치워크 제거**: 개발자가 더 이상 `minWidth: 0`이나 `flexShrink: 0`을 수동으로 입력할 필요가 없습니다. 시스템이 알아서 처리합니다.
2.  **공통 언어**: 코드와 디자인이 일치합니다. "이거 Fill로 해줘" -> `w="fill"`.
3.  **예측 가능성**: "Fixed"는 고정되고, "Fill"은 채웁니다(필요하면 줄어듭니다).

## 4. 참고 자료 (References)

- **Chakra UI / Stitches**: `size`, `width` 속성에서 유사한 의도 기반 키워드를 사용합니다.
- **Yoga Layout**: React Native의 레이아웃 엔진은 고정 크기에 대해 `flex-shrink: 0`을 기본값으로 하여 이 전략과 일치합니다.
- **Figma Documentation**: "Resizing constraints"는 현대 UI 레이아웃 멘탈 모델의 기준입니다.
