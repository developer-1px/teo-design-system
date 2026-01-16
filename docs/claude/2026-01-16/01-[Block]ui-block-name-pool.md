# UI Block Name Pool - 재사용 가능한 UI 블록 명명 체계

**작성일**: 2026-01-16
**목적**: 현재 앱들에서 발견된 재사용 가능한 UI 패턴을 분석하고, 업계 표준 명명 규칙에 따라 Block 컴포넌트로 정의

## 방법론

### 분석 대상
- `src/apps/` 내 모든 페이지 (CMSApp, LandingApp, SlideApp, LoginApp, MailApp, CRMApp)
- 각 앱에서 반복되거나 다른 앱에서도 사용될 수 있는 패턴 추출

### 업계 표준 조사
- **Figma/Webflow/Framer**: CEV (Context-Element-Variant) 패턴, BEM 기반 명명
- **Landing Page Standards**: Hero, Features, CTA, Pricing, Testimonials, FAQ
- **Application UI Patterns**: Sidebar, Header, Toolbar, Panel, Drawer

### Block 선정 기준
1. **재사용성**: 2개 이상의 앱에서 유사한 패턴 발견
2. **보편성**: 업계 표준으로 널리 사용되는 패턴
3. **독립성**: Frame/Section/Text 조합으로 독립적 구성 가능
4. **의미성**: 명확한 사용 목적과 컨텍스트

---

## Priority 1: Marketing/Landing Blocks
> 랜딩 페이지 및 마케팅 사이트에서 가장 많이 사용되는 블록

| 우선순위 | Block 이름 | 업계 표준 명칭 | 이유 (WHY) | 발견된 앱 | 주요 Props/Variants |
|---------|-----------|--------------|-----------|----------|-------------------|
| **1-1** | **Hero** | Hero Section, Header Hero | 페이지 최상단의 핵심 메시지와 CTA를 전달하는 가장 중요한 블록 | LandingApp, CMSApp (HeaderHero) | `title`, `subtitle`, `cta`, `image`, `variant: "centered" \| "split"` |
| **1-2** | **Features** | Features Section, Feature Grid | 제품/서비스의 핵심 기능을 그리드 형태로 보여주는 필수 블록 | LandingApp (Features Grid), CMSApp (FeatureGridSection) | `items: FeatureItem[]`, `columns: 2 \| 3 \| 4`, `variant: "card" \| "icon-list"` |
| **1-3** | **CTA** | Call-to-Action Section | 사용자의 행동을 유도하는 강조 영역 (중간/끝) | CMSApp (ImageFooterBanner), LandingApp (Hero 내부) | `title`, `description`, `primaryAction`, `secondaryAction?`, `variant: "default" \| "banner"` |
| **1-4** | **Stats** | Statistics Section, Social Proof | 숫자 기반의 신뢰성 지표를 보여주는 블록 | LandingApp (언급됨), CMSApp (가능성) | `items: StatItem[]`, `layout: "row" \| "grid"` |
| **1-5** | **FAQ** | FAQ Section, Accordion | 자주 묻는 질문을 아코디언 형태로 제공 | CMSApp (FAQBoardFooter) | `items: FAQItem[]`, `defaultOpen?: number`, `variant: "simple" \| "with-cta"` |
| **1-6** | **Testimonials** | Testimonials Section, Reviews | 고객 후기 및 평가를 보여주는 블록 | 현재 미구현 (업계 표준) | `items: TestimonialItem[]`, `layout: "carousel" \| "grid"`, `showRating: boolean` |
| **1-7** | **Pricing** | Pricing Section, Pricing Table | 가격 플랜을 비교 테이블 형태로 제공 | 현재 미구현 (업계 표준) | `plans: PricingPlan[]`, `billingCycle: "monthly" \| "yearly"`, `highlighted?: number` |
| **1-8** | **Footer** | Footer, Site Footer | 페이지 하단의 링크, 정보, 저작권 표시 | LandingApp (Footer), CMSApp (MainFooter) | `columns: FooterColumn[]`, `copyright`, `social?: SocialLink[]` |

---

## Priority 2: Application Layout Blocks
> 웹 애플리케이션 인터페이스에서 핵심적인 레이아웃 블록

