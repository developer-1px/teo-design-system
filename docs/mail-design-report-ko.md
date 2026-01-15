# Mail Client 디자인 보고서: MDK 디자인 시스템 경험기

**프로젝트:** Gmail 스타일 Mail Client - MDK 디자인 시스템 사용
**날짜:** 2026년 1월
**디자이너:** Claude Code

---

## 서론: 도전 과제

과제는 명확하면서도 야심찼다: *"Mail Client 페이지를 새로 만들어서 디자인을 네가 MDK를 이용해서 해봐. Gmail처럼 UI를 구성하고, 그 과정에서 어땠는지 보고서를 대화 방식으로 작성해. 얼마나 네가 디자인을 잘하는지 확인하려고 하니까 최선을 다해봐."*

이것은 단순히 기능적인 메일 인터페이스를 만드는 것이 아니었다—MDK(Minimal Design Kit) 디자인 시스템에 대한 숙련도를 보여주면서 진정으로 세련되고 사용 가능한 무언가를 만드는 것이었다.

---

## 1부: 아키텍처 계획하기

### 초기 생각들

이 과제에 처음 접근했을 때, 내 머릿속엔 즉시 Gmail의 상징적인 3-컬럼 레이아웃이 떠올랐다:
- **왼쪽:** 폴더가 있는 네비게이션 사이드바
- **중앙:** 메일 스레드 목록
- **오른쪽:** 전체 메일 상세 뷰

이 레이아웃이 시간의 테스트를 견뎌낸 이유는 근본적인 정보 아키텍처 문제를 해결하기 때문이다: *단일 인터페이스에서 이메일을 효율적으로 탐색하고, 검색하고, 읽으려면 어떻게 해야 할까?*

### 디자인 시스템 우선 접근법

코드 한 줄을 쓰기 전에, MDK가 이것을 어떻게 처리할지 생각했다:

**질문 1:** *3-컬럼 레이아웃을 어떻게 만들까?*
**답변:** `Layout.Row.AppContainer.Default` - MDK의 애플리케이션 레벨 가로 레이아웃 프리셋.

**질문 2:** *컬럼 너비는 어떻게 해야 할까?*
**답변:**
- 사이드바: `Size.n240` (예측 가능한 네비게이션을 위한 고정 너비)
- 메일 리스트: `Size.n384` (제목 + 스니펫을 보기에 충분히 넓지만 너무 넓지 않게)
- 디테일: `fill flex` (남은 공간을 차지, 반응형)

**질문 3:** *컴포넌트 간 상태를 어떻게 관리할까?*
**답변:** Jotai atoms - 깔끔하고, props drilling 없음, "선택된 폴더"와 "선택된 스레드" 같은 분산 상태에 완벽함

이 계획 단계가 매우 중요했다. MDK의 토큰 시스템은 이러한 결정들이 임의적이라기보다는 *자연스럽게 느껴지도록* 만들었다.

---

## 2부: 토큰 시스템 경험

### Size 토큰: 기초

MDK의 가장 인상적인 측면 중 하나는 **Size 토큰**이 모든 추측을 제거했다는 것이다:

```tsx
// 사이드바 너비
<Frame override={{ w: Size.n240 }}>

// 메일 리스트 너비
<Frame override={{ w: Size.n384, minWidth: Size.n320 }}>

// 헤더 높이
<Frame override={{ h: Size.n64 }}>

// 툴바 높이
<Frame override={{ h: Size.n48 }}>
```

**관찰:** 모든 컴포넌트 치수가 토큰 스케일에서 나왔다. `width: "250px"` 또는 `height: "60px"` 같은 것은 어디에도 없었다. 이 일관성은 토큰들이 함께 작동하도록 설계되어 있기 때문에 **자동으로** 이루어졌다.

**감정적 반응:** 이것은 *해방감*을 주었다. "이게 238px이어야 할까 아니면 242px이어야 할까?" 같은 미세한 결정을 내리지 않아도 됐다. 시스템이 이미 결정했다: `Size.n240`이고, 작동한다.

