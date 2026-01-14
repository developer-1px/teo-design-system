# Act 1: Sizing의 WHY - "얼마나 존재하는가?"

**Claude**: Sizing 범주를 깊이 파봅시다. "얼마나 존재하는가?"라는 질문의 진짜 의미는 뭘까요?

**User**: 단순히 "width: 200px"을 정하는 게 아니야. "이 요소가 화면에서 얼마나 중요한지", "무엇을 담고 있는지", "어디에 있는지"에 따라 크기가 결정되어야 해.

**Claude**: 아! 그렇다면 Sizing은 사실 3가지 근본 질문으로 나뉘네요:

1. **"얼마나 중요한가?"** (중요도 기반)
   - 중요한 요소 = 큰 공간 차지
   - 부차적 요소 = 작은 공간

2. **"무엇을 담는가?"** (콘텐츠 기반)
   - 텍스트 한 줄 = 콘텐츠 크기만큼 (auto)
   - 긴 문단 = 읽기 편한 너비 (max-width: 680px)
   - 이미지 = 종횡비 유지 (aspect-ratio)

3. **"어디에 있는가?"** (맥락 기반)
   - 사이드바 = 고정 너비 (240px)
   - 메인 콘텐츠 = 유연한 너비 (flex: 1)
   - 모달 = 화면 비율 (80vw, max 600px)

**User**: 맞아! 이 3가지 질문이 Sizing의 의사결정 트리야.

---

# Act 2: Width 결정 트리 - 4가지 전략

**Claude**: Width를 결정하는 방법을 분류해봅시다.

**전략 1: 고정형 (Fixed Width)**
```
"이 요소의 너비가 항상 같아야 하는가?"
├─ "네" → 고정 너비 사용
│   ├─ "좁은 사이드바" → w: 240px
│   ├─ "넓은 사이드바" → w: 320px
│   ├─ "아이콘 버튼" → w: 40px
│   ├─ "작은 칩" → w: 80px
│   └─ "카드 고정폭" → w: 280px
└─ "아니오" → 다른 전략 사용
```

**전략 2: 콘텐츠 기반 (Content-based Width)**
```
"콘텐츠 크기에 맞춰야 하는가?"
├─ "최소한만" → width: min-content
│   └─ 예: 버튼 (텍스트 + 패딩만)
├─ "최대한" → width: max-content
│   └─ 예: 툴팁 (한 줄로 늘어남)
└─ "자동" → width: auto
    └─ 예: 블록 요소 (부모 너비만큼)
```

**전략 3: 비율 기반 (Ratio-based Width)**
```
"부모나 화면 대비 비율로 결정되는가?"
├─ "1/3" → width: 33.333%
├─ "1/2" → width: 50%
├─ "2/3" → width: 66.666%
├─ "전체" → width: 100%
├─ "화면 전체" → width: 100vw
└─ "화면 80%" → width: 80vw
```

**전략 4: 유연형 (Flexible Width)**
```
"형제 요소와 공간을 나눠야 하는가?"
├─ "균등 분배" → flex: 1
├─ "2배 차지" → flex: 2
├─ "늘어나기만" → flex-grow: 1
└─ "줄어들기만" → flex-shrink: 1
```

**User**: 좋아! 근데 이 4가지 전략을 언제 선택하는지 결정 트리가 필요해.

---

# Act 3: Width 전략 선택 Decision Tree

**Claude**: Width 전략을 선택하는 최상위 Decision Tree를 만들어봅시다.

```
"이 요소의 너비를 어떻게 결정할 것인가?"

1단계: "콘텐츠가 너비를 결정하는가?"
├─ YES
│   ├─ "한 줄로 유지" → width: max-content
│   │   └─ 예: 버튼, 태그, 툴팁
│   ├─ "최소 너비만" → width: min-content
│   │   └─ 예: 아이콘만 있는 버튼
│   └─ "블록처럼 늘어남" → width: auto
│       └─ 예: 일반 div, p 태그
└─ NO → 2단계로

2단계: "다른 요소와 공간을 나누는가?"
├─ YES → 유연형 (Flexible)
│   ├─ "균등 분배" → flex: 1
│   │   └─ 예: 3-column layout의 각 열
│   ├─ "더 많이 차지" → flex: 2 (or 3, 4...)
│   │   └─ 예: 메인 콘텐츠 vs 사이드바
│   └─ "남은 공간 차지" → flex-grow: 1
│       └─ 예: 검색창 (아이콘은 고정, 입력창은 늘어남)
└─ NO → 3단계로

3단계: "항상 같은 크기인가?"
├─ YES → 고정형 (Fixed)
│   ├─ "좁은 요소" → w: 40px, 80px, 120px
│   │   └─ 예: 아이콘, 작은 버튼, 칩
│   ├─ "중간 요소" → w: 240px, 320px, 400px
│   │   └─ 예: 사이드바, 패널, 작은 모달
│   └─ "넓은 요소" → w: 600px, 800px, 1200px
│       └─ 예: 모달, 폼, 콘텐츠 컨테이너
└─ NO → 4단계로

4단계: "부모나 화면 기준 비율인가?"
└─ YES → 비율형 (Ratio)
    ├─ "부모의 일부" → width: 33%, 50%, 66%, 100%
    │   └─ 예: 그리드 아이템
    └─ "화면 기준" → width: 80vw, 100vw
        └─ 예: 전체 화면 모달, 풀스크린 히어로
```

**User**: 완벽해! 이제 각 전략별로 구체적인 숫자를 어떻게 고르는지 봐야겠어.

---

# Act 4: 고정형 Width - 숫자 선택 기준