| 우선순위 | Block 이름 | 업계 표준 명칭 | 이유 (WHY) | 발견된 앱 | 주요 Props/Variants |
|---------|-----------|--------------|-----------|----------|-------------------|
| **2-1** | **AppHeader** | Header, Top Bar, Global Header | 앱 전체 헤더 (로고, 검색, 프로필) | SlideApp (Global Header), CMSApp (SiteHeader), CRMApp (CRMHeader), MailApp (MailHeader) | `logo`, `navigation?`, `actions?`, `sticky: boolean` |
| **2-2** | **Sidebar** | Sidebar, Navigation Panel | 좌측 고정 네비게이션 패널 | CRMApp (CRMSidebar), MailApp (MailSidebar), CMSApp (CMSSidebar), SlideApp (SlidesPanel) | `items: NavItem[]`, `collapsible: boolean`, `width: number`, `position: "left" \| "right"` |
| **2-3** | **Toolbar** | Toolbar, Action Bar | 작업 관련 버튼들이 모인 가로 바 | SlideApp (FloatingToolbar), CMSApp (ViewportSelector + BottomToolbar), CRMApp (CRMToolbar) | `actions: Action[]`, `position: "top" \| "bottom" \| "floating"`, `variant: "default" \| "pill"` |
| **2-4** | **Panel** | Panel, Inspector Panel, Properties Panel | 우측/좌측 상세 정보 패널 | SlideApp (PropertiesPanel), CMSApp (CMSRightPanel) | `title`, `sections: PanelSection[]`, `collapsible: boolean` |
| **2-5** | **Drawer** | Drawer, Slide-out Panel | 화면 가장자리에서 슬라이드되는 패널 | CRMApp (CRMDrawer), CMSApp (CMSDrawer) | `open: boolean`, `onClose`, `position: "left" \| "right" \| "bottom"`, `width?: number` |
| **2-6** | **ContentArea** | Main Content, Content Viewport | 메인 콘텐츠 영역 (스크롤 가능) | 모든 앱에서 중앙 영역 | `scroll: boolean`, `maxWidth?: number`, `padding?: Space` |
| **2-7** | **SplitView** | Split View, Dual Pane | 좌우로 나뉜 2개 영역 (리스트-디테일) | MailApp (List + Detail), LoginApp (Form + Hero) | `leftContent`, `rightContent`, `ratio?: string`, `resizable?: boolean` |

---

## Priority 3: Specialized Content Blocks
> 특정 콘텐츠 타입을 위한 재사용 가능한 카드/섹션

| 우선순위 | Block 이름 | 업계 표준 명칭 | 이유 (WHY) | 발견된 앱 | 주요 Props/Variants |
|---------|-----------|--------------|-----------|----------|-------------------|
| **3-1** | **FeatureCard** | Feature Card, Service Card | 기능/서비스를 아이콘+제목+설명 형태로 표현 | LandingApp (FeatureCard), CMSApp (FeatureCardSmall, FeatureCardLarge) | `icon`, `title`, `description`, `variant: "small" \| "large" \| "horizontal"` |
| **3-2** | **StatCard** | Stat Card, Metric Card | 숫자 중심의 지표 카드 | CRMApp (가능성), LandingApp (Stats 섹션) | `value`, `label`, `trend?: "up" \| "down"`, `icon?` |
| **3-3** | **TestimonialCard** | Testimonial Card, Review Card | 고객 후기 카드 (사진+이름+평가) | 업계 표준 (미구현) | `quote`, `author`, `avatar`, `rating?`, `role?` |
| **3-4** | **FAQItem** | FAQ Item, Accordion Item | 질문-답변 아코디언 아이템 | CMSApp (FAQRow) | `question`, `answer`, `defaultOpen: boolean` |
| **3-5** | **PricingCard** | Pricing Card, Plan Card | 가격 플랜 카드 (기능 리스트 포함) | 업계 표준 (미구현) | `name`, `price`, `features: string[]`, `cta`, `highlighted: boolean` |
| **3-6** | **TeamCard** | Team Card, Profile Card | 팀원 소개 카드 (사진+이름+역할) | 업계 표준 (미구현) | `name`, `role`, `avatar`, `bio?`, `social?: SocialLink[]` |

---

## Priority 4: Utility Blocks
> 특수한 UI 패턴을 위한 유틸리티 블록

| 우선순위 | Block 이름 | 업계 표준 명칭 | 이유 (WHY) | 발견된 앱 | 주요 Props/Variants |
|---------|-----------|--------------|-----------|----------|-------------------|
| **4-1** | **ViewportSelector** | Viewport Switcher, Device Selector | 반응형 뷰포트 전환기 (Desktop/Tablet/Mobile) | CMSApp (ViewportSelector) | `current: "desktop" \| "tablet" \| "mobile"`, `onChange`, `position: "floating" \| "inline"` |
| **4-2** | **NavigationBar** | Nav Bar, Top Navigation | 페이지 내 탭/링크 네비게이션 | LandingApp (Header Navigation), CMSApp (SiteHeader) | `items: NavItem[]`, `activeIndex`, `variant: "pills" \| "underline" \| "ghost"` |
| **4-3** | **LogoCloud** | Logo Cloud, Trust Bar, Client Logos | 클라이언트/파트너 로고 그리드 | 업계 표준 (미구현) | `logos: Logo[]`, `grayscale: boolean`, `scrolling?: boolean` |
| **4-4** | **Badge** | Badge, Tag, Label | 상태/카테고리 표시용 작은 라벨 | LandingApp ("New" 뱃지), CMSApp ("NEXT GENERATION") | `text`, `variant: "primary" \| "success" \| "warning" \| "neutral"`, `icon?` |