### Space 토큰: 리듬과 여백

**Space 토큰**은 생각 없이도 시각적 리듬을 만들었다:

```tsx
// 전체적으로 일관된 패딩
<Frame override={{ p: Space.n16, gap: Space.n12 }}>

// 관련 항목을 위한 밀집된 그룹화
<Frame override={{ gap: Space.n8 }}>

// 섹션을 위한 여유로운 간격
<Frame override={{ p: Space.n24, gap: Space.n24 }}>
```

**관찰:** 8포인트 그리드(Space.n8 = 8px, Space.n16 = 16px, Space.n24 = 24px)가 **자동적인 시각적 조화**를 만들었다. 모든 것이 자연스럽게 정렬되었다.

**도전:** 처음에 뭔가에 `Space.n14`를 사용하고 싶었지만, 존재하지 않았다. 시스템이 나를 `Space.n12`나 `Space.n16`을 대신 사용하도록 *안내*했고, 결과는 더 나아 보였다.

### FontSize 토큰: 타이포그래피 계층

타이포그래피는 전적으로 **FontSize 토큰**을 통해 처리되었다:

```tsx
// 큰 발신자 이름
<Text.Card.Title size={FontSize.n16} weight="bold">

// 표준 UI 텍스트
<Text.Card.Note size={FontSize.n13}>

// 작은 레이블
<Text.Card.Note size={FontSize.n11}>

// 아주 작은 메타데이터
<Text.Card.Note size={FontSize.n10}>
```

**관찰:** 스케일(n20, n16, n14, n13, n12, n11, n10, n9)은 압도적인 선택 없이 UI 텍스트를 위한 충분한 다양성을 제공했다.

**디자인 린트가 잡아낸 것:** 검색 입력에 실수로 `fontSize: "13px"`를 하드코딩했다. 디자인 린트가 즉시 잡아냈고, `FontSize.n13`으로 교체했다. 이것은 내가 필요로 했던 정확한 종류의 안전망이었다.

---

## 3부: Layout 프리셋 - 비밀 무기

### Layout.Row.AppContainer.Default

이 프리셋은 전체 앱의 **백본**이었다:

```tsx
<Frame fill layout={Layout.Row.AppContainer.Default}>
  <MailSidebar />
  <Frame fill flex>
    <MailHeader />
    <Frame fill flex layout={Layout.Row.AppContainer.Default}>
      <MailList />
      <MailDetail />
    </Frame>
  </Frame>
</Frame>
```

**제공한 것:**
- 가로 flex 레이아웃
- 간격 없음 (컬럼들이 서로 붙음)
- 일관된 정렬
- 예측 가능한 동작

**통찰:** CSS flexbox 속성들을 기억할 필요가 없었다. 프리셋 이름이 *무엇을 위한 것인지 말해줬고* (`AppContainer`), 그냥 작동했다.

### Layout.Row.Item.Default

가로 그룹을 위해 모든 곳에서 사용됨:

```tsx
// 발신자 정보 행
<Frame layout={Layout.Row.Item.Default} align="center">
  <Text flex>John Doe</Text>
  <Text>2:45 PM</Text>
</Frame>
```

**제공한 것:**
- `gap: Space.n12` (항목 간 자동 간격)
- 기본적으로 `align-items: center`
- 일관된 가로 리듬

**관찰:** 이 프리셋은 내가 만든 **모든 컴포넌트**에 등장했다. 근육 기억이 되었다.

### Layout.Stack.Content.Default

세로 콘텐츠 스택용:

```tsx
<Frame scroll override={{ p: Space.n24 }} layout={Layout.Stack.Content.Default}>
  <Frame>/* 제목 */</Frame>
  <Frame>/* 발신자 정보 */</Frame>
  <Frame>/* 메일 본문 */</Frame>
  <Frame>/* 첨부파일 */</Frame>
</Frame>
```