**Claude**: 고정 너비일 때 왜 240px인가? 왜 320px인가? 기준이 있어야 합니다.

**User**: 맞아. 인간 공학적 기준과 디자인 관습이 있어.

**Claude**:

## 고정형 Width 스케일 (WHY 기반)

```
"왜 이 크기인가?"

아이콘/버튼 범위 (40-80px)
├─ 40px : 터치 가능한 최소 크기 (iOS/Android 권장)
│   └─ 예: 아이콘 버튼, 작은 액션
├─ 48px : 데스크탑 최소 터치 영역
│   └─ 예: Material Design 버튼
├─ 64px : 큰 아이콘 버튼
│   └─ 예: FAB (Floating Action Button)
└─ 80px : 강조된 액션
    └─ 예: 히어로 섹션 버튼

컴포넌트 범위 (160-400px)
├─ 160px : 좁은 사이드 패널
│   └─ 예: 아이콘 + 레이블 네비게이션
├─ 240px : 표준 사이드바
│   └─ 예: 파일 탐색기, 메뉴 패널 (가장 흔함)
├─ 280px : 넓은 사이드바
│   └─ 예: 상세 정보 패널, 속성 패널
├─ 320px : 작은 모바일 화면 기준
│   └─ 예: 모바일 메뉴, 드로어
└─ 400px : 좁은 폼/카드
    └─ 예: 로그인 폼, 작은 다이얼로그

콘텐츠 범위 (480-1200px)
├─ 480px : 중간 모달
│   └─ 예: 확인 다이얼로그, 간단한 폼
├─ 600px : 표준 모달
│   └─ 예: 일반적인 다이얼로그, 폼
├─ 680px : 최적 독서 폭 (50-75자/줄)
│   └─ 예: 블로그 포스트, 문서 콘텐츠
├─ 800px : 넓은 콘텐츠
│   └─ 예: 상세 폼, 대시보드 카드
├─ 1000px : 와이드 콘텐츠
│   └─ 예: 테이블, 갤러리
└─ 1200px : 최대 콘텐츠 너비
    └─ 예: 메인 컨테이너 (더 넓으면 가독성 저하)
```

**핵심 원칙**:
- **40px**: 터치 최소값 (인간공학)
- **240px**: 텍스트 레이블 + 아이콘 편안한 너비
- **320px**: 최소 모바일 뷰포트
- **680px**: 최적 독서 폭 (타이포그래피 이론)
- **1200px**: 최대 콘텐츠 너비 (눈의 피로도)

---

# Act 5: Height 결정 트리 - Width와의 차이

**User**: Height는 Width와 다르게 생각해야 해. 대부분은 콘텐츠에 맞춰지니까.

**Claude**: 맞습니다! Height의 기본 원칙:

```
"높이를 어떻게 결정할 것인가?"

1단계: "콘텐츠가 높이를 결정하는가?"
├─ YES (90%의 경우)
│   └─ height: auto
│       └─ 예: 대부분의 div, card, section
└─ NO → 2단계로

2단계: "고정 높이가 필요한가?"
├─ YES
│   ├─ "터치 영역" → h: 40px, 48px, 56px
│   │   └─ 예: 버튼, 리스트 아이템, 입력 필드
│   ├─ "헤더/푸터" → h: 64px, 80px
│   │   └─ 예: 앱 헤더, 네비게이션 바
│   ├─ "카드 높이" → h: 200px, 300px, 400px
│   │   └─ 예: 고정 높이 카드 그리드
│   └─ "사이드바" → h: 100vh (화면 전체)
│       └─ 예: 왼쪽/오른쪽 패널
└─ NO → 3단계로

3단계: "화면 비율 기반인가?"
├─ YES
│   ├─ "전체 화면" → h: 100vh
│   │   └─ 예: 히어로 섹션, 스플래시 화면
│   ├─ "절반 화면" → h: 50vh
│   │   └─ 예: 상단 절반 차지하는 배너
│   └─ "화면 뺀 헤더" → h: calc(100vh - 64px)
│       └─ 예: 헤더 아래 전체 콘텐츠 영역
└─ NO → 4단계로

4단계: "종횡비를 유지해야 하는가?"
└─ YES
    ├─ "정사각형" → aspect-ratio: 1 / 1
    │   └─ 예: 프로필 이미지, 아이콘
    ├─ "와이드 비디오" → aspect-ratio: 16 / 9
    │   └─ 예: 유튜브 영상, 와이드 배너
    ├─ "세로 비디오" → aspect-ratio: 9 / 16
    │   └─ 예: 모바일 스토리, 세로 영상
    └─ "카드 썸네일" → aspect-ratio: 4 / 3
        └─ 예: 카드 상단 이미지
```

**핵심 차이점**:
- **Width**: 레이아웃과 디자인 의도가 결정
- **Height**: 콘텐츠가 결정 (대부분 auto)

---

# Act 6: 고정형 Height - 숫자 선택 기준

**Claude**: 고정 높이를 써야 할 때, 어떤 값을 선택하나요?

