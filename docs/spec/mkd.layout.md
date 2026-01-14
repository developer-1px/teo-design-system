좋아. 아래는 **“조립 결과물(= leaf preset)”마다** `display / flow / align / justify / gap / padding` + 실전 룰(overflow 책임, min-width:0, ellipsis 안정, slot rules 등)까지 **전부 포함**해서 만든 **MECE 표**야.

전제:

* 숫자 하드코딩 없음 → **전부 CSS 변수(토큰)** 로 표현
* 각 preset은 **완성 조립 결과(1-tier token)**
* 클래스 네이밍은 예시로 `l-{dir}-{context}` + `--{variant}` 사용

---

## 공통 토큰(예시)

```css
:root {
  /* spacing */
  --gap-tight: var(--s-2);
  --gap-default: var(--s-3);
  --gap-loose: var(--s-4);

  --pad-none: 0;
  --pad-tight: var(--s-3);
  --pad-default: var(--s-4);
  --pad-loose: var(--s-6);

  /* bar sizing */
  --bar-h-default: var(--h-10);
  --bar-h-compact: var(--h-9);
  --bar-pad-x: var(--s-4);

  /* grid */
  --grid-col-min-cards: var(--w-60);
  --grid-col-min-cards-compact: var(--w-50);
  --grid-col-min-gallery: var(--w-32);

  /* border/gap helpers */
  --divider: var(--border-subtle);
}
```

---

# Layout preset CSS (MECE 표)

> 컬럼은 **MECE**로 분해했어:
> **Flow / Align / Spacing / Sizing / Overflow / Child·Slot rules / Notes**

### Stack

| preset (leaf)          | Flow (display/flow)                    | Align/Justify                                      | Spacing (gap/padding)                                 | Sizing/Constraints           | Overflow                                      | Child·Slot rules       | Notes                      |
| ---------------------- | -------------------------------------- | -------------------------------------------------- | ----------------------------------------------------- | ---------------------------- | --------------------------------------------- | ---------------------- | -------------------------- |
| `stack.content`        | `display:flex; flex-direction:column;` | `align-items:stretch; justify-content:flex-start;` | `gap:var(--gap-default); padding:var(--pad-none);`    | `min-width:0;`               | `overflow:visible;`                           | `> * { min-width:0; }` | 기본 본문 스택                   |
| `stack.content.tight`  | (same)                                 | (same)                                             | `gap:var(--gap-tight);`                               | (same)                       | (same)                                        | (same)                 | 촘촘한 본문                     |
| `stack.content.loose`  | (same)                                 | (same)                                             | `gap:var(--gap-loose);`                               | (same)                       | (same)                                        | (same)                 | 여유 있는 본문                   |
| `stack.content.scroll` | (same)                                 | (same)                                             | `gap:var(--gap-default);`                             | `min-width:0; min-height:0;` | `overflow:auto; overscroll-behavior:contain;` | `> * { min-width:0; }` | “내가 스크롤 책임”                |
| `stack.section`        | `display:flex; flex-direction:column;` | `align-items:stretch; justify-content:flex-start;` | `gap:var(--gap-loose); padding:var(--pad-default);`   | `min-width:0;`               | `overflow:visible;`                           | `> * { min-width:0; }` | 섹션 블록(리듬+inset)            |
| `stack.section.tight`  | (same)                                 | (same)                                             | `gap:var(--gap-default); padding:var(--pad-default);` | (same)                       | (same)                                        | (same)                 | 섹션이지만 촘촘                   |
| `stack.form`           | `display:flex; flex-direction:column;` | `align-items:stretch; justify-content:flex-start;` | `gap:var(--gap-tight); padding:var(--pad-none);`      | `min-width:0;`               | `overflow:visible;`                           | `> * { min-width:0; }` | 폼 필드 리듬                    |
| `stack.form.center`    | (same)                                 | `align-items:center;`                              | `gap:var(--gap-tight);`                               | `min-width:0;`               | `overflow:visible;`                           | `> * { min-width:0; }` | 좁은 폼/CTA 스택                |
| `stack.list`           | `display:flex; flex-direction:column;` | `align-items:stretch; justify-content:flex-start;` | `gap:var(--gap-tight); padding:var(--pad-none);`      | `min-width:0;`               | `overflow:visible;`                           | `> * { min-width:0; }` | 리스트 컨테이너 기본                |
| `stack.list.dense`     | (same)                                 | (same)                                             | `gap:var(--gap-tight);`                               | (same)                       | (same)                                        | (same)                 | 더 촘촘(동일 gap이면 별도 필요 없을 수도) |