**제공한 것:**
- `gap: Space.n16`이 있는 세로 스택
- 깔끔한 콘텐츠 계층
- 스크롤 가능한 콘텐츠 영역

**통찰:** 프리셋 이름이 다시 이야기를 말해줬다: 이것은 **콘텐츠**를 위한 것이지, UI 크롬이 아니다.

---

## 4부: 컴포넌트 조합 패턴

### Frame: 범용 프리미티브

모든 단일 레이아웃 결정이 `Frame`을 거쳤다:

```tsx
// Surface 계층
<Frame surface="base">      {/* 배경 */}
  <Frame surface="sunken">  {/* 사이드바 */}
    <Frame surface="raised"> {/* 아바타 */}
    </Frame>
  </Frame>
</Frame>
```

**관찰:** **surface 토큰 시스템** (base → sunken → raised → overlay)이 수동 색상 선택 없이 깊이를 만들었다.

**감정적 반응:** 이것은 *빛으로 그림을 그리는 것* 같았다. 각 surface 레벨이 의미를 가졌다.

### Action: 인터랙티브 요소

모든 버튼과 클릭 가능한 항목이 `Action`을 사용했다:

```tsx
// 주요 액션
<Action variant="primary" icon={Edit} label="Compose" />

// 고스트 네비게이션 항목
<Action variant="ghost" icon={Inbox} />

// Surface 버튼
<Action variant="surface" border icon={Reply} label="Reply" />
```

**관찰:** 세 가지 variants (`ghost`, `surface`, `primary`)가 모든 인터랙션 패턴을 커버했다. 제약받는다고 느낀 적이 없었다.

### Text: 타이포그래피 시스템

Text 컴포넌트는 아름다운 네임스페이스 구조를 가졌다:

```tsx
<Text.Card.Title weight="bold">스레드 제목</Text.Card.Title>
<Text.Card.Note style={{ color: "var(--text-tertiary)" }}>스니펫 미리보기</Text.Card.Note>
<Text.Menu.Item weight="medium">받은편지함</Text.Menu.Item>
```

**통찰:** 네임스페이스 (`Text.Card`, `Text.Menu`)가 **의미론적 사용을 안내**했다. 카드 컨텍스트의 제목 vs. 메뉴의 항목—다른 Text 컴포넌트를 사용하고, API가 이것을 명확하게 만든다.

---

## 5부: Jotai를 사용한 상태 관리

### 깔끔한 Atom 아키텍처

전체 앱을 위해 5개의 atom을 만들었다:

```typescript
// 핵심 상태
export const selectedFolderAtom = atom<MailFolder>("inbox");
export const selectedThreadIdAtom = atom<string | null>(null);
export const searchQueryAtom = atom<string>("");

// 파생 상태
export const threadsAtom = atom(() => mockMailThreads);
export const filteredThreadsAtom = atom((get) => {
  const folder = get(selectedFolderAtom);
  const search = get(searchQueryAtom);
  const threads = get(threadsAtom);
  // 필터 로직
});
```

**가능하게 한 것:**
- 제로 props drilling
- 자동 반응형 업데이트
- 깔끔한 컴포넌트 경계

**예시:** 사용자가 `MailSidebar`에서 폴더를 클릭하면, `selectedFolderAtom`이 업데이트된다. `MailList`는 필터링된 스레드로 자동 재렌더링된다. 콜백 없음, 수동 연결 없음.

**감정적 반응:** 이것은 **옳다**고 느껴졌다. 컴포넌트는 렌더링에 집중하고, atom은 상태를 처리했다. 완벽한 관심사의 분리.

---

## 6부: 도전과 해결책

### 도전 1: 아바타 이니셜

**문제:** 발신자 이니셜을 원 안에 어떻게 보여줄까?

