# Table Builder UX 전략: "The Canvas is the Controller"

사용자의 피드백을 반영하여, 구시대적인 "Tab & Form" (설정 창과 미리보기가 분리된) 방식을 폐기하고, **"직접 조작(Direct Manipulation)"** 기반의 모던 빌더 UI를 정의합니다.

## 1. 핵심 방향성: "No Sidebar, Just Overlays"
화면 좌/우측의 고정된 설정 패널(Sidebar)을 없앱니다.
모든 설정은 **"사용자가 보고 있는 그 요소(Data Ink)"** 위에서 즉각적인 **Overlay (Popover/Context Menu)** 로 이루어집니다.

---

## 2. Next-Gen UX 제안 (Beyond Notion)

Notion의 Popover 방식조차 이제 표준(Standard)이 되었습니다. 최신 트렌드(Arc, Linear, Apple Vision Pro)에서 영감을 받은 **더 진보된 UX 패턴 2가지**를 제안합니다. (AI 제외)

### Option A. "Spatial Floating Dock" (공간형 인터페이스)
*Apple Vision Pro 및 최신 iPadOS, Arc Browser 스타일*

*   **컨셉**: 설정을 헤더에 붙박이(Popover)로 띄우면 **데이터를 가립니다.** 이를 해결하기 위해 **"하단 중앙 플로팅 독(Island)"**을 사용합니다.
*   **동작 방식**:
    1.  사용자가 특정 컬럼(또는 여러 컬럼)을 선택합니다.
    2.  화면 하단 중앙(또는 테이블 하단)에 **"Contextual Dock"**이 떠오릅니다.
    3.  Dock에는 현재 선택된 대상에 유효한 액션만 뜹니다: `[Type: Text] [Sort] [Filter] [Delete]`
*   **장점**:
    *   **가시성 확보**: 설정창이 데이터를 절대 가리지 않습니다.
    *   **Focus**: 사용자가 "지금 내가 무엇을 조작하는가"에 집중하게 합니다.
    *   **Multi-Select**: 여러 컬럼을 잡고 한 번에 "Type: Number"로 바꾸는 등의 일괄 처리가 매우 자연스럽습니다.

### Option B. "Cmd+K / Slash Interface" (키보드 퍼스트)
*Linear, Superhuman 스타일의 전문가 및 키보드 중심 UX*

*   **컨셉**: 마우스 이동 거리를 '0'으로 만듭니다. UI를 띄우지 않고 키보드로 해결합니다.
*   **동작 방식**:
    1.  ** 헤더 클릭** 후 바로 타이핑 가능한 상태가 됩니다.
    2.  이름을 수정하다가 `/`를 치면 **"Type Commander"**가 펼쳐집니다.
    3.  `/status` 엔터 -> Status 타입으로 변경.
    4.  `/sort` 엔터 -> 정렬.
*   **장점**:
    *   **Speed**: 숙련된 관리자(Admin)에게 압도적인 속도를 제공합니다.
    *   **Minimalism**: 평소에는 그 어떤 설정 버튼도 보이지 않는 "Extreme Minimal" 상태를 유지할 수 있습니다.

---

## 3. 종합 제안: "Hybrid Pro"

우리의 Table Builder는 **"Option A (Spatial Dock)"**를 메인 인터랙션으로 채택하되, **"Option B (Slash)"**를 파워 유저용으로 숨겨두는 것을 제안합니다.

### 3.1. 화면 구조 (Proposed Layout)
1.  **Canvas**: 화면 전체를 테이블이 차지. 사이드바 없음.
2.  **Interactive Header**: 헤더는 단순 버튼. 누르면 Selection 상태(파란 테두리)가 됨.
3.  **Floating Action Bar (The Dock)**:
    *   헤더가 선택되면 하단에 검은색 알약 모양(Pill-shape)의 바가 뜸.
    *   `[Icon: Text]` `[Name: Title]` `[Sort]` `[Density]`
    *   이 바에서 타입을 바꾸거나 옵션을 수정.

### 3.2. 기대 효과
*   기존의 "Popover가 뜨면 뒤의 내용이 안 보여서 답답한" 문제를 해결.
*   "뭔가 있어 보이는(State-of-the-art)" 느낌을 줌. (Arc Browser나 최신 생산성 툴 느낌)

---

## 4. 기존 정의 (Standard Popover) - Legacy Reference
*(이전 논의된 일반적인 Notion 방식 - 비교용)*
*   **Header Click**: "설정 팝오버" 호출.
*   **Main**: 이름 수정 (Input), 타입 아이콘 클릭 시 타입 변경.
*   **단점**: 팝오버가 뜨면 바로 밑의 1-3번째 행 데이터가 가려짐. 데이터에 기반한 의사결정을 방해함.

## 5. 구현 로드맵 (Interaction First)
1.  **Selection Engine**: 컬럼/Row 선택 상태 관리 (Zustand).
2.  **Floating Dock**: `Framer Motion` 등을 활용한 부드러운 진입/이탈 애니메이션.
3.  **Slash Command**: 헤더 Input에서의 Command Parser 구현.
