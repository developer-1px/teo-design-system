안티그래비티 팀(개발/구현 담당)에게 전달할 수 있도록, 우리가 논의한 모든 내용을 **공식 기술 명세서(Technical Specification)** 형태로 정리했습니다.

이 문서는 **IDDL Page Component v5.0**의 구현 기준이 됩니다.

---

# IDDL Specification: Page Component

**Version:** 5.0 (Final)
**Target:** Antigravity Engineering Team
**Subject:** Page Physical Laws & Layout Strategy

## 1. 개요 (Overview)

`Page` 컴포넌트는 애플리케이션의 최상위 컨테이너로, 다음 두 가지 책임을 가집니다.

1. **Role (물리법칙):** 뷰포트의 행동 양식(스크롤, 높이, 너비 제약)을 결정합니다.
2. **Layout (공간구획):** 콘텐츠를 배치할 Grid/Flex 슬롯 구조를 결정합니다.

개발자는 복잡한 CSS를 직접 작성하지 않고, 오직 **의도(Intent)** 만을 선언하여 표준화된 UI를 구성합니다.

---

## 2. 타입 정의 (Type Definitions)

### 2.1. Page Role (Physics)

페이지가 브라우저 뷰포트와 상호작용하는 물리적 방식을 정의합니다.

```typescript
export type PageRole = 
  | 'Document'    // [Default] 반응형 문서. Window Scroll. (Blog, News)
  | 'Application' // 웹 애플리케이션. 100vh 고정. Container Scroll. (Admin, Dashboard)
  | 'Focus'       // 단일 행동 집중. Center 정렬. No Scroll/Nav. (Login, Payment)
  | 'Immersive'   // 몰입형 경험. Scroll Snap. (Landing, Presentation)
  | 'Overlay'     // 모달형 페이지. Dimmed Background. (Quick View)
  | 'Paper';      // 인쇄/고정 규격. Fixed Aspect Ratio. (Invoice, Resume)

```

### 2.2. Page Layout (Zoning)

Role 내부에서 콘텐츠를 배치할 Grid Template 전략입니다.

```typescript
export type PageLayout = 
  | 'Single'      // [Default] 1단 구조 (Header-Main-Footer)
  | 'Sidebar'     // 2단: 좌측 네비게이션 주도 (Nav-Main)
  | 'Aside'       // 2단: 우측 정보 보조 (Main-Aside)
  | 'HolyGrail'   // 3단: 좌우 패널 (Nav-Main-Aside)
  | 'Mobile'      // 앱형: 상단 헤더 + 하단 탭바 (Header-Main-Dock)
  | 'Split'       // 분할: 50:50 또는 Master-Detail (Panel-Panel)
  | 'Studio';     // 복합: IDE 스타일 다중 패널

```

---

## 3. 인터페이스 (Interface)

개발자가 사용할 최종 Props입니다. `Layout` 속성에 따라 활성화되는 Slot이 달라집니다.

```typescript
import { ReactNode } from 'react';

export interface PageProps {
  /**
   * [Identity] 페이지의 유일한 식별자 (Browser Title, H1)
   * @required
   */
  title: string;

  /**
   * [Physics] 페이지의 물리적 동작 방식
   * @default 'Document'
   */
  role?: PageRole;

  /**
   * [Zoning] 공간 분할 템플릿
   * @default 'Single'
   */
  layout?: PageLayout;

  // --- Slots (Layout Dependent) ---

  /** Main Content Slot (Always Available) */
  children: ReactNode;

  /** Header Slot (Global) */
  header?: ReactNode;

  /** Footer Slot (Layout에 따라 위치가 달라짐) */
  footer?: ReactNode;

  /** Left Navigation Slot (Visible only in Sidebar, HolyGrail, Studio) */
  nav?: ReactNode;

  /** Right Context Slot (Visible only in Aside, HolyGrail) */
  aside?: ReactNode;

  /** Bottom Fixed Slot (Visible only in Mobile) */
  dock?: ReactNode;
}

```

---