```
"왜 이 높이인가?"

인터랙티브 요소 (40-64px)
├─ 40px : 최소 터치 영역
│   └─ 예: 작은 버튼, 칩, 태그
├─ 48px : 표준 입력 필드
│   └─ 예: Input, Select, Textarea 한 줄
├─ 56px : 큰 버튼
│   └─ 예: Primary CTA, 강조 액션
└─ 64px : 리스트 아이템
    └─ 예: Menu item, List row (아이콘 + 텍스트)

헤더/네비게이션 (56-96px)
├─ 56px : 모바일 헤더
│   └─ 예: 모바일 앱바, 작은 네비게이션
├─ 64px : 데스크탑 헤더
│   └─ 예: 웹 앱 상단 바 (가장 흔함)
├─ 80px : 큰 헤더
│   └─ 예: 로고 + 네비게이션 + 검색
└─ 96px : 히어로 헤더
    └─ 예: 마케팅 사이트 상단

콘텐츠 블록 (200-600px)
├─ 200px : 작은 카드
│   └─ 예: 썸네일 + 제목만
├─ 300px : 중간 카드
│   └─ 예: 썸네일 + 제목 + 설명
├─ 400px : 큰 카드
│   └─ 예: 상세 정보 카드
└─ 600px : 피처 섹션
    └─ 예: 히어로 배너, 큰 프로모션

전체 화면 (vh 기반)
├─ 100vh : 전체 화면
│   └─ 예: 사이드바, 스플래시, 히어로
├─ 50vh : 절반 화면
│   └─ 예: 상단 절반 차지 배너
└─ calc(100vh - 64px) : 헤더 제외 전체
    └─ 예: 메인 콘텐츠 영역 (헤더 아래)
```

---

# Act 7: Min/Max 제약의 WHY

**User**: min-width, max-width는 언제 쓰는 거야?

**Claude**: Min/Max는 "유연하되, 한계가 있다"는 의미입니다.

## Max-Width: "이보다 넓어지면 안 된다"

```
"왜 최대 너비 제약이 필요한가?"

독서 가능성 (readability)
├─ max-width: 680px
│   └─ "한 줄에 50-75자 이상이면 읽기 힘듦"
│   └─ 예: 블로그 포스트, 문서, 기사
├─ max-width: 800px
│   └─ "넓은 화면에서도 집중 가능한 폭"
│   └─ 예: 폼, 설정 페이지
└─ max-width: 1200px
    └─ "최대 콘텐츠 컨테이너 너비"
    └─ 예: 사이트 메인 컨테이너

UI 일관성
├─ max-width: 600px
│   └─ "모달은 너무 넓으면 초점 분산"
│   └─ 예: 다이얼로그, 알림
└─ max-width: 400px
    └─ "사이드바는 너무 넓으면 메인 압박"
    └─ 예: 드로어, 사이드 패널

반응형 제어
└─ max-width: 100%
    └─ "부모를 넘지 않음 (이미지 등)"
    └─ 예: img, video
```

## Min-Width: "이보다 좁아지면 안 된다"

```
"왜 최소 너비 제약이 필요한가?"

레이아웃 붕괴 방지
├─ min-width: 240px
│   └─ "사이드바가 너무 좁으면 레이블 깨짐"
│   └─ 예: 네비게이션 패널
├─ min-width: 320px
│   └─ "최소 모바일 뷰포트"
│   └─ 예: 모바일 레이아웃
└─ min-width: 160px
    └─ "버튼이 너무 좁으면 클릭 어려움"
    └─ 예: Primary 버튼

콘텐츠 보호
├─ min-width: 0
│   └─ "Flexbox 기본값 방지 (min-content)"
│   └─ 예: flex 아이템이 줄어들 수 있게
└─ min-width: min-content
    └─ "최소한 콘텐츠는 보여야 함"
    └─ 예: 버튼, 태그
```

## Min-Height: "스크롤 없이 보여야 함"

```
min-height: 100vh
└─ "첫 화면은 스크롤 없이 전체 보임"
└─ 예: 히어로 섹션, 스플래시

min-height: 400px
└─ "빈 상태여도 최소 높이 유지"
└─ 예: 에디터 영역, 드롭존
```

---

# Act 8: 컴포넌트별 Sizing 전략

**Claude**: 실제 컴포넌트들은 어떤 Sizing 전략을 쓰는지 봅시다.

## Button Sizing

```
"버튼 크기는 어떻게 결정하는가?"

Width 전략: 콘텐츠 기반 (Content-based)
├─ width: max-content (기본)
│   └─ "텍스트 + 패딩만큼만"
│   └─ padding: 12px 24px → 버튼 너비 결정
├─ width: 100% (옵션)
│   └─ "부모 너비만큼 (모바일 폼)"
└─ width: 40px (아이콘 전용)
    └─ "정사각형 아이콘 버튼"

Height 전략: 고정 (Fixed)
├─ h: 40px → 작은 버튼 (secondary)
├─ h: 48px → 표준 버튼 (default)
└─ h: 56px → 큰 버튼 (primary CTA)

WHY?
- Width: 텍스트 길이가 다르므로 유동적
- Height: 터치 영역 일관성 필요 → 고정
```

## Card Sizing

```
"카드 크기는 어떻게 결정하는가?"

Width 전략: 유연 또는 고정
├─ Grid 안: flex: 1 또는 width: 33.333%
│   └─ "그리드에서 균등 분배"
├─ 고정 너비: width: 280px, 320px, 400px
│   └─ "고정 카드 그리드"
└─ 전체 너비: width: 100%
    └─ "리스트 형태 카드"

Height 전략: 콘텐츠 기반 (기본) 또는 고정
├─ height: auto (기본)
│   └─ "콘텐츠 양에 따라"
├─ 고정 높이: h: 200px, 300px, 400px
│   └─ "균일한 그리드를 위해"
└─ aspect-ratio: 4 / 3
    └─ "비율 유지 (이미지 썸네일)"

WHY?
- 그리드: 일관성 → 고정 또는 비율
- 리스트: 유연성 → 콘텐츠 기반
```

## Input Field Sizing

