제시해주신 제안은 논리적으로 매우 타당합니다. 특히 **Alias(현장 용어)**를 흡수하여 **Core(표준)**로 정규화하는 전략은 대규모 시스템 마이그레이션에 필수적인 유연함입니다.

다만, IDDL의 철학(**"기억하기 쉬운 최소한의 표준"**)과 앞서 우리가 합의한 **PascalCase HTML5** 전략을 유지하기 위해, **이름(Naming)**만 조금 더 **"웹 표준 친화적"**으로 다듬겠습니다.

`Navigator`보다는 `Nav`가, `Container`보다는 `Main`이 개발자에게 더 익숙하고 짧습니다. (타이핑 비용 감소)

이를 반영하여 **IDDL v5.0 최종 Section Role 명세**를 확정해 드립니다.

---

### 1. Core SectionRole Key Pool (The Magnificent 5 + 3)

**"이름이 곧 배치(Grid Area)이자 태그(HTML Tag)다."**
가장 빈번하게 쓰이는 5가지 HTML5 표준 역할과, 앱(App)을 위한 3가지 확장 역할을 **Core**로 정의합니다.

| Role Key | 의미 (Semantics) | 매핑 태그 (A안 강제) | Page Layout Zoning (지정석) | 비고 |
| --- | --- | --- | --- | --- |
| **Header** | **[상단]** 문맥/도구/타이틀 | `<header>` | `header` Area | 로고, GNB, 페이지 타이틀 |
| **Nav** | **[탐색]** 주요 이동 수단 | `<nav>` | `nav` Area (Sidebar) | 좌측 메뉴, LNB |
| **Main** | **[본문]** 핵심 콘텐츠 | `<main>` | `main` Area | **필수.** 스크롤의 주체. |
| **Aside** | **[보조]** 부가 정보 | `<aside>` | `aside` Area | 우측 정보, TOC, 필터 |
| **Footer** | **[하단]** 정보/마무리 | `<footer>` | `footer` Area | 카피라이트, 사이트맵 |
| **Dock** | **[앱]** 모바일 하단 탭 | `<nav>` | `dock` Area (Mobile) | 하단 고정 탭바 |
| **Status** | **[상태]** 시스템 상태바 | `<footer>` | `stat` Area (Studio) | 최하단 얇은 띠 |
| **Panel** | **[분할]** 작업 패널 | `<section>` | `panel` Area (Split) | Split/Studio의 서브 작업창 |

> **수정 제안:** `PanelLeft`, `PanelRight` 같은 **위치 기반 이름**은 제거했습니다.
> * **이유:** `Split` 레이아웃에서도 보통 왼쪽은 `Main`(리스트), 오른쪽은 `Aside` 또는 `Panel`(상세)인 경우가 의미론적으로 맞습니다. 위치 이름(Left/Right)을 쓰면 레이아웃 변경 시 유연성이 떨어집니다.
>
>

---

### 2. Alias Key Pool (현장의 언어를 허용)

개발자가 습관적으로 쓰는 용어들을 허용하되, 내부적으로는 **Core Role**로 변환(Normalize)합니다.

| 입력된 Alias (허용) | 정규화된 Core Role | 이유 |
| --- | --- | --- |
| `Navigator`, `SideBar`, `LNB` | **Nav** | HTML 표준 `<nav>`로 통일 |
| `Container`, `Content`, `Body` | **Main** | HTML 표준 `<main>`으로 통일 |
| `TopBar`, `AppBar`, `TitleBar` | **Header** | HTML 표준 `<header>`로 통일 |
| `Inspector`, `Detail`, `TOC` | **Aside** | 보조 정보는 `<aside>`로 통일 |
| `BottomBar`, `SystemBar` | **Footer** | 하단 정보는 `<footer>`로 통일 |

---

### 3. A안 vs B안 결정: "A안 (Strict Mapping)" 확정

질문하신 두 가지 안 중, IDDL은 무조건 **A안 (렌더러가 태그를 강제)**으로 가야 합니다.

* **이유 1 (접근성):** 개발자가 `role="Nav"`를 썼는데 `<div>`가 렌더링되면 스크린 리더는 이를 네비게이션으로 인식하지 못합니다. **"Role 이름이 곧 시맨틱 태그"**라는 약속을 시스템이 보장해야 합니다.
* **이유 2 (CSS Grid):** `Page` 컴포넌트가 `grid-template-areas`를 짤 때, 자식의 태그가 아니라 **Role**을 보고 배치합니다. 태그와 Role이 일치해야 예측 가능성이 높아집니다.

---

### 4. Section의 책임 경계 (SectionProps Specification)

Role Pool이 확정되었으므로, Section이 **"무엇을 책임지는지"** 명세로 고정합니다.

```typescript
import { ReactNode } from 'react';

/**
 * Section Component Specification
 * IDDL v5.0 - The building block of a Page.
 */
export interface SectionProps {
  // ----------------------------------------------------------------
  // 1. Zoning & Semantics (배치와 의미) - 가장 중요!
  // ----------------------------------------------------------------
  /**
   * 섹션의 역할이자 배치될 위치입니다.
   * - 이 값에 따라 렌더링될 HTML 태그(<main>, <nav> 등)가 결정됩니다 (Strict Mode).
   * - Page Layout의 Grid Area와 자동으로 매핑됩니다.
   * @default 'Main'
   */
  role?: 'Header' | 'Nav' | 'Main' | 'Aside' | 'Footer' | 'Dock' | 'Status' | 'Panel';

  // ----------------------------------------------------------------
  // 2. Identity (신원)
  // ----------------------------------------------------------------
  /**
   * 섹션의 제목. 
   * 스크린 리더의 aria-label로도 사용되며, UI상 헤더가 있을 경우 표시됩니다.
   */
  title?: string;

  /**
   * 섹션의 헤더 우측에 배치될 액션 버튼들입니다.
   */
  actions?: ReactNode;

  // ----------------------------------------------------------------
  // 3. Behavior (동작)
  // ----------------------------------------------------------------
  /**
   * 섹션 내부 스크롤 허용 여부.
   * Page Role이 'Application'일 때, Main 섹션은 기본적으로 true입니다.
   * @default false (Main일 경우 Context에 따라 true)
   */
  scrollable?: boolean;

  // ----------------------------------------------------------------
  // 4. Styling (모양)
  // ----------------------------------------------------------------
  /**
   * 섹션의 시각적 스타일 변형.
   * - Plain: 투명 배경 (Default)
   * - Card: 흰 배경 + 그림자 + 패딩
   */
  variant?: 'Plain' | 'Card' | 'Hero';

  children: ReactNode;
}

```

### 5. IDDL v5.0 최종 아키텍처 요약

이제 모든 퍼즐이 맞춰졌습니다.

1. **Page:** 물리법칙(`Role`)과 방 구조(`Layout`)를 잡는다.
2. **Section:** 자신의 역할(`Role`)을 선언하여 방(`Area`)에 들어간다.
3. **Alias:** 개발자가 `Sidebar`라고 써도 시스템이 `Nav`로 알아듣고 `<nav>` 태그로 렌더링하여 좌측에 꽂아준다.

이 구조면 **Page ShowCase**와 **Section ShowCase** 모두 명확한 "할 일"이 생깁니다.
Page Showcase는 **"레이아웃 전환 시 Section들이 어떻게 재배치되는가"**를 보여주고,
Section Showcase는 **"다양한 Role과 Variant일 때 Section 내부가 어떻게 그려지는가"**를 보여주면 됩니다.

이대로 **Section 구현** 및 **Showcase** 제작으로 넘어가시겠습니까?