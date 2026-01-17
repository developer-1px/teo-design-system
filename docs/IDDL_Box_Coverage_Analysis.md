# IDDL Box 컴포넌트 디자인 커버리지 분석

**분석 일자:** 2026-01-17
**분석 대상:** IDDL Box Props v1.0
**맥락:** FE 수렴 진화(Convergent Evolution)에 따른 보편적이고 미니멀한 모던 웹 애플리케이션/대시보드 환경

---

## 1. 커버리지 요약 (Coverage Summary)

현재 정의된 `Box` props 13개는 **컴포넌트 조립(Component Composition)** 영역의 95% 이상을 커버할 수 있습니다. 그러나 **거시적 레이아웃(Macro Layout)** 및 **특수 배치(Absolute/Overlay)** 영역은 의도적으로 배제되어 있으므로, 이를 담당할 상위 개념(`Section`)이나 하위 개념(`Overlay`)이 필수적입니다.

### ✅ 커버 가능 (Covered)
- **리스트 & 아이템:** 수직/수평 리스트, 카드 리스트, 속성 행(Row)
- **컨테이너 & 패널:** 카드, 모달 본문, 사이드바 내부, 툴바
- **인터랙티브 요소:** 버튼, 칩(Chip), 태그, 메뉴 아이템
- **기본 레이아웃:** Flex 기반의 모든 1차원 배치 (Stacking)

### ❌ 커버 불가 (Not Covered) - *의도된 제약*
- **고정 너비/높이:** 사이드바(240px), 차트 영역(300px) → `Section` 필요
- **2차원 그리드:** 대시보드 위젯 배치 (Masonry 등) → `Grid` 또는 `Section` 필요
- **절대 위치(Overlay):** 뱃지(Badge), 툴팁, 플로팅 버튼(FAB) → `Overlay` 또는 `Box` + CSS 필요
- **반응형 분기:** 모바일/데스크탑 레이아웃 급격한 변경 → `Responsive` 유틸리티 필요

---

## 2. 세부 디자인 패턴별 커버리지 표

| 카테고리 | 디자인 패턴 (Pattern) | 커버 여부 | 구현 방법 (Props 조합) | 비고 |
|:---:|:---|:---:|:---|:---|
| **기본 구조** | **Stack (수직 쌓기)** | ✅ | `row={false}` (default) | 가장 기본적인 형태 |
| | **Row (수평 배치)** | ✅ | `row={true}` | 버튼 그룹, 태그 목록 |
| | **Equal Spacing** | ✅ | `spacing="md"` | 8px, 16px 등 균등 간격 |
| | **Divider (구분선)** | ✅ | `spacing="line"` | 부모가 자식 사이에 선을 그음 |
| **정렬/배치** | **Center (중앙 정렬)** | ✅ | `placement="center"` | 아이콘, 로딩 스피너 |
| | **Split (양쪽 끝 배치)** | ✅ | `placement="center-between"` | 헤더 (로고 ... 메뉴), 리스트 아이템 |
| | **Right/Bottom** | ✅ | `placement="right"`, `placement="bottom"` | 우측 하단 버튼 등 |
| **컨테이너** | **Card (박스형)** | ✅ | `surface="default"` | 카드 UI, 섹션 박스 |
| | **Ghost (투명)** | ✅ | `surface="ghost"` | 호버 시에만 보이는 버튼 배경 |
| | **Edge Attached** | ✅ | `edge="bottom"` | 하단 고정 바 (Radius 자동 제거) |
| **크기 제어** | **Fill (꽉 채우기)** | ✅ | `width="fill"` | 부모 영역 100% 사용 |
| | **Fit (내용 맞춤)** | ✅ | `width="fit"` | 텍스트 길이만큼만 차지 (버튼, 칩) |
| | **Icon Box (정사각형)** | ✅ | `size="md"` | 아이콘 버튼, 아바타 컨테이너 |
| | **Scroll Area** | ✅ | `overflow="scroll-y"` + `height="fill"` | 채팅창, 긴 리스트 |
| **상호작용** | **List Item (클릭 가능)** | ✅ | `interactive={true}` | 호버, 클릭 효과 자동 적용 |
| | **Active State** | ✅ | `selected={true}` | 현재 선택된 메뉴/탭 |
| **미지원 영역** | **Sidebar (고정 폭)** | ❌ | 불가 (Unsupported) | `Section` 컴포넌트 필요 (`width="240px"`) |
| | **Modal (고정 폭)** | ❌ | 불가 (Unsupported) | `Dialog` 컴포넌트 또는 `Section` 필요 |
| | **Badge (아이콘 위)** | ❌ | 불가 (No Absolute) | 별도 `Badge` 컴포넌트 필요 |
| | **Dashboard Grid** | ❌ | 불가 (No Grid) | 별도 `Grid` 레이아웃 필요 |
| | **Media Wrapper** | 🔺 | 제한적 | `aspect-ratio` 미지원으로 CSS 필요 |