---

### Row

| preset (leaf)         | Flow (display/flow)                 | Align/Justify                                        | Spacing (gap/padding)                                      | Sizing/Constraints                                    | Overflow            | Child·Slot rules       | Notes                  |
| --------------------- | ----------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------- | ------------------- | ---------------------- | ---------------------- |
| `row.header`          | `display:flex; flex-direction:row;` | `align-items:center; justify-content:space-between;` | `gap:var(--gap-default); padding-inline:var(--bar-pad-x);` | `height:var(--bar-h-default); min-width:0;`           | `overflow:hidden;`  | `> * { min-width:0; }` | 좌/우 분리 “헤더 줄”          |
| `row.header.sticky`   | (same)                              | (same)                                               | (same)                                                     | `position:sticky; top:0; z-index:var(--z-sticky,10);` | `overflow:hidden;`  | (same)                 | sticky 헤더              |
| `row.toolbar`         | `display:flex; flex-direction:row;` | `align-items:center; justify-content:space-between;` | `gap:var(--gap-default); padding-inline:var(--bar-pad-x);` | `height:var(--bar-h-default); min-width:0;`           | `overflow:hidden;`  | `> * { min-width:0; }` | 컨트롤 바(깨짐 방지 강함)        |
| `row.toolbar.compact` | (same)                              | (same)                                               | `gap:var(--gap-tight); padding-inline:var(--bar-pad-x);`   | `height:var(--bar-h-compact);`                        | `overflow:hidden;`  | (same)                 | 작은 툴바                  |
| `row.toolbar.sticky`  | (same)                              | (same)                                               | (same)                                                     | `position:sticky; top:0; z-index:var(--z-sticky,10);` | (same)              | (same)                 | sticky 툴바              |
| `row.item`            | `display:flex; flex-direction:row;` | `align-items:center; justify-content:flex-start;`    | `gap:var(--gap-default); padding:var(--pad-none);`         | `min-width:0;`                                        | `overflow:visible;` | `> * { min-width:0; }` | 아이콘+텍스트 등 일반 한 줄       |
| `row.meta`            | `display:flex; flex-direction:row;` | `align-items:baseline; justify-content:flex-start;`  | `gap:var(--gap-tight); padding:var(--pad-none);`           | `min-width:0;`                                        | `overflow:hidden;`  | `> * { min-width:0; }` | 라벨/값/배지 (baseline 안정)  |
| `row.actions`         | `display:flex; flex-direction:row;` | `align-items:center; justify-content:flex-end;`      | `gap:var(--gap-tight); padding:var(--pad-none);`           | `min-width:0;`                                        | `overflow:visible;` | `> * { min-width:0; }` | CTA/버튼 줄(우정렬)          |
| `row.actions.between` | (same)                              | `justify-content:space-between;`                     | (same)                                                     | (same)                                                | (same)              | (same)                 | 좌 설명 + 우 버튼 같은 footer용 |

---

### Wrap

| preset (leaf)      | Flow (display/flow)                                 | Align/Justify                                     | Spacing (gap/padding)                              | Sizing/Constraints | Overflow            | Child·Slot rules       | Notes          |
| ------------------ | --------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------- | ------------------ | ------------------- | ---------------------- | -------------- |
| `wrap.chips`       | `display:flex; flex-direction:row; flex-wrap:wrap;` | `align-items:center; justify-content:flex-start;` | `gap:var(--gap-tight); padding:var(--pad-none);`   | `min-width:0;`     | `overflow:visible;` | `> * { min-width:0; }` | 태그/칩 표준        |
| `wrap.chips.loose` | (same)                                              | (same)                                            | `gap:var(--gap-default);`                          | (same)             | (same)              | (same)                 | 칩이 크거나 여유 필요   |
| `wrap.filters`     | `display:flex; flex-direction:row; flex-wrap:wrap;` | `align-items:center; justify-content:flex-start;` | `gap:var(--gap-default); padding:var(--pad-none);` | `min-width:0;`     | `overflow:visible;` | `> * { min-width:0; }` | 필터 옵션(조금 더 여유) |
| `wrap.actions`     | `display:flex; flex-direction:row; flex-wrap:wrap;` | `align-items:center; justify-content:flex-end;`   | `gap:var(--gap-tight); padding:var(--pad-none);`   | `min-width:0;`     | `overflow:visible;` | `> * { min-width:0; }` | 버튼 무더기(우측 성향)  |

---

### Grid

