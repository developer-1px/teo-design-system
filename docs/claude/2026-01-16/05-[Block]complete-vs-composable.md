# Block 분류: Complete vs Composable

**작성일**: 2026-01-16
**목적**: Block을 "완성품(Complete)"과 "조립형(Composable)"으로 명확히 구분

---

## 핵심 구분 기준

### 1. Complete (완성품) - Props 방식
**정의**: 그 자체로 완결된 기능을 가진 컴포넌트
- ✅ Props로 데이터 전달
- ✅ 내부 구조 고정 (수정 불필요)
- ✅ "통째로" 재사용
- ✅ 예: Table, Calendar, CodeBlock, Dropdown

### 2. Composable (조립형) - Children 방식
**정의**: 조합으로 만드는 UI 패턴
- ✅ Children으로 구조 조합
- ✅ 내부 구조 자유롭게 변경
- ✅ "부분적으로" 재사용
- ✅ 예: Hero, Features, Sidebar

---

## 기존 Block 재분류

### Priority 1: Marketing/Landing Blocks

| Block 이름 | 분류 | 이유 |
|-----------|------|------|
| **Hero** | 🔵 **Composable** | 내부 구조 자유 (Badge, Title, Subtitle, Actions 조합) |
| **Features** | 🔵 **Composable** | Grid + FeatureCard 조합 |
| **CTA** | 🔵 **Composable** | Title + Description + Actions 조합 |
| **Stats** | 🔵 **Composable** | StatCard 여러 개 조합 |
| **FAQ** | 🟢 **Complete** | 아코디언 로직 + 데이터 처리 (완결된 기능) |
| **Testimonials** | 🔵 **Composable** | TestimonialCard 여러 개 조합 (Carousel 포함 시 Complete) |
| **Pricing** | 🟢 **Complete** | 비교 테이블 로직 + 강조 처리 (완결된 기능) |
| **Footer** | 🔵 **Composable** | Columns + Links 조합 |

---

### Priority 2: Application Layout Blocks

| Block 이름 | 분류 | 이유 |
|-----------|------|------|
| **AppHeader** | 🔵 **Composable** | Logo + Navigation + Actions 조합 |
| **Sidebar** | 🔵 **Composable** | Header + NavItems + Footer 조합 |
| **Toolbar** | 🔵 **Composable** | Action 버튼들 조합 |
| **Panel** | 🔵 **Composable** | Header + Sections 조합 |
| **Drawer** | 🟢 **Complete** | 슬라이드 애니메이션 + Backdrop 로직 (완결된 기능) |
| **ContentArea** | 🔵 **Composable** | 단순 Container (children만 받음) |
| **SplitView** | 🟢 **Complete** | Resizable 로직 + 비율 관리 (완결된 기능) |

---

### Priority 3: Specialized Content Blocks

| Block 이름 | 분류 | 이유 |
|-----------|------|------|
| **FeatureCard** | 🟢 **Complete** | Icon + Title + Description 고정 구조 |
| **StatCard** | 🟢 **Complete** | Value + Label + Trend 고정 구조 |
| **TestimonialCard** | 🟢 **Complete** | Quote + Author + Avatar 고정 구조 |
| **FAQItem** | 🟢 **Complete** | 아코디언 토글 로직 (완결된 기능) |
| **PricingCard** | 🟢 **Complete** | Price + Features List + CTA 고정 구조 |
| **TeamCard** | 🟢 **Complete** | Avatar + Name + Role 고정 구조 |

---

### Priority 4: Utility Blocks

| Block 이름 | 분류 | 이유 |
|-----------|------|------|
| **ViewportSelector** | 🟢 **Complete** | 뷰포트 전환 로직 (완결된 기능) |
| **NavigationBar** | 🔵 **Composable** | NavItem 여러 개 조합 |
| **LogoCloud** | 🟢 **Complete** | 로고 그리드 + 스크롤 로직 (완결된 기능) |
| **Badge** | 🟢 **Complete** | Icon + Text 고정 구조 (단순하지만 완결) |

---

### 추가 필요: Complete Component

업계 표준 Complete Component들:

| Component 이름 | 분류 | 이유 | 발견된 앱 |
|---------------|------|------|----------|
| **Table** | 🟢 **Complete** | 정렬/필터/페이징 로직 (완결된 기능) | CRMApp (CRMTable, Tanstack Table) |
| **DataTable** | 🟢 **Complete** | Table + 컬럼 설정 + 상태 관리 | CRMApp |
| **CodeBlock** | 🟢 **Complete** | 문법 강조 + 라인 번호 + 복사 버튼 | 업계 표준 (미구현) |
| **Calendar** | 🟢 **Complete** | 날짜 선택 로직 + 달력 렌더링 | 업계 표준 (미구현) |
| **DatePicker** | 🟢 **Complete** | Calendar + Input 통합 | 업계 표준 (미구현) |
| **Dropdown** | 🟢 **Complete** | 메뉴 열기/닫기 + 위치 계산 | 업계 표준 (미구현) |
| **Select** | 🟢 **Complete** | 옵션 선택 + 검색 + 키보드 네비게이션 | 업계 표준 (미구현) |
| **Combobox** | 🟢 **Complete** | Select + 자동완성 | 업계 표준 (미구현) |
| **Tabs** | 🟢 **Complete** | 탭 전환 로직 + 활성 상태 관리 | 업계 표준 (미구현) |
| **Accordion** | 🟢 **Complete** | 열기/닫기 로직 + 애니메이션 | CMSApp (FAQ에서 사용) |
| **Modal** | 🟢 **Complete** | Overlay + 포커스 트랩 + ESC 닫기 | 업계 표준 (미구현) |
| **Dialog** | 🟢 **Complete** | Modal + 확인/취소 버튼 | 업계 표준 (미구현) |
| **Toast** | 🟢 **Complete** | 알림 표시 + 자동 사라짐 + 스택 관리 | 업계 표준 (미구현) |
| **Tooltip** | 🟢 **Complete** | 위치 계산 + 지연 표시/숨김 | 업계 표준 (미구현) |
| **Popover** | 🟢 **Complete** | 위치 계산 + 클릭 외부 닫기 | 업계 표준 (미구현) |
| **Carousel** | 🟢 **Complete** | 슬라이드 전환 + 자동 재생 + 인디케이터 | 업계 표준 (미구현) |
| **Pagination** | 🟢 **Complete** | 페이지 번호 + 이전/다음 로직 | 업계 표준 (미구현) |
| **Progress** | 🟢 **Complete** | 진행 상태 표시 + 애니메이션 | 업계 표준 (미구현) |
| **Skeleton** | 🟢 **Complete** | 로딩 상태 표시 + 펄스 애니메이션 | 업계 표준 (미구현) |
| **Avatar** | 🟢 **Complete** | 이미지 + Fallback + 크기 처리 | MailApp, LoginApp |
| **AvatarGroup** | 🟢 **Complete** | Avatar 여러 개 + 오버랩 + "+N" 표시 | 업계 표준 (미구현) |

---

## 최종 분류 요약

### 🟢 Complete (완성품) - Props 방식

**Marketing:**
- FAQ, Pricing

**Application:**
- Drawer, SplitView

**Content:**
- FeatureCard, StatCard, TestimonialCard, FAQItem, PricingCard, TeamCard

**Utility:**
- ViewportSelector, LogoCloud, Badge

**추가 필요:**
- Table, DataTable, CodeBlock, Calendar, DatePicker
- Dropdown, Select, Combobox, Tabs, Accordion
- Modal, Dialog, Toast, Tooltip, Popover
- Carousel, Pagination, Progress, Skeleton
- Avatar, AvatarGroup

**총 34개**

---

### 🔵 Composable (조립형) - Children 방식

**Marketing:**
- Hero, Features, CTA, Stats, Testimonials (일부), Footer

**Application:**
- AppHeader, Sidebar, Toolbar, Panel, ContentArea, NavigationBar

**총 12개**

---

## 구현 전략

### Complete Component (34개)