```
"입력 필드 크기는?"

Width 전략: 유연 (Flexible)
├─ flex: 1 (기본)
│   └─ "폼 레이아웃에서 남은 공간 차지"
├─ width: 100%
│   └─ "세로 폼에서 전체 너비"
└─ width: 200px, 300px (고정)
    └─ "짧은 입력 (우편번호, 나이 등)"

Height 전략: 고정 (Fixed)
├─ h: 40px → 작은 입력
├─ h: 48px → 표준 입력 (가장 흔함)
└─ h: 56px → 큰 입력

WHY?
- Width: 콘텐츠 길이 예측 불가 → 유연
- Height: UI 일관성 → 고정
```

## Modal Sizing

```
"모달 크기는?"

Width 전략: 고정 + 최대값
├─ width: 480px, max-width: 90vw
│   └─ "작은 확인 다이얼로그"
├─ width: 600px, max-width: 90vw
│   └─ "표준 모달"
└─ width: 800px, max-width: 95vw
    └─ "큰 폼/설정 모달"

Height 전략: 콘텐츠 기반 + 최대값
├─ height: auto, max-height: 90vh
│   └─ "콘텐츠에 맞되, 화면 넘지 않음"
└─ overflow-y: auto
    └─ "넘치면 스크롤"

WHY?
- max-width: 작은 화면 대응
- max-height: 스크롤 가능하게
```

## Sidebar Sizing

```
"사이드바 크기는?"

Width 전략: 고정 (Fixed)
├─ w: 240px → 표준 사이드바 (가장 흔함)
├─ w: 280px → 넓은 사이드바
├─ w: 320px → 더블 컬럼 사이드바
└─ w: 64px → 축소된 아이콘 바

Height 전략: 화면 전체
└─ height: 100vh

WHY?
- Width: 콘텐츠 예측 가능 → 고정
- Height: 항상 화면 전체 → 100vh
```

---

# Act 9: Responsive Sizing - 화면 크기별 전략

**User**: 반응형에서는 어떻게 해?

**Claude**: 화면 크기에 따라 Sizing 전략이 바뀝니다.

```
"화면 크기별 Sizing 전략"

Mobile (< 768px)
├─ 대부분: width: 100%
│   └─ "화면이 좁아서 전체 너비 사용"
├─ 스택 레이아웃: flex-direction: column
│   └─ "가로 공간 부족 → 세로 배치"
└─ 고정 너비 회피
    └─ "240px 사이드바는 드로어로"

Tablet (768px - 1024px)
├─ 2-column: width: 50%
│   └─ "적당한 공간 → 2단 그리드"
├─ 사이드바: width: 240px
│   └─ "공간 여유 → 사이드바 표시"
└─ 콘텐츠: max-width: 680px
    └─ "독서 최적 너비 유지"

Desktop (> 1024px)
├─ 3-column: width: 33.333%
│   └─ "넓은 화면 → 3단 그리드"
├─ 양쪽 사이드바: 240px + flex: 1 + 280px
│   └─ "좌측 네비 + 메인 + 우측 패널"
└─ 콘텐츠: max-width: 1200px
    └─ "최대 너비 제한 (눈 피로)"
```

**핵심 전략**:
```tsx
// Mobile First
<Frame w="100%">  // 모바일: 전체 너비

// Tablet 이상
<Frame w={{ base: "100%", md: "50%", lg: "33.333%" }}>
  // md (768px): 2-column
  // lg (1024px): 3-column
</Frame>
```

---

# Act 10: MDK Sizing Token 체계 설계

**Claude**: 이제 MDK에서 제공할 Sizing Token을 정의해봅시다.

## Size Token 분류

```
"크기 토큰을 어떻게 분류할 것인가?"

Category 1: Interactive Elements (상호작용 요소)
├─ --size-action-sm: 40px   // 작은 버튼/아이콘
├─ --size-action-md: 48px   // 표준 버튼/입력 (기본)
├─ --size-action-lg: 56px   // 큰 버튼/CTA
└─ --size-action-xl: 64px   // 리스트 아이템/메뉴

Category 2: Layout Components (레이아웃 요소)
├─ --size-sidebar-sm: 160px     // 아이콘 사이드바
├─ --size-sidebar-md: 240px     // 표준 사이드바 (기본)
├─ --size-sidebar-lg: 280px     // 넓은 사이드바
├─ --size-sidebar-xl: 320px     // 더블 컬럼
├─ --size-panel-sm: 400px       // 작은 패널
├─ --size-panel-md: 480px       // 중간 패널
└─ --size-panel-lg: 600px       // 큰 패널

Category 3: Content Containers (콘텐츠 컨테이너)
├─ --size-content-sm: 480px     // 좁은 폼
├─ --size-content-md: 680px     // 최적 독서 폭 (기본)
├─ --size-content-lg: 800px     // 넓은 콘텐츠
├─ --size-content-xl: 1000px    // 와이드 콘텐츠
└─ --size-content-max: 1200px   // 최대 너비

Category 4: Modal/Dialog (모달/다이얼로그)
├─ --size-modal-sm: 400px       // 확인 다이얼로그
├─ --size-modal-md: 600px       // 표준 모달 (기본)
└─ --size-modal-lg: 800px       // 큰 모달/설정

Category 5: Headers (헤더)
├─ --size-header-sm: 56px       // 모바일 헤더
├─ --size-header-md: 64px       // 데스크탑 헤더 (기본)
├─ --size-header-lg: 80px       // 큰 헤더
└─ --size-header-xl: 96px       // 히어로 헤더
```

---

# Act 11: Sizing API 설계 - 의미 기반

**User**: 이제 MDK에서 어떻게 쓰게 할 건지 API를 정해보자.

**Claude**: 숫자 대신 "의미"로 크기를 지정하는 API를 만들어봅시다.

## 방법 1: 의미 기반 Props

