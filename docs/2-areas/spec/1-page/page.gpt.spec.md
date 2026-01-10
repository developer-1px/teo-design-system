아래 표는 **PageRole(물리법칙: 스크롤/뷰포트)** × **PageLayout(공간구획: 슬롯 배치)** 조합이 브라우저에서 **Grid / Flex로 어떻게 구현되는지**를 “치트시트” 형태로 고정한 매트릭스입니다.

* **Document**: 기본은 *Window scroll* (body/viewport가 스크롤 컨테이너)
* **Application**: 기본은 *Viewport fixed + 내부(Main/Pane) scroll* (`height: 100dvh; overflow: hidden`)
* **Focus**: 기본은 *centered / no-scroll*(필요 시 내부 스크롤)
* **Fullscreen**: 기본은 *viewport fixed / no-scroll*(프레젠테이션·키오스크)

---

## IDDL Page Implementation Matrix (Role × Layout)

| Role + Layout           | CSS 전략                | 구조(슬롯)                                                             | 스크롤 주체          | CSS 핵심 포인트                                                          |
| ----------------------- | --------------------- | ------------------------------------------------------------------ | --------------- | ------------------------------------------------------------------- |
| Document + Single       | Flex Column(또는 block) | Header? + Container + Footer?                                      | Window          | `min-height:100vh;` `flex-direction:column;`                        |
| Application + Single    | Flex Column           | Header? + Container(scroll) + Footer?                              | Container       | `height:100dvh; overflow:hidden;` `main{overflow:auto}`             |
| Focus + Single          | Flex Center           | Center(Container)                                                  | 없음(기본)          | `height:100dvh; display:flex; place-items:center; overflow:hidden;` |
| Fullscreen + Single     | Flex Column           | Header? + Container + Footer?                                      | 없음(기본)          | `height:100dvh; overflow:hidden;`                                   |
| Document + Sidebar      | Grid                  | Header? / Navigator + Container / Footer?                          | Window          | `grid-template-columns: var(--nav) 1fr;` `nav{position:sticky}`     |
| Application + Sidebar   | Grid                  | Header? / Navigator(fixed) + Container(scroll) / Footer?           | Container       | `height:100dvh; overflow:hidden;` `main{overflow:auto}`             |
| Document + Aside        | Grid                  | Header? / Container + Aside / Footer(full width)                   | Window          | `grid-template-columns: 1fr var(--aside);` `aside{position:sticky}` |
| Application + Aside     | Grid                  | Header? / Container(scroll) + Aside(fixed) / Footer?               | Container       | `height:100dvh; overflow:hidden;` `main{overflow:auto}`             |
| Document + HolyGrail    | Grid                  | Header / Navigator + Container + Aside / Footer(full width)        | Window          | `grid-template-columns: var(--nav) 1fr var(--aside);`               |
| Application + HolyGrail | Grid                  | Header / Navigator(fixed)+Container(scroll)+Aside(fixed) / Footer? | Container       | 전형적 3-pane 앱                                                        |
| Document + Split        | Grid(또는 Flex)         | PanelLeft + PanelRight                                             | Window(또는 각 패널) | 문서형 split은 “길이 늘어남”이 자연스러움                                          |
| Application + Split     | Grid                  | PanelLeft(scroll) + PanelRight(scroll)                             | 각 Panel         | `height:100dvh; overflow:hidden;` `pane{overflow:auto}`             |
| Document + Studio       | Grid(rare)            | IDE 슬롯                                                             | Window          | 보통 Document에 Studio는 비권장(앱형 권장)                                     |
| Application + Studio    | Grid                  | Activity/Sidebars/Editor/Panel/Status                              | Editor/Panel    | IDE 전용: 다중 패널+독립 스크롤                                                |
| Document + Blank        | Block                 | 자유                                                                 | Window          | 레이아웃 관여 최소                                                          |
| Application + Blank     | Block                 | 자유                                                                 | 내부 컨테이너(선택)     | `height:100dvh; overflow:hidden;` 필요 시 자식에서 스크롤                     |

> 요점: **Role이 “높이/overflow/scroll 주체”를 결정**하고, **Layout이 “grid template(슬롯 배치)”를 결정**합니다.

---

## Grid Template Areas (레이아웃별 표준 도식)

아래는 “슬롯의 위치 + Footer의 운명”을 가장 명확히 고정하는 **표준 grid-areas**입니다.
(문서형/앱형 차이는 주로 `height/overflow`와 `sticky vs fixed`에서 갈립니다.)

### 1) Sidebar

```css
/* common */
.page {
  display: grid;
  grid-template-columns: var(--nav, 240px) 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "nav    main"
    "nav    footer";
}

/* Document role */
.page { min-height: 100vh; }
.page > nav { position: sticky; top: var(--header-h, 0px); align-self: start; }

/* Application role */
.page { height: 100dvh; overflow: hidden; }
.page > main { overflow: auto; }
```

### 2) Aside (Footer는 전체 폭으로 닫는 게 디팩터)

```css
.page {
  display: grid;
  grid-template-columns: 1fr var(--aside, 320px);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "main   aside"
    "footer footer";
}

/* Document */
.page { min-height: 100vh; }
.page > aside { position: sticky; top: var(--header-h, 0px); align-self: start; }

/* Application */
.page { height: 100dvh; overflow: hidden; }
.page > main { overflow: auto; }
```

### 3) HolyGrail (3-pane)

```css
.page {
  display: grid;
  grid-template-columns: var(--nav, 240px) 1fr var(--aside, 320px);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer"; /* 문서형 기준: footer는 전체 폭 */
}

/* Document */
.page { min-height: 100vh; }
.page > nav, .page > aside { position: sticky; top: var(--header-h, 0px); align-self: start; }

/* Application */
.page { height: 100dvh; overflow: hidden; }
/* 앱형에서는 footer를 main 아래에 두고 싶으면 areas를 아래처럼 바꿔도 됨:
   "header header header"
   "nav    main   aside"
   "nav    footer aside"
*/
.page > main { overflow: auto; }
```

### 4) Split (앱형은 “각 pane 독립 스크롤”이 디팩터)

```css
.page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "left right";
}

/* Application */
.page { height: 100dvh; overflow: hidden; }
.page > .left, .page > .right { overflow: auto; }

/* Document */
.page { min-height: 100vh; } /* window scroll이 기본 */
```

### 5) Studio (IDE-like)

```css
.page {
  display: grid;
  grid-template-columns: var(--activity, 48px) var(--primary, 260px) 1fr var(--secondary, 320px);
  grid-template-rows: 1fr var(--panel, 240px) var(--status, 28px);
  grid-template-areas:
    "activity primary editor secondary"
    "activity primary panel  secondary"
    "status   status  status status";
}

/* Application */
.page { height: 100dvh; overflow: hidden; }
.page > .editor, .page > .panel { overflow: auto; }
```

---

## Role별 “공통 베이스” (핵심 3줄만)

* **Document**: `min-height: 100vh;` / *window scroll* / sticky는 허용
* **Application**: `height: 100dvh; overflow: hidden;` / *main(or panes) scroll*
* **Focus/Fullscreen**: `height: 100dvh; overflow: hidden;` / 포커스·중앙배치(=Section/Block로 확장)

---

원하면, 다음 단계로 **(Role × Layout) → “필수 슬롯(Section Role)”**만 추출해서
예: `Sidebar => Navigator + Container (+ Header/Footer)`
이걸 타입으로 잠그는 “Seat Map”까지 이어서 명세화해드릴게요.