| preset (leaf)        | Flow (display/flow) | Align/Justify          | Spacing (gap/padding)                              | Sizing/Constraints                                                                             | Overflow                                      | Child·Slot rules            | Notes                     |
| -------------------- | ------------------- | ---------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------- | ------------------------- |
| `grid.cards`         | `display:grid;`     | `align-content:start;` | `gap:var(--gap-default); padding:var(--pad-none);` | `grid-template-columns:repeat(auto-fit,minmax(var(--grid-col-min-cards),1fr)); min-width:0;`   | `overflow:visible;`                           | (옵션) `> * { min-width:0; }` | 카드 반복 표준                  |
| `grid.cards.compact` | (same)              | (same)                 | `gap:var(--gap-tight);`                            | `grid-template-columns:repeat(auto-fit,minmax(var(--grid-col-min-cards-compact),1fr));`        | (same)                                        | (same)                      | 더 촘촘/작은 카드                |
| `grid.cards.scroll`  | (same)              | (same)                 | `gap:var(--gap-default);`                          | `min-width:0; min-height:0;`                                                                   | `overflow:auto; overscroll-behavior:contain;` | (same)                      | 그리드가 스크롤 책임               |
| `grid.gallery`       | `display:grid;`     | `align-content:start;` | `gap:var(--gap-tight); padding:var(--pad-none);`   | `grid-template-columns:repeat(auto-fit,minmax(var(--grid-col-min-gallery),1fr)); min-width:0;` | `overflow:visible;`                           | (same)                      | 썸네일/미디어 타일                |
| `grid.dashboard`     | `display:grid;`     | `align-content:start;` | `gap:var(--gap-default); padding:var(--pad-none);` | `grid-template-columns:repeat(auto-fit,minmax(var(--grid-col-min-cards),1fr)); min-width:0;`   | `overflow:visible;`                           | (same)                      | 위젯 배치(기본은 cards와 같을 수 있음) |

---

### Slots

| preset (leaf)       | Flow (display/flow)                 | Align/Justify                                         | Spacing (gap/padding)                                                               | Sizing/Constraints                                             | Overflow            | Child·Slot rules                                                                                    | Notes         |
| ------------------- | ----------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------- | ------------- |
| `slots.media`       | `display:flex; flex-direction:row;` | `align-items:flex-start; justify-content:flex-start;` | `gap:var(--gap-default); padding:var(--pad-none);`                                  | `min-width:0;`                                                 | `overflow:visible;` | `.leading{flex:0 0 auto;}`<br/>`.body{flex:1 1 auto; min-width:0;}`<br/>`.trailing{flex:0 0 auto;}` | 리스트 아이템 수렴 패턴 |
| `slots.media.tight` | (same)                              | (same)                                                | `gap:var(--gap-tight);`                                                             | (same)                                                         | (same)              | (same)                                                                                              | 촘촘한 아이템       |
| `slots.keyvalue`    | `display:grid;`                     | `align-items:start;`                                  | `column-gap:var(--gap-default); row-gap:var(--gap-tight); padding:var(--pad-none);` | `grid-template-columns:var(--kv-key-w,auto) 1fr; min-width:0;` | `overflow:visible;` | `.value{min-width:0;}`                                                                              | key/value 2열  |

---

### Center

| preset (leaf)   | Flow (display/flow) | Align/Justify                                 | Spacing (gap/padding)                               | Sizing/Constraints           | Overflow            | Child·Slot rules       | Notes      |
| --------------- | ------------------- | --------------------------------------------- | --------------------------------------------------- | ---------------------------- | ------------------- | ---------------------- | ---------- |
| `center`        | `display:flex;`     | `align-items:center; justify-content:center;` | `gap:var(--gap-default); padding:var(--pad-none);`  | `min-width:0; min-height:0;` | `overflow:visible;` | `> * { min-width:0; }` | 로딩/빈상태/히어로 |
| `center.padded` | (same)              | (same)                                        | `gap:var(--gap-default); padding:var(--pad-loose);` | (same)                       | (same)              | (same)                 | 화면 여백 포함   |

---

## 공통 “실전 룰” (옵션이 아니라 규약으로 추천)

아래는 대부분 preset에 공통으로 붙여도 되는, 깨짐 방지 룰이야(원하면 전역으로 넣고 표에서는 생략 가능).

```css
/* 텍스트/버튼/인풋이 컨테이너를 밀어내는 문제 방지 */
.frame, .frame * { min-width: 0; }

/* 클릭 가능한 컨테이너를 나중에 state로 다룰 때 대비 */
.frame { -webkit-tap-highlight-color: transparent; }
```