```tsx
// ❌ Before: 숫자를 외워야 함
<Frame w={60} h={12} />  // 60은 240px? 480px?

// ✅ After: 의미로 선택
<Frame w="sidebar" />        // 240px (자동)
<Frame w="content" />        // 680px
<Frame w="panel.sm" />       // 400px
<Frame w="modal.lg" />       // 800px
```

## 방법 2: 컴포넌트별 기본값

```tsx
// Sidebar는 자동으로 sidebar 너비
<Sidebar />  // w: 240px (기본)
<Sidebar size="sm" />  // w: 160px
<Sidebar size="lg" />  // w: 280px

// Modal은 자동으로 modal 너비
<Modal />  // w: 600px (기본)
<Modal size="sm" />  // w: 400px
<Modal size="lg" />  // w: 800px

// Button은 자동으로 content-based
<Button />  // w: max-content (기본)
<Button size="sm" />  // h: 40px
<Button size="lg" />  // h: 56px
<Button fullWidth />  // w: 100%
```

## 방법 3: 유연형 조합

```tsx
// 3-column layout
<Frame layout="row">
  <Frame flex={1}>Column 1</Frame>
  <Frame flex={2}>Column 2 (2배)</Frame>
  <Frame flex={1}>Column 3</Frame>
</Frame>

// 사이드바 + 메인 + 패널
<Frame layout="row">
  <Frame w="sidebar">Nav</Frame>
  <Frame flex={1}>Main</Frame>
  <Frame w="panel">Properties</Frame>
</Frame>
```

---

# Act 12: 실제 사용 패턴 - Decision Tree 적용

**Claude**: 실제 시나리오에서 Sizing을 어떻게 결정하는지 봅시다.

## 시나리오 1: "카드 그리드를 만들어야 해"

```
Decision Tree:
Q1: "콘텐츠가 너비를 결정하는가?"
A1: No (그리드는 균등 분할)

Q2: "다른 요소와 공간을 나누는가?"
A2: Yes (그리드 아이템들)

Q3: "몇 개 컬럼?"
A3: "반응형으로 1/2/3/4 컬럼"

결정:
```tsx
<Frame layout="grid" columns={{ base: 1, md: 2, lg: 3, xl: 4 }}>
  <Card />  // flex: 1 (자동)
  <Card />
  <Card />
</Frame>

// 또는 고정 너비
<Frame layout="grid" gap={4}>
  <Card w={280} />  // 고정 280px 카드
  <Card w={280} />
  <Card w={280} />
</Frame>
```

## 시나리오 2: "모달 창을 띄워야 해"

```
Decision Tree:
Q1: "콘텐츠가 너비를 결정하는가?"
A1: No (모달은 고정 너비)

Q2: "항상 같은 크기인가?"
A2: Yes, 하지만 작은 화면 대응 필요

Q3: "어떤 크기의 모달?"
A3: "폼이 들어가니까 600px"

결정:
```tsx
<Modal w="modal.md">  // 600px, max-width: 90vw (자동)
  <Form />
</Modal>

// 또는 직접 지정
<Modal w={600} maxW="90vw">
  <Form />
</Modal>
```

## 시나리오 3: "문서 페이지를 만들어야 해"

```
Decision Tree:
Q1: "콘텐츠가 너비를 결정하는가?"
A1: No (독서 최적 폭 필요)

Q2: "항상 같은 크기인가?"
A2: Yes (680px 최적)

Q3: "화면보다 넓으면?"
A3: "작은 화면에서는 전체 너비"

결정:
```tsx
<Frame w="content.md" maxW="100%">  // 680px, 작은 화면은 100%
  <Text.Prose.H1>제목</Text.Prose.H1>
  <Text.Prose.Body>본문...</Text.Prose.Body>
</Frame>

// 또는 ProseDocument 사용 (자동)
<ProseDocument>  // w: 680px, maxW: 100% (자동)
  <Text.Prose.H1>제목</Text.Prose.H1>
  <Text.Prose.Body>본문...</Text.Prose.Body>
</ProseDocument>
```

## 시나리오 4: "앱 레이아웃 (헤더 + 사이드바 + 메인)"

```
Decision Tree:
Header:
- 고정 높이 필요 → h: 64px

Sidebar:
- 고정 너비 필요 → w: 240px
- 화면 전체 높이 → h: 100vh

Main:
- 남은 공간 차지 → flex: 1
- 헤더 제외 높이 → h: calc(100vh - 64px)

결정:
```tsx
<Frame layout="column" h="100vh">
  <Header h="header" />  {/* 64px */}

  <Frame layout="row" flex={1}>
    <Sidebar w="sidebar" />  {/* 240px */}
    <Main flex={1} />  {/* 남은 공간 */}
  </Frame>
</Frame>
```

---

# Act 13: Min/Max 자동 적용 규칙

**Claude**: 특정 컴포넌트는 min/max가 자동으로 적용되어야 합니다.

```
"언제 min/max가 자동 적용되는가?"

Modal/Dialog
├─ 자동 적용: max-width: 90vw, max-height: 90vh
│   └─ WHY? 작은 화면에서 모달이 화면 넘으면 안 됨
└─ 예시:
    <Modal w={600} />
    // 실제: width: 600px, max-width: 90vw

Content Container
├─ 자동 적용: max-width: 100%
│   └─ WHY? 부모를 넘지 않아야 함
└─ 예시:
    <ProseDocument w={680} />
    // 실제: width: 680px, max-width: 100%

Image/Video
├─ 자동 적용: max-width: 100%, height: auto
│   └─ WHY? 비율 유지하며 부모 안에
└─ 예시:
    <img />
    // 실제: max-width: 100%, height: auto

Input Field (flex 상황)
├─ 자동 적용: min-width: 0
│   └─ WHY? Flexbox는 기본값이 min-content라 줄어들지 않음
└─ 예시:
    <Input flex={1} />
    // 실제: flex: 1, min-width: 0

Sidebar
├─ 자동 적용: min-width: 160px (축소 시)
│   └─ WHY? 너무 좁으면 레이블 깨짐
└─ 예시:
    <Sidebar resizable />
    // 실제: width: 240px, min-width: 160px, max-width: 400px
```