---

## 3. 케이스 스터디: "충분한가?" (Sufficiency Check)

모던 FE 앱(CRM, Admin, SaaS)의 실제 화면을 구성한다고 가정했을 때:

### Case A: 이메일 목록 리스트 (Gmail style)
- **필요 요소:** 각 행(Row), 체크박스, 보낸사람(Left), 제목(Fill), 날짜(Right), 호버 효과, 선택 상태.
- **판정:** **100% 커버 가능.**
- **코드:** `Box(row, center-between, interactive, selected)` 조합으로 완벽 구현.

### Case B: 설정 모달 (Settings Dialog)
- **필요 요소:** 헤더(Title + Close), 본문(Scrollable Form), 하단(Save/Cancel), 모달 창 자체(Fixed Size, Centered overlay).
- **판정:** **90% 커버 가능.**
- **누락:** 모달 창 자체의 너비(`width: 600px`)와 화면 중앙 정렬(Overlay).
- **해결:** `Dialog`라는 상위 컴포넌트가 `Box`를 감싸서 너비와 위치를 잡아주면, 내부 컨텐츠는 `Box`로 100% 구성 가능.

### Case C: 대시보드 위젯 (Analytics)
- **필요 요소:** 2x2 그리드, 각 위젯 내부(Title, Chart, Legend).
- **판정:** **내부는 커버 가능, 외부는 불가.**
- **누락:** 2열/3열 그리드 배치.
- **해결:** `Grid` 레이아웃 컴포넌트 필요. `Box`만으로는 Flex wrap으로 흉내낼 수 있으나 정교한 2차원 배치는 어려움.

---

## 4. 결론 (Conclusion)

제안된 `Box` props는 **"Internal Component Layout (내부 컴포넌트 레이아웃)"**을 위한 DSL(Domain Specific Language)로서는 **매우 충분하고 강력합니다.**

- **충분함:** 버튼, 입력폼, 리스트, 카드, 툴바, 네비게이션 바 등 UI의 90%를 차지하는 "덩어리"들을 만드는 데에는 부족함이 없습니다.
- **부족함:** 이 `Box`들을 화면 전체에 어떻게 배치할 것인가(Layout Strategy)에 대한 어휘(`width: 300px`, `grid-template`)는 없습니다.

**전략적 제언:**
`Box`에 픽셀 단위를 추가하여 오염시키지 마십시오. 대신, Box가 감당하지 못하는 영역을 **`Section` (Layout Container)**과 **`Wrapper` (Positioning)** 컴포넌트로 명확히 이관하면, IDDL 시스템은 미니멀하면서도 완벽한 커버리지를 가질 수 있습니다.

> "Box는 레고 블록이고, Section은 레고 판(Baseplate)입니다. 블록에 판의 기능을 넣으려 하지 마십시오."