## 4. 구현 매트릭스 (Implementation Matrix)

FE 팀은 `Role`과 `Layout`의 조합에 따라 다음 CSS 전략을 적용해야 합니다.

### 4.1. Role별 CSS 초기화 (Base Styles)

| Role | Height Strategy | Scroll Strategy | Width Strategy |
| --- | --- | --- | --- |
| **Document** | `min-height: 100vh` | `body { overflow-y: auto }` | `max-width: 1200px; margin: 0 auto;` |
| **Application** | `height: 100vh` | `body { overflow: hidden }` | `width: 100%` |
| **Focus** | `min-height: 100vh` | `overflow: hidden` (or auto) | `display: flex; justify-content: center;` |

### 4.2. Layout별 Grid Template (Structure)

레이아웃에 따라 **Footer의 위치**와 **Grid Area**가 달라집니다.

#### A. Single (Default)

* **특징:** 가장 단순한 흐름.
* **Footer:** Main 바로 아래 위치.

```css
/* Role=Application일 경우 */
display: flex; flex-direction: column;
/* Header -> Main(flex:1) -> Footer */

```

#### B. Sidebar (Nav Driven)

* **특징:** 좌측 메뉴 고정.
* **Footer:** **Local Scope** (Main 영역의 끝에 붙음. Nav 밑으로 가지 않음).

```css
display: grid;
grid-template-areas: 
  "header header"
  "nav    main  "
  "nav    footer"; /* Footer is inside content column */
grid-template-columns: 240px 1fr;

```

#### C. Aside (Context Driven)

* **특징:** 우측 정보 보조.
* **Footer:** **Global Scope** (화면 전체 너비로 마감).

```css
display: grid;
grid-template-areas: 
  "header header"
  "main   aside "
  "footer footer"; /* Footer spans full width */
grid-template-columns: 1fr 300px;

```

#### D. HolyGrail (Complex)

* **특징:** 3단 구조.
* **Footer:** Main 영역 하단에 위치 (일반적).

```css
display: grid;
grid-template-areas: 
  "header header header"
  "nav    main   aside "
  "nav    footer aside ";
grid-template-columns: 240px 1fr 300px;

```

#### E. Mobile (App-like)

* **특징:** 하단 고정 탭(Dock).
* **Footer:** 지원 안 함 (Dock이 대체).

```css
display: flex; flex-direction: column;
/* Header -> Main(scroll) -> Dock(fixed) */

```

---

## 5. 예외 처리 가이드 (Edge Cases)

### 5.1. Single Layout의 이중성

`Single` 레이아웃은 `Role`에 따라 정렬 방식이 바뀝니다.

* **Doc + Single:** `max-width` 적용 및 `margin: 0 auto` (가운데 정렬된 문서).
* **App + Single:** `width: 100%` (화면을 꽉 채우는 캔버스/대시보드).

### 5.2. 모바일 반응형 (Responsive)

* **Sidebar:** 모바일(`md` 미만)에서는 `Drawer`로 변환되거나 햄버거 메뉴로 축소.
* **Aside:** 모바일에서는 `Main` 하단으로 내려가거나(`Stack`) 숨김 처리(`Hidden`).

---

## 6. 사용 예시 (Usage)

```tsx
// 1. 일반적인 문서 (블로그 글)
// -> Window Scroll, 가운데 정렬(Single), 우측 목차(Aside)
<Page 
  title="IDDL 가이드" 
  role="Document" 
  layout="Aside" 
  aside={<TOC />}
>
  <Section>본문...</Section>
</Page>

// 2. 관리자 대시보드
// -> No Scroll(App), 좌측 메뉴(Sidebar), 내부 스크롤
<Page 
  title="사용자 관리" 
  role="Application" 
  layout="Sidebar"
  nav={<SideMenu />}
>
  <Section>데이터 그리드...</Section>
</Page>

// 3. 로그인 화면
// -> 정중앙 정렬, 네비게이션 없음
<Page title="로그인" role="Focus">
  <LoginForm />
</Page>

```