---

# Act 14: Aspect Ratio - 비율 기반 Sizing

**User**: aspect-ratio는 언제 써?

**Claude**: "너비는 유동적이지만, 비율은 유지해야 할 때" 씁니다.

```
"언제 aspect-ratio를 사용하는가?"

이미지 썸네일
├─ aspect-ratio: 16 / 9 (와이드)
│   └─ 예: 유튜브 영상, 배너 이미지
├─ aspect-ratio: 4 / 3 (표준)
│   └─ 예: 카드 썸네일, 일반 사진
├─ aspect-ratio: 1 / 1 (정사각형)
│   └─ 예: 프로필 이미지, 아이콘
└─ aspect-ratio: 9 / 16 (세로)
    └─ 예: 모바일 스토리, 세로 영상

카드 그리드
└─ "카드 높이를 균일하게"
    ```tsx
    <Card w="100%" aspectRatio="4/3">
      <CardMedia />  // 상단 4:3 비율
      <CardContent />  // 하단 콘텐츠
    </Card>
    ```

아이콘/로고
└─ "정사각형 유지"
    ```tsx
    <Frame w={12} aspectRatio="1/1">
      <Icon />
    </Frame>
    ```

비디오 플레이어
└─ "비율 유지하며 반응형"
    ```tsx
    <Frame w="100%" aspectRatio="16/9">
      <video />
    </Frame>
    ```
```

**핵심 원칙**:
- Width는 부모에 맞춰 유동적
- Height는 비율로 자동 계산
- 반응형 + 일관성 동시 달성

---

# Act 15: Sizing 충돌 해결 규칙

**Claude**: Width/Height 설정이 충돌할 때 우선순위는?

```
"Sizing 충돌 시 우선순위"

1순위: Min/Max 제약
├─ max-width: 600px
└─ width: 800px
    → 결과: 600px (max가 이김)

2순위: Explicit vs Implicit
├─ 명시적 width
└─ flex: 1 (암묵적 width)
    → 결과: 명시적 width 우선

3순위: Aspect Ratio vs Height
├─ aspect-ratio: 16/9
├─ width: 400px
└─ height: 300px (명시)
    → 결과: height 무시, aspect-ratio 적용
    → 400px × 9/16 = 225px

4순위: Flex vs Width
├─ flex: 1
└─ width: 200px
    → 결과: 충돌! (같이 쓰지 말 것)
    → flex-basis: 200px를 대신 사용

5순위: Content-based vs Fixed
├─ width: auto (content-based)
└─ width: 200px (fixed)
    → 결과: fixed 우선 (명시적이므로)
```

**MDK 규칙**:
```tsx
// ❌ 충돌: flex와 width 동시 사용
<Frame flex={1} w={200} />

// ✅ 해결: flex-basis 사용
<Frame flex={1} basis={200} />

// ❌ 충돌: aspect-ratio와 height 동시
<Frame aspectRatio="16/9" h={300} />

// ✅ 해결: aspect-ratio만 사용
<Frame aspectRatio="16/9" w={400} />
```

---

# Act 16: 반응형 Sizing Token

**Claude**: 화면 크기별로 다른 크기를 쓸 때는?

```tsx
// 방법 1: 객체 형태
<Frame w={{ base: "100%", md: "sidebar", lg: "sidebar.lg" }}>
  // base (mobile): 100% (전체 너비)
  // md (tablet): 240px (사이드바)
  // lg (desktop): 280px (넓은 사이드바)
</Frame>

// 방법 2: 반응형 토큰
<Frame w="responsive.sidebar">
  // 자동으로:
  // mobile: 100% (드로어로 숨김)
  // tablet: 240px
  // desktop: 280px
</Frame>

// 방법 3: Grid columns
<Frame layout="grid" columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
  <Card />  // 각 카드 너비 자동 조정
  <Card />
  <Card />
</Frame>
```

**반응형 Breakpoint**:
```
base:   0px    (모바일)
sm:   640px    (큰 모바일)
md:   768px    (태블릿)
lg:  1024px    (데스크탑)
xl:  1280px    (큰 데스크탑)
2xl: 1536px    (와이드 스크린)
```

---

# Act 17: Sizing Decision Tree 완전판

**Claude**: 전체 Sizing 의사결정을 하나의 트리로 정리합니다.