```typescript
// Props 방식 - 명확한 API
<Table
  columns={columns}
  data={data}
  onSort={handleSort}
  onRowClick={handleRowClick}
/>

<Drawer
  open={isOpen}
  onClose={handleClose}
  position="right"
  size={400}
>
  {content}
</Drawer>

<Accordion
  items={faqItems}
  defaultOpen={0}
  allowMultiple={false}
/>
```

**특징:**
- Props 인터페이스 정의 필요
- 내부 로직 완결
- 높은 재사용성
- 문서화 중요 (Storybook)

---

### Composable Pattern (12개)

```typescript
// Children 방식 - 자유로운 조합
<Frame layout={Layout.Hero}>
  <Frame layout={Layout.HeroBadge}>
    <Icon src={Sparkles} size={12} />
    <Text.Card.Note>New</Text.Card.Note>
  </Frame>

  <Text.Prose.Title variant="xl">Build faster</Text.Prose.Title>

  <Frame layout={Layout.Actions}>
    <Action label="Start" variant="primary" />
  </Frame>
</Frame>
```

**특징:**
- Layout Token으로 구조 제공
- 내부 조합 자유
- 예시 코드 제공 (examples/patterns/)
- Storybook에서 조합 가이드

---

## 우선순위 재조정

### Phase 1: 필수 Complete Components (즉시 구현)
1. **Table** / **DataTable** - CRMApp에서 이미 사용 중
2. **Drawer** - 2개 앱에서 사용
3. **Modal** / **Dialog** - 업계 표준 필수
4. **Dropdown** / **Select** - 폼 필수 요소
5. **Tooltip** - UI 설명 필수
6. **Tabs** - 정보 구조화 필수

### Phase 2: 자주 쓰는 Complete Components
7. **Accordion** - FAQ에서 사용
8. **Toast** - 알림 필수
9. **Avatar** - 이미 사용 중
10. **Calendar** / **DatePicker** - 날짜 입력
11. **Pagination** - Table과 함께

### Phase 3: Composable Patterns (예시 코드)
12. **Hero** - Layout + 예시
13. **Features** - Layout + 예시
14. **Sidebar** - Layout + 예시
15. **AppHeader** - Layout + 예시

### Phase 4: 고급 Complete Components
16. **CodeBlock** - 문서화용
17. **Carousel** - 마케팅용
18. **Combobox** - 고급 검색
19. **Progress** / **Skeleton** - 로딩 상태
20. **Popover** - 고급 오버레이

---

## 파일 구조

```
src/design-system/
├── Complete/                    # 완성품 Component
│   ├── Table/
│   │   ├── Table.tsx
│   │   ├── Table.types.ts
│   │   └── DataTable.tsx
│   ├── Drawer/
│   │   ├── Drawer.tsx
│   │   └── Drawer.types.ts
│   ├── Modal/
│   ├── Dropdown/
│   ├── Tabs/
│   ├── Accordion/
│   ├── Toast/
│   ├── Tooltip/
│   ├── Calendar/
│   ├── Avatar/
│   └── ...
│
├── preset/                      # Layout Preset (Composable용)
│   ├── Layout.ts
│   ├── Layout.Marketing.ts
│   └── Layout.Application.ts
│
└── Frame/                       # 기본 Primitive
    ├── Frame.tsx
    ├── Action.tsx
    ├── Text/
    └── ...

src/examples/
└── patterns/                    # Composable 예시 코드
    ├── Hero.example.tsx
    ├── Features.example.tsx
    ├── Sidebar.example.tsx
    └── ...
```

---

## 다음 단계

1. ✅ Complete Component 우선순위 확정
2. ✅ Phase 1 Complete Components 구현 시작
   - Table/DataTable (CRM 통합)
   - Drawer (기존 코드 표준화)
   - Modal/Dialog
3. ✅ Composable Pattern Layout Token 정의
4. ✅ 예시 코드 작성 (examples/patterns/)
5. ✅ Storybook 문서화

---

## 결론

**Complete (34개)**
- Props 방식
- 완결된 기능
- `src/design-system/Complete/`

**Composable (12개)**
- Children 방식
- Layout Token + 예시 코드
- `src/preset/` + `src/examples/patterns/`

이제 명확하게 구분되었습니다! 🎉