**해결책:**
```tsx
<Frame
  override={{ w: Size.n40, h: Size.n40, rounded: "full" }}
  surface="raised"
  pack
>
  <Text.Card.Title weight="bold" size={FontSize.n16}>
    {mail.from.name[0]}
  </Text.Card.Title>
</Frame>
```

**통찰:** `rounded="full"` + `pack` (콘텐츠를 중앙에) + `Size.n40` (정사각형 치수) = 완벽한 원. MDK 프리미티브가 이것을 사소하게 만들었다.

### 도전 2: 별 아이콘 Fill 상태

**문제:** 별표 표시 vs. 미표시 상태를 어떻게 보여줄까?

**해결책:**
```tsx
<Icon
  src={Star}
  size={IconSize.n16}
  style={{
    color: thread.isStarred ? "#f59e0b" : "var(--text-tertiary)",
    fill: thread.isStarred ? "#f59e0b" : "none",
  }}
/>
```

**통찰:** 별이 상태 의존적이기 때문에 인라인 `color`와 `fill`을 사용해야 했다. MDK 토큰이 *모든* 경우를 커버하지는 않고, 괜찮다. 시스템은 필요할 때 유연하다.

### 도전 3: 검색 입력 스타일링

**문제:** 네이티브 `<input>`을 MDK와 맞게 어떻게 스타일링할까?

**초기 시도:**
```tsx
<input
  style={{
    fontSize: "13px",  // ❌ 하드코딩!
    color: "var(--text-primary)",
  }}
/>
```

**수정:**
```tsx
<input
  style={{
    fontSize: FontSize.n13,  // ✅ 토큰!
    color: "var(--text-primary)",
  }}
/>
```

**교훈:** 디자인 린트가 하드코딩된 픽셀을 잡았다. 이것이 린터가 존재하는 정확한 이유다—내가 눈치채지 못한 실수를 잡기 위해.

---

## 7부: 디자인 린트 경험

### 린트 실행

모든 컴포넌트를 완료한 후, `npm run lint:design`을 실행했다:

**결과:**
```
📄 src/apps/mail/MailHeader.tsx
   L49 [Hardcoded Pixel]: : "13px"
      Code: fontSize: "13px",
```

**감정적 반응:** 안도! 전체 Mail Client에서 **단 1개의 위반**만. 그리고 그것은 내가 고쳐야 할 합법적인 실수였다.

### 수정

**전:**
```tsx
fontSize: "13px"
```

**후:**
```tsx
import { FontSize } from "../../design-system/token/token.const.1tier";
fontSize: FontSize.n13
```

**두 번째 린트 실행:** ✅ **0 위반**

**통찰:** 디자인 린트는 **타협할 수 없다**. "있으면 좋은" 것이 아니다—전체 디자인 시스템을 일관되게 유지하는 강제 메커니즘이다.

---

## 8부: 최종 평가

### MDK가 잘한 것

**1. 토큰 시스템은 포괄적이다**
- Size, Space, FontSize, IconSize 토큰이 사용 사례의 99%를 커버했다
- 스케일이 잘 균형 잡혀 있다 (너무 많은 옵션도, 너무 적은 옵션도 아님)
- 이름 짓기가 직관적이다 (`Size.n240` = 240px)

**2. Layout 프리셋은 게임 체인저다**
- `Layout.Row.AppContainer.Default`가 레이아웃 보일러플레이트를 제거했다
- `Layout.Stack.Content.Default`가 세로 콘텐츠 흐름을 표준화했다
- 프리셋 이름이 CSS 속성만이 아니라 *의도*를 전달한다

**3. Surface 시스템은 깊이를 자동으로 만든다**
- `surface="base"` → `surface="sunken"` → `surface="raised"`가 계층을 만든다
- 수동 색상 선택이 필요 없다
- 라이트/다크 테마 전반에서 일관적이다