```
"이 요소의 크기를 어떻게 결정할 것인가?"

┌─────────────────────────────────────────────┐
│ Step 1: Width or Height?                    │
├─────────────────────────────────────────────┤
│                                             │
│ WIDTH 결정                                  │
│ ├─ "콘텐츠가 결정하는가?"                    │
│ │   ├─ YES → auto / min-content / max-content
│ │   └─ NO → Step 2                          │
│ │                                           │
│ ├─ "형제와 공간을 나누는가?"                 │
│ │   ├─ YES → flex: 1 / flex: 2              │
│ │   └─ NO → Step 3                          │
│ │                                           │
│ ├─ "항상 같은 크기인가?"                     │
│ │   ├─ YES → Fixed Width                    │
│ │   │   ├─ Interactive: 40/48/56/64px       │
│ │   │   ├─ Layout: 240/280/320px            │
│ │   │   └─ Content: 680/800/1200px          │
│ │   └─ NO → Step 4                          │
│ │                                           │
│ └─ "부모/화면 기준 비율인가?"                │
│     ├─ YES → 33% / 50% / 100% / 100vw       │
│     └─ NO → default: 100%                   │
│                                             │
│ HEIGHT 결정                                 │
│ ├─ "콘텐츠가 결정하는가?"                    │
│ │   ├─ YES (90%) → auto                     │
│ │   └─ NO → Step 2                          │
│ │                                           │
│ ├─ "고정 높이가 필요한가?"                   │
│ │   ├─ YES → Fixed Height                   │
│ │   │   ├─ Interactive: 40/48/56/64px       │
│ │   │   ├─ Header: 56/64/80/96px            │
│ │   │   └─ Card: 200/300/400px              │
│ │   └─ NO → Step 3                          │
│ │                                           │
│ ├─ "화면 비율인가?"                          │
│ │   ├─ YES → 100vh / 50vh / calc(...)       │
│ │   └─ NO → Step 4                          │
│ │                                           │
│ └─ "종횡비 유지인가?"                        │
│     └─ YES → aspect-ratio: 1/1, 16/9, 4/3  │
│                                             │
│ Step 2: Min/Max 제약 필요한가?               │
│ ├─ max-width: 독서폭(680px), 모달(90vw)     │
│ ├─ min-width: 사이드바(160px), 버튼(80px)   │
│ ├─ max-height: 모달(90vh), 스크롤(80vh)     │
│ └─ min-height: 히어로(100vh), 에디터(400px) │
│                                             │
│ Step 3: 반응형인가?                          │
│ └─ YES → { base, sm, md, lg, xl }          │
│                                             │
└─────────────────────────────────────────────┘
```

---

# Act 18: 컴포넌트별 기본 Sizing 전략 요약

**Claude**: 각 컴포넌트 타입의 기본 전략을 정리합니다.

| 컴포넌트 | Width 전략 | Height 전략 | 이유 |
|---------|-----------|------------|------|
| **Button** | max-content | 48px (고정) | 텍스트 길이 다양, 터치 영역 일관 |
| **Input** | flex: 1 | 48px (고정) | 폼에서 늘어남, 터치 영역 일관 |
| **Card** | flex: 1 또는 280px | auto | 그리드 균등 또는 고정, 콘텐츠 양 다양 |
| **Modal** | 600px, max: 90vw | auto, max: 90vh | 고정 너비, 반응형 대응 |
| **Sidebar** | 240px | 100vh | 고정 너비, 화면 전체 높이 |
| **Header** | 100% | 64px (고정) | 전체 너비, 고정 높이 |
| **Content** | 680px, max: 100% | auto | 독서 최적, 콘텐츠 양 다양 |
| **Image** | 100%, max: 100% | auto | 부모 너비, 비율 유지 |
| **Icon** | 24px (고정) | 24px (고정) | 정사각형 일관성 |
| **List Item** | 100% | 64px (고정) | 전체 너비, 터치 영역 일관 |

---

# Act 19: MDK Sizing API 최종안

**User**: 이제 MDK에서 제공할 Sizing API를 완성하자.

**Claude**:

## API Level 1: 의미 기반 토큰

```tsx
// 의미 있는 이름으로 크기 지정
<Frame w="sidebar" />        // 240px
<Frame w="sidebar.sm" />     // 160px
<Frame w="sidebar.lg" />     // 280px

<Frame w="content" />        // 680px
<Frame w="content.lg" />     // 800px
<Frame w="content.max" />    // 1200px

<Frame w="modal" />          // 600px
<Frame w="modal.sm" />       // 400px
<Frame w="modal.lg" />       // 800px

<Frame h="header" />         // 64px
<Frame h="header.sm" />      // 56px
<Frame h="header.lg" />      // 80px

<Frame w="action" h="action" />  // 48px × 48px (정사각형 버튼)
```

## API Level 2: 컴포넌트 기본값

```tsx
// 컴포넌트는 자동으로 적절한 크기
<Sidebar />                  // w: 240px, h: 100vh (자동)
<Sidebar size="sm" />        // w: 160px
<Sidebar size="lg" />        // w: 280px

<Modal />                    // w: 600px, max: 90vw (자동)
<Modal size="sm" />          // w: 400px
<Modal size="lg" />          // w: 800px

<Button />                   // h: 48px, w: max-content (자동)
<Button size="sm" />         // h: 40px
<Button size="lg" />         // h: 56px
<Button fullWidth />         // w: 100%

<Input />                    // flex: 1, h: 48px (자동)
<Input size="sm" />          // h: 40px
<Input size="lg" />          // h: 56px
```

## API Level 3: 유연형 조합

```tsx
// Flex 레이아웃
<Frame layout="row">
  <Frame w="sidebar">Nav</Frame>
  <Frame flex={1}>Main</Frame>
  <Frame w="panel">Properties</Frame>
</Frame>

// Grid 레이아웃
<Frame layout="grid" columns={3}>
  <Card />  // 자동으로 33.333%
  <Card />
  <Card />
</Frame>

// 반응형 Grid
<Frame layout="grid" columns={{ base: 1, md: 2, lg: 3 }}>
  <Card />  // mobile: 100%, tablet: 50%, desktop: 33.333%
  <Card />
  <Card />
</Frame>
```

## API Level 4: Min/Max 자동 적용

```tsx
// Modal은 자동으로 max-width, max-height 적용
<Modal w={600} />
// 실제: width: 600px, max-width: 90vw, max-height: 90vh

// ProseDocument는 자동으로 max-width 적용
<ProseDocument w={680} />
// 실제: width: 680px, max-width: 100%

// Image는 자동으로 반응형
<img />
// 실제: max-width: 100%, height: auto
```