---

## 명명 규칙 (Naming Convention)

### 1. CEV Pattern (Context-Element-Variant)
```tsx
// Context: 어디에 사용되는가?
// Element: 무엇인가?
// Variant: 어떤 변형인가?

<Block.Hero variant="centered" />
<Block.Features columns={3} />
<Block.CTA variant="banner" />
```

### 2. Namespace Organization
```
Block/
├── Marketing/
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── CTA.tsx
│   ├── FAQ.tsx
│   ├── Testimonials.tsx
│   ├── Pricing.tsx
│   └── Footer.tsx
├── Application/
│   ├── AppHeader.tsx
│   ├── Sidebar.tsx
│   ├── Toolbar.tsx
│   ├── Panel.tsx
│   ├── Drawer.tsx
│   └── SplitView.tsx
├── Content/
│   ├── FeatureCard.tsx
│   ├── StatCard.tsx
│   ├── TestimonialCard.tsx
│   ├── FAQItem.tsx
│   └── PricingCard.tsx
└── Utility/
    ├── ViewportSelector.tsx
    ├── NavigationBar.tsx
    ├── LogoCloud.tsx
    └── Badge.tsx
```

### 3. Import Convention
```tsx
// ❌ 배럴 익스포트 사용 금지
import { Hero } from "../design-system/Block";

// ✅ 직접 임포트
import { Hero } from "../design-system/Block/Marketing/Hero";
import { Sidebar } from "../design-system/Block/Application/Sidebar";
```

---

## 구현 우선순위 제안

### Phase 1: Marketing Essentials (즉시 구현 권장)
1. **Hero** - 가장 많이 사용되고, 랜딩 페이지의 핵심
2. **Features** - 이미 2개 앱에서 구현됨, 표준화 필요
3. **CTA** - 여러 형태로 반복 사용 중
4. **FAQ** - 이미 구현됨, Block으로 추출 가능

### Phase 2: Application Foundation (다음 단계)
5. **AppHeader** - 4개 앱에서 사용 중, 가장 시급
6. **Sidebar** - 4개 앱에서 유사 패턴 발견
7. **Toolbar** - 3개 앱에서 다양한 형태로 구현
8. **Drawer** - 2개 앱에서 사용, 표준화 필요

### Phase 3: Content Components (확장)
9. **FeatureCard** - 이미 구현됨, 독립 컴포넌트화
10. **FAQItem** - FAQRow → FAQItem으로 리네이밍
11. **Footer** - 2개 앱에서 구현됨

### Phase 4: Advanced Utilities (선택)
12. **ViewportSelector** - CMS 전용이지만 유용
13. **SplitView** - MailApp, LoginApp 패턴 추출
14. **NavigationBar** - 여러 앱에서 변형 사용

---

## 각 Block의 Intent 정의

### Marketing Blocks
- **Hero**: "첫 인상을 결정하고, 핵심 가치 제안을 즉시 전달한다"
- **Features**: "제품의 가치를 구체적인 기능으로 증명한다"
- **CTA**: "사용자를 다음 단계로 유도한다"
- **FAQ**: "의심을 제거하고 신뢰를 구축한다"

### Application Blocks
- **AppHeader**: "앱 전역 컨텍스트와 액션을 제공한다"
- **Sidebar**: "주요 네비게이션과 컨텍스트 전환을 담당한다"
- **Toolbar**: "현재 뷰에서 가능한 작업을 노출한다"
- **Drawer**: "부가 정보를 일시적으로 표시한다"

---

## 다음 단계

1. **Block 디렉토리 생성**: `src/design-system/Block/` 구조 생성
2. **Phase 1 구현**: Hero, Features, CTA, FAQ 우선 추출
3. **타입 정의**: 각 Block의 Props 인터페이스 정의
4. **Storybook 추가**: 각 Block의 variants 문서화
5. **Migration Guide**: 기존 앱에서 Block 사용으로 전환하는 가이드 작성

---

## 참고 자료

### 업계 표준
- [Tailwind UI Components](https://tailwindcss.com/plus/ui-blocks)
- [Figma Component Naming Conventions](https://medium.com/design-bootcamp/figma-component-naming-conventions-ce53e53c7d39)
- [Unsection - 1,500+ Website Sections](https://www.unsection.com)
- [Mobbin UI Glossary](https://mobbin.com/glossary)

### MDK 관련 문서
- `.agent/conventions.md` - 3-Tier Intent System
- `CLAUDE.md` - MDK Core Architecture
- `README.md` - MDK Philosophy