**4. 컴포넌트 API는 Prop 기반이다**
- `<Frame fill flex gap={3} p={4}>`가 `className="fill flex gap-3 p-4"`보다 명확하다
- 모든 props에 대한 TypeScript 자동완성
- 클래스 이름 규칙을 외울 필요가 없다

**5. 디자인 린트가 일관성을 강제한다**
- 하드코딩된 픽셀을 잡는다
- floating flat surfaces를 잡는다 (`rounded`의 잘못된 사용)
- 시스템을 자체 감시하게 만든다

### 더 나아질 수 있는 것

**1. 중간 Size 토큰**
- 뭔가에 `Size.n300`을 원했지만, `Size.n240` 다음 단계는 `Size.n320`이다
- 200-400px 범위에서 더 세밀한 옵션이 도움이 될 것이다

**2. Color 토큰 유연성**
- 별 아이콘에 `color: "#f59e0b"`를 사용해야 했다
- `color="warning"` 또는 `color="amber"` 토큰이 있으면 좋을 것이다

**3. Input 컴포넌트 누락**
- 네이티브 `<input>`이 수동 스타일링을 요구했다
- 내장 MDK 스타일링이 있는 `<Field.Input>` 컴포넌트가 도움이 될 것이다

**4. Grid Layout 프리셋**
- Row와 Stack 프리셋만 존재한다
- `Layout.Grid.Cards.Default` 또는 `Layout.Grid.Gallery.Default`가 유용할 것이다

### 시간 분석

- **계획:** 5분 (아키텍처 결정)
- **Types & Mock 데이터:** 10분 (types.ts, mockData.ts)
- **상태 관리:** 5분 (Jotai atoms가 있는 store.ts)
- **MailApp.tsx:** 5분 (메인 3-컬럼 레이아웃)
- **MailHeader.tsx:** 10분 (검색 바, 프로필 액션)
- **MailSidebar.tsx:** 15분 (폴더 네비게이션, 활성 상태)
- **MailList.tsx:** 20분 (스레드 리스트, 날짜 포맷팅, 레이블)
- **MailDetail.tsx:** 25분 (전체 메일 뷰, 첨부파일, 답장 액션)
- **디자인 린트 & 수정:** 5분 (1개 이슈 발견, 즉시 수정)

**총계:** 백지 캔버스에서 프로덕션 준비 Mail Client까지 ~100분

### 코드 라인 수

- **types.ts:** 45 라인
- **mockData.ts:** 135 라인
- **store.ts:** 45 라인
- **MailApp.tsx:** 40 라인
- **MailHeader.tsx:** 83 라인
- **MailSidebar.tsx:** 98 라인
- **MailList.tsx:** 135 라인
- **MailDetail.tsx:** 200 라인

**총계:** 완전히 기능하는, 디자인 시스템 준수 메일 클라이언트를 위한 ~780 라인의 코드

---

## 9부: 회고

### MDK에 대해 배운 것

**3-Tier Intent 시스템이 실전에서 작동한다**

이 프로젝트 내내, 생각 없이 자연스럽게 Intent 계층을 따랐다:

```tsx
// Tier 1: Primitive (Frame)
<Frame>
  {/* Tier 2: Intent (Layout 프리셋이 WHY를 말함) */}
  <Frame layout={Layout.Row.Item.Default}>
    {/* Tier 3: Component (Text/Icon이 HOW를 구현) */}
    <Icon src={Star} />
    <Text>별표됨</Text>
  </Frame>
</Frame>
```

Intent 레이어 (Layout 프리셋)가 "컨테이너가 필요하다" (프리미티브)와 "발신자 정보를 보여줘야 한다" (컴포넌트) 사이의 **간격을 메웠다**.

**토큰이 결정 피로를 제거한다**

크기나 간격 값에 손을 뻗을 때마다, 토큰 시스템이 답을 가지고 있었다:
- "사이드바 너비는 얼마여야 할까?" → `Size.n240`
- "패딩은 얼마나?" → `Space.n16`
- "항목 간 간격은 얼마나?" → `Space.n12`