## API Level 5: Aspect Ratio

```tsx
// 비율 유지
<Frame aspectRatio="16/9" w="100%">
  <video />
</Frame>

<Card aspectRatio="4/3" w={280}>
  <CardMedia />  // 280px × 3/4 = 210px
</Card>

<Avatar aspectRatio="1/1" w={12}>  // 48px × 48px
  <img />
</Avatar>
```

---

# Act 20: 최종 정리 - Sizing Decision Model

**Claude**: Sizing의 모든 의사결정 모델을 정리합니다.

## Sizing의 3가지 근본 질문

1. **"얼마나 중요한가?"** (중요도 기반)
   - 중요 → 큰 공간 (800px, 1200px)
   - 보통 → 중간 공간 (400px, 600px)
   - 부차 → 작은 공간 (160px, 240px)

2. **"무엇을 담는가?"** (콘텐츠 기반)
   - 텍스트 → 독서 최적 폭 (680px)
   - 이미지 → 비율 유지 (aspect-ratio)
   - 버튼 → 콘텐츠 크기 (max-content)
   - 입력 → 유연한 너비 (flex: 1)

3. **"어디에 있는가?"** (맥락 기반)
   - 사이드바 → 고정 너비 (240px)
   - 메인 콘텐츠 → 유연한 너비 (flex: 1)
   - 모달 → 고정 + 반응형 (600px, max: 90vw)
   - 그리드 → 균등 분배 (33.333%)

## 의사결정 순서

```
1. 컴포넌트 타입 확인
   └─ 기본 전략 적용 (Button → max-content, Input → flex: 1)

2. 맥락 파악
   └─ Layout 안인가? Grid 안인가? 독립적인가?

3. Width 전략 선택
   └─ 콘텐츠 기반 / 유연형 / 고정형 / 비율형

4. Height 전략 선택
   └─ auto (90%) / 고정 / vh / aspect-ratio

5. Min/Max 제약 추가
   └─ 독서폭, 모달, 반응형 대응

6. 반응형 조정
   └─ 화면 크기별 전략 변경
```

## Sizing Token 전체 맵

```css
/* Interactive Elements */
--size-action-sm: 40px
--size-action-md: 48px    /* 기본 */
--size-action-lg: 56px
--size-action-xl: 64px

/* Layout Components */
--size-sidebar-sm: 160px
--size-sidebar-md: 240px  /* 기본 */
--size-sidebar-lg: 280px
--size-sidebar-xl: 320px

--size-panel-sm: 400px
--size-panel-md: 480px
--size-panel-lg: 600px

/* Content Containers */
--size-content-sm: 480px
--size-content-md: 680px  /* 기본, 최적 독서 폭 */
--size-content-lg: 800px
--size-content-xl: 1000px
--size-content-max: 1200px

/* Modal/Dialog */
--size-modal-sm: 400px
--size-modal-md: 600px    /* 기본 */
--size-modal-lg: 800px

/* Headers */
--size-header-sm: 56px
--size-header-md: 64px    /* 기본 */
--size-header-lg: 80px
--size-header-xl: 96px
```

## 핵심 원칙

1. **"콘텐츠 우선" (Content First)**
   - 90%는 height: auto (콘텐츠가 결정)
   - Width는 맥락이 결정 (sidebar, content, modal...)

2. **"의미 기반 선택" (Semantic Choice)**
   - 숫자 대신 의미 (w="sidebar", w="content")
   - AI가 이해 가능 ("사이드바니까 240px")

3. **"제약 자동 적용" (Auto Constraints)**
   - Modal → max-width: 90vw (자동)
   - Content → max-width: 100% (자동)
   - Image → max-width: 100%, height: auto (자동)

4. **"반응형 내장" (Responsive Built-in)**
   - 작은 화면 대응 자동
   - Breakpoint 기반 전략 변경

## 결과

```
원래 CSS Sizing:
- width: 0 ~ ∞ (무한)
- height: 0 ~ ∞ (무한)
- 조합: 무한 × 무한 = 무한

MDK Sizing:
- Width 전략: 4가지 (콘텐츠/유연/고정/비율)
- Width 토큰: ~20가지 (의미 기반)
- Height 전략: 4가지 (auto/고정/vh/ratio)
- Height 토큰: ~10가지
- 조합: ~40가지 패턴

무한 → 40가지 (99.999% 감소)
```

**MDK Sizing은 이제 "얼마나 존재하는가?"라는 질문에 명확한 답을 제공합니다.**

---

# 결론

이 대화를 통해 우리는:

1. ✅ Sizing의 3가지 근본 질문 정의 (중요도/콘텐츠/맥락)
2. ✅ Width 4가지 전략 발견 (콘텐츠/유연/고정/비율)
3. ✅ Height 4가지 전략 발견 (auto/고정/vh/ratio)
4. ✅ 고정 크기 선택 기준 정의 (40px/240px/680px/1200px의 WHY)
5. ✅ Min/Max 제약의 WHY 발견 (독서폭, 모달, 반응형)
6. ✅ 컴포넌트별 기본 전략 정립
7. ✅ MDK Sizing Token 체계 설계 (~20개 의미 기반 토큰)
8. ✅ 완전한 Decision Tree 완성
9. ✅ 무한 → 40가지 패턴 (99.999% 감소)

**핵심 가치**:
- "숫자를 외우는 것"이 아니라 "이유를 이해하는 것"
- AI가 추론 가능: "사이드바니까 240px", "독서 콘텐츠니까 680px"
- 일관성 자동 보장: 같은 맥락 → 같은 크기
