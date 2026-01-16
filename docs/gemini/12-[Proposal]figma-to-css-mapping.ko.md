# 제안서: Figma-to-Code 매핑 전략

## 1. 핵심 철학: "흐름(Flow)" 중심의 네이밍

Figma의 멘탈 모델을 따르면서도 코드를 직관적으로 유지하기 위해, 표준 CSS 축(Axis)의 이름을 기능 중심으로 재정의합니다:

- **Main Axis** (흐름 방향) → **`pack`** (Figma의 "Packed" vs "Space Between"에서 착안)
- **Cross Axis** (수직 방향) → **`align`** (Figma의 "Alignment"에서 착안)

이제 `justify-content`나 `align-items` 때문에 머리 아파할 필요가 없습니다. 단순히 이렇게 질문하면 됩니다:
*"흐름을 따라 어떻게 뭉쳐(pack) 있는가?"*
*"흐름을 가로질러 어떻게 정렬(align)되어 있는가?"*

---

## 2. 대통합 매핑 테이블 (The Great Mapping Table)

| Figma UI 컨트롤 | Figma 값 | 함수형 클래스 문법 | CSS 실제 구현 |
| :--- | :--- | :--- | :--- |
| **Direction** | Horizontal `→` | `hbox` | `flex-direction: row` |
| | Vertical `↓` | `vbox` | `flex-direction: column` |
| **Resizing (W)** | Fixed `[---]` | `w(120)`, `w(320)` | `width: N; flex: 0 0 auto;` |
| | Hug `>---<` | `w(hug)` | `width: max-content;` |
| | Fill `[<->]` | `w(fill)` | `flex: 1; min-width: 0;` |
| **Resizing (H)** | Fixed `[|]` | `h(48)` | `height: N; flex: 0 0 auto;` |
| | Hug `>|<` | `h(hug)` | `height: max-content;` |
| | Fill `[|^|]` | `h(fill)` | `align-self: stretch; height: auto;` (Row일 때)<br>`flex: 1; min-height: 0;` (Col일 때) |
| **Spacing Mode** | Packed | `pack(start)` (기본) | `justify-content: flex-start` |
| | | `pack(center)` | `justify-content: center` |
| | | `pack(end)` | `justify-content: flex-end` |
| | Space Between | `pack(space)` | `justify-content: space-between` |
| **Alignment** | Top / Left | `align(start)` | `align-items: flex-start` |
| | Center | `align(center)` | `align-items: center` |
| | Bottom / Right | `align(end)` | `align-items: flex-end` |
| | Stretch (Text) | `align(stretch)` | `align-items: stretch` |

---

## 3. 예시 시나리오

### 시나리오 A: 표준 헤더 (양끝 정렬)
*Figma: Horizontal, Fill Width, Space Between, Align Center*

```html
<div class="hbox w(fill) pack(space) align(center)">
  <div class="logo">Logo</div>
  <div class="nav">Menu</div>
</div>
```

### 시나리오 B: 카드 UI (수직 쌓기, 좌상단 정렬)
*Figma: Vertical, Fixed Width, Hug Height, Packed Top-Left*

```html
<div class="vbox w(320) h(hug) pack(start) align(start)">
  <div class="image h(200) w(fill)">Image</div>
  <div class="content w(fill) h(hug)">Text</div>
</div>
```

### 시나리오 C: 중앙 정렬 히어로 섹션 (정중앙)
*Figma: Vertical, Fill Screen, Packed Center, Align Center*

```html
<div class="vbox w(screen) h(screen) pack(center) align(center)">
  <h1>Hero Title</h1>
</div>
```

---

## 4. `h="fill"`의 모호성 해결

질문하신 `h="fill"` 역시 `w="fill"`과 마찬가지로 부모 컨텍스트에 따라 다르게 작동해야 합니다. 우리가 정의한 CSS 자식 결합자 전략이 이를 완벽하게 처리합니다.

```css
/* 부모가 Row (HBox)일 때 */
/* h="fill"은 "컨테이너 높이에 맞춰 늘어나라(Stretch)"는 의미 */
.hbox > .h\(fill\) {
  align-self: stretch;
  height: auto; 
}

/* 부모가 Column (VBox)일 때 */
/* h="fill"은 "남은 수직 공간을 나눠 가져라(Growth)"는 의미 */
.vbox > .h\(fill\) {
  flex-grow: 1;
  min-height: 0;
}
```

이로써 **함수형 클래스 문법** + **컨텍스트 인식 CSS** 조합이 Figma의 멘탈 모델을 코드로 이식하는 가장 완벽한 솔루션임을 확인할 수 있습니다.