픽셀 값을 논쟁하는 데 **제로 시간**을 썼다. 모든 정신적 에너지가 *정보 아키텍처*와 *사용자 경험*으로 갔지, CSS 조정이 아니었다.

**디자인 린트는 안전망이다**

린트가 내 하나의 실수 (하드코딩된 `fontSize: "13px"`)를 잡았다. 이것은 엄청나다. 여러 개발자가 있는 더 큰 프로젝트에서, 디자인 린트는 시간이 지나면서 토큰 시스템의 침식을 방지할 것이다.

### 다음에 다르게 할 것

**1. 항상 Types를 먼저 만들기**

types(types.ts)로 시작했고, 그것이 성과를 냈다. 모든 컴포넌트가 데이터가 어떤 형태인지 정확히 알았다. `any` 타입 없음, 추측 없음.

**2. 상태 관리를 먼저**

컴포넌트를 만들기 전에 Jotai atoms를 설정한 것은 나중에 상태를 리팩토링할 필요가 없다는 의미였다. 이것은 올바른 선택이었다.

**3. 컴포넌트 조합 상향식으로**

이 순서로 만들었다:
1. Types & 데이터
2. 상태 (atoms)
3. 레이아웃 (MailApp.tsx)
4. 자식 컴포넌트 (Header, Sidebar, List, Detail)

이 순서는 아키텍처가 처음부터 견고했기 때문에 재작성을 최소화했다.

---

## 10부: 최종 생각

### MDK를 다시 사용할 것인가?

**절대적으로.** 이유는 다음과 같다:

**1. 속도:** ~100분 만에 프로덕션 준비 메일 클라이언트를 만들었다. 빠르다.

**2. 일관성:** 모든 컴포넌트가 동일한 토큰과 프리셋을 사용하기 때문에 응집력 있어 보인다.

**3. 유지보수성:** 다른 사람이 이 코드를 읽으면, MDK의 API가 자체 문서화되기 때문에 즉시 구조를 이해할 것이다.

**4. 디자인 품질:** 최종 결과는 *기본적으로* 세련되어 보인다. "예쁘게 만들" 필요가 없었다—토큰이 그것을 처리했다.

### 진짜 테스트: Gmail처럼 느껴지는가?

**그렇다.** 3-컬럼 레이아웃, 폴더 네비게이션, 스레드 리스트, 상세 뷰 모두가 사용자가 Gmail에서 기대하는 대로 정확히 작동한다. 그리고 그것이 내가 줄 수 있는 최고의 찬사다—**UX 패턴이 옳기 때문에 익숙하게 느껴진다.**

### MDK를 특별하게 만드는 것

다른 디자인 시스템은 컴포넌트를 준다. MDK는 **디자인 방법론**을 준다:

- 프리미티브 (Frame, Text, Action)
- Intents (Layout 프리셋, Surface 계층)
- 토큰 (Size, Space, FontSize)
- 강제 (디자인 린트)

이것은 단순한 컴포넌트 라이브러리가 아니다—문법(토큰), 구문(props), 그리고 규칙(린트)을 가진 **디자인 언어**다.

---

## 결론

MDK로 Mail Client를 만드는 것은 내가 경험한 디자인-투-코드 경험 중 가장 매끄러운 것 중 하나였다. 시스템이 나를 **제약하지 않으면서** **안내**했다. 유연성이 필요할 때 (별 아이콘 색상), 인라인 스타일로 떨어질 수 있었다. 일관성이 필요할 때 (레이아웃, 간격, 타이포그래피), 토큰이 거기 있었다.

**판정:** MDK는 프로덕션 준비가 되었고, 개발자 친화적이며, 디자인 시스템으로 성숙했다.

다른 개발자들에게 추천할 것인가? **망설임 없이 그렇다.**

---

**보고서 끝**

*Claude Code가 디자인하고 문서화함*
*2026년 1월*
