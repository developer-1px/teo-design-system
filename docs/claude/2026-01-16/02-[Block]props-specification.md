# UI Block Props Specification - TypeScript 인터페이스 정의

**작성일**: 2026-01-16
**목적**: 각 UI Block의 Props 타입 정의 및 설명 문서화
**관련 문서**: `01-[Block]ui-block-name-pool.md`

---

## 목차

1. [공통 패턴 및 원칙](#공통-패턴-및-원칙)
2. [Priority 1: Marketing/Landing Blocks](#priority-1-marketinglanding-blocks)
3. [Priority 2: Application Layout Blocks](#priority-2-application-layout-blocks)
4. [Priority 3: Specialized Content Blocks](#priority-3-specialized-content-blocks)
5. [Priority 4: Utility Blocks](#priority-4-utility-blocks)
6. [공통 타입 정의](#공통-타입-정의)

---

## 공통 패턴 및 원칙

### 1. MDK Block Props 설계 철학

모든 Block은 다음 원칙을 따릅니다:

```typescript
/**
 * Block Props Design Principles
 *
 * 1. Intent-First: Props는 "무엇을 할 것인가"가 아니라 "왜 필요한가"를 반영
 * 2. Token-Driven: 모든 spacing, sizing은 Token 사용 (hardcoded 금지)
 * 3. Composition Over Configuration: 복잡한 설정보다 간단한 조합 선호
 * 4. Variants Over Props: 유사한 패턴은 variant로 구분
 * 5. Progressive Enhancement: 기본값만으로 작동, 세밀한 제어는 선택적
 */
```

### 2. 공통 Props 패턴

모든 Block은 Frame을 기반으로 하므로, 다음 공통 Props를 상속합니다:

```typescript
/**
 * Base Block Props
 * Frame의 주요 Props를 선택적으로 노출
 */
interface BaseBlockProps {
  /** React children */
  children?: React.ReactNode;

  /** Custom CSS class name */
  className?: string;

  /** Restricted style prop (spacing/sizing 속성 차단) */
  style?: RestrictedFrameStyle;

  /** Surface 타입 (base, raised, sunken, overlay, primary, selected) */
  surface?: SurfaceToken;

  /** Border radius (sm, md, lg, xl, 2xl, 3xl, full, round) */
  rounded?: Radius2Token;

  /** Box shadow (sm, md, lg, xl, 2xl) */
  shadow?: ShadowToken;

  /** 전체 너비/높이 채우기 */
  fill?: boolean;

  /** HTML element 타입 변경 (기본값은 Block마다 다름) */
  as?: React.ElementType;
}
```

### 3. 데이터 Props 패턴

배열 데이터를 받는 Block은 일관된 명명 규칙을 따릅니다:

```typescript
/**
 * Data Props Naming Convention
 *
 * - Single item: `item` (FeatureCard의 icon, title, description)
 * - Multiple items: `items` (Features의 items: FeatureItem[])
 * - Nested structure: `sections` (Panel의 sections: PanelSection[])
 */
```

---

## Priority 1: Marketing/Landing Blocks

### 1.1 Hero Block

**목적**: 페이지 최상단의 핵심 메시지와 CTA 전달

```typescript
/**
 * Hero Block Props
 * 랜딩 페이지의 첫 인상을 결정하는 가장 중요한 블록
 */
interface HeroProps extends BaseBlockProps {
  /**
   * Hero 레이아웃 변형
   * - "centered": 중앙 정렬, 텍스트 중심 (기본값)
   * - "split": 좌우 분할 (텍스트 + 이미지/비디오)
   * - "fullscreen": 전체 화면 높이
   */
  variant?: "centered" | "split" | "fullscreen";

  /**
   * 메인 제목 (Prose.Title xl)
   * WHY: 사용자에게 가장 먼저 전달해야 할 핵심 가치 제안
   */
  title: React.ReactNode;

  /**
   * 서브 제목 또는 설명 (Prose.Body)
   * WHY: 제목을 보완하는 구체적 설명
   */
  subtitle?: React.ReactNode;

  /**
   * 상단 배지/라벨 (예: "New Feature", "Beta")
   * WHY: 특별한 공지나 강조 필요 시
   */
  badge?: {
    text: string;
    icon?: React.ElementType;
    variant?: "primary" | "success" | "warning";
  };

  /**
   * Primary CTA 버튼
   * WHY: 사용자가 가장 먼저 취해야 할 핵심 액션
   */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };

  /**
   * Secondary CTA 버튼 (선택)
   * WHY: 대안적 경로 제공 (예: "Learn More")
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Hero 이미지/비디오 (split variant에서 사용)
   * WHY: 시각적 증거나 제품 스크린샷 제공
   */
  media?: {
    type: "image" | "video" | "component";
    src?: string;
    alt?: string;
    component?: React.ReactNode;
  };

  /**
   * 배경 데코레이션 활성화
   * WHY: Gradient blur 등 시각적 강조
   */
  decoration?: boolean;

  /**
   * 최대 콘텐츠 너비 (기본값: 800px)
   * WHY: 가독성을 위한 텍스트 너비 제한
   */
  maxWidth?: number;
}

// 사용 예시
<Block.Hero
  variant="centered"
  badge={{ text: "New Feature", icon: Sparkles, variant: "primary" }}
  title="Build faster with MDK"
  subtitle="A design system that thinks like you do"
  primaryAction={{ label: "Get Started", onClick: handleStart }}
  secondaryAction={{ label: "View Docs", onClick: handleDocs }}
  decoration
/>
```

---

### 1.2 Features Block

**목적**: 제품/서비스의 핵심 기능을 그리드로 표시

```typescript
/**
 * Feature Item 타입
 */
interface FeatureItem {
  /** Lucide 아이콘 컴포넌트 */
  icon: React.ElementType;

  /** 기능 제목 */
  title: string;

  /** 기능 설명 */
  description: string;

  /** 선택적 링크 */
  href?: string;

  /** 커스텀 아이콘 색상 */
  iconColor?: string;
}

/**
 * Features Block Props
 */
interface FeaturesProps extends BaseBlockProps {
  /**
   * 섹션 제목 (선택)
   * WHY: Features 그룹의 목적을 명확히
   */
  title?: string;

  /**
   * 섹션 설명 (선택)
   */
  description?: string;

  /**
   * 상단 라벨 (예: "FEATURES", "WHY US")
   */
  label?: string;

  /**
   * Feature 아이템 배열
   * WHY: 개별 기능을 구조화된 데이터로 전달
   */
  items: FeatureItem[];

  /**
   * 그리드 컬럼 수
   * - 2: 큰 카드, 상세 설명용
   * - 3: 균형잡힌 레이아웃 (기본값)
   * - 4: 많은 기능을 압축적으로
   */
  columns?: 2 | 3 | 4;

  /**
   * 카드 변형
   * - "card": 아이콘 + 제목 + 설명 (기본값)
   * - "icon-list": 아이콘 + 제목만 (간결)
   * - "horizontal": 가로 레이아웃
   */
  variant?: "card" | "icon-list" | "horizontal";

  /**
   * 최대 너비 (기본값: 1200px)
   */
  maxWidth?: number;
}

// 사용 예시
<Block.Features
  label="FEATURES"
  title="Everything you need"
  description="Comprehensive primitives for any layout"
  items={[
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with zero-runtime overhead"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Built for teams that demand safety"
    }
  ]}
  columns={3}
  variant="card"
/>
```

---

### 1.3 CTA (Call-to-Action) Block

**목적**: 사용자 행동을 유도하는 강조 영역

```typescript
/**
 * CTA Block Props
 */
interface CTAProps extends BaseBlockProps {
  /**
   * CTA 변형
   * - "default": 중앙 정렬, 심플
   * - "banner": 전체 너비 배너 형태
   * - "split": 좌우 분할 (텍스트 + 이미지)
   */
  variant?: "default" | "banner" | "split";

  /**
   * 메인 제목
   * WHY: 사용자에게 왜 액션을 취해야 하는지 설명
   */
  title: string;

  /**
   * 설명 (선택)
   */
  description?: string;

  /**
   * Primary 액션
   * WHY: 사용자가 취해야 할 핵심 행동
   */
  primaryAction: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
    variant?: "primary" | "surface";
  };

  /**
   * Secondary 액션 (선택)
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };

  /**
   * 배경 이미지 (banner variant)
   */
  backgroundImage?: string;

  /**
   * Glow 효과 (primary 버튼에 빛나는 효과)
   */
  glow?: boolean;
}

// 사용 예시
<Block.CTA
  variant="banner"
  title="Ready to get started?"
  description="Join thousands of teams building faster"
  primaryAction={{
    label: "Start Free Trial",
    onClick: handleTrial,
    icon: ArrowRight,
    variant: "primary"
  }}
  glow
/>
```

---

### 1.4 FAQ Block

**목적**: 자주 묻는 질문을 아코디언 형태로 제공

```typescript
/**
 * FAQ Item 타입
 */
interface FAQItem {
  /** 질문 */
  question: string;

  /** 답변 (React Node 지원 - 링크, 볼드 등) */
  answer: React.ReactNode;

  /** 기본 열림 상태 */
  defaultOpen?: boolean;
}

/**
 * FAQ Block Props
 */
interface FAQProps extends BaseBlockProps {
  /**
   * 섹션 제목
   */
  title?: string;

  /**
   * 상단 라벨 (예: "SUPPORT", "FAQ")
   */
  label?: string;

  /**
   * FAQ 아이템 배열
   */
  items: FAQItem[];

  /**
   * 기본 열림 인덱스 (0부터 시작)
   * WHY: 가장 중요한 질문을 처음부터 열어둘 수 있음
   */
  defaultOpenIndex?: number;

  /**
   * 변형
   * - "simple": FAQ만
   * - "with-cta": FAQ + 하단 CTA 카드
   */
  variant?: "simple" | "with-cta";

  /**
   * CTA 카드 (variant="with-cta"일 때)
   */
  ctaCard?: {
    icon: React.ElementType;
    title: string;
    description: string;
    action: {
      label: string;
      onClick: () => void;
    };
  };

  /**
   * 최대 너비 (기본값: 768px - 읽기 좋은 폭)
   */
  maxWidth?: number;
}

// 사용 예시
<Block.FAQ
  label="SUPPORT"
  title="Common questions"
  items={[
    {
      question: "How secure is my data?",
      answer: "We use industry-standard encryption and SOC2 certification.",
      defaultOpen: true
    },
    {
      question: "Can I export code?",
      answer: "Yes, you can export as static bundle."
    }
  ]}
  variant="with-cta"
  ctaCard={{
    icon: HelpCircle,
    title: "Still have questions?",
    description: "Contact our support team 24/7",
    action: { label: "Chat with us", onClick: handleChat }
  }}
/>
```

---

### 1.5 Footer Block

**목적**: 페이지 하단의 링크, 정보, 저작권 표시

```typescript
/**
 * Footer Column 타입
 */
interface FooterColumn {
  /** 컬럼 제목 */
  title: string;

  /** 링크 목록 */
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

/**
 * Social Link 타입
 */
interface SocialLink {
  /** 플랫폼 이름 */
  platform: "twitter" | "github" | "discord" | "linkedin" | "youtube";

  /** URL */
  href: string;

  /** 아이콘 (선택, 기본값은 platform에서 자동 매핑) */
  icon?: React.ElementType;
}

/**
 * Footer Block Props
 */
interface FooterProps extends BaseBlockProps {
  /**
   * 로고 (왼쪽 상단)
   */
  logo?: React.ReactNode;

  /**
   * Footer 컬럼들
   * WHY: 카테고리별 링크 그룹화
   */
  columns?: FooterColumn[];

  /**
   * 저작권 텍스트
   */
  copyright: string;

  /**
   * 소셜 미디어 링크들
   */
  social?: SocialLink[];

  /**
   * 하단 법적 링크들 (Terms, Privacy 등)
   */
  legalLinks?: Array<{
    label: string;
    href: string;
  }>;

  /**
   * 레이아웃 변형
   * - "default": 로고 + 컬럼들 + 저작권
   * - "minimal": 저작권 + 소셜만
   */
  variant?: "default" | "minimal";
}

// 사용 예시
<Block.Footer
  logo={<TeoLogo />}
  columns={[
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" }
      ]
    }
  ]}
  copyright="© 2026 MDK. All rights reserved."
  social={[
    { platform: "twitter", href: "https://twitter.com/mdk" },
    { platform: "github", href: "https://github.com/mdk" }
  ]}
  legalLinks={[
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" }
  ]}
/>
```

---

## Priority 2: Application Layout Blocks

### 2.1 AppHeader Block

**목적**: 앱 전체 헤더 (로고, 검색, 프로필)

```typescript
/**
 * Navigation Item 타입
 */
interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ElementType;
  badge?: string | number;
}

/**
 * AppHeader Block Props
 */
interface AppHeaderProps extends BaseBlockProps {
  /**
   * 로고 (좌측)
   * WHY: 앱의 아이덴티티 및 홈 링크
   */
  logo: React.ReactNode;

  /**
   * 중앙 네비게이션 (선택)
   */
  navigation?: NavItem[];

  /**
   * 우측 액션들 (검색, 알림, 프로필 등)
   */
  actions?: React.ReactNode;

  /**
   * Sticky 고정 여부
   * WHY: 스크롤 시 상단 고정
   */
  sticky?: boolean;

  /**
   * 높이 (기본값: 56px)
   */
  height?: number;

  /**
   * 배경 블러 효과 (sticky일 때 유용)
   */
  blur?: boolean;

  /**
   * 하단 보더 표시 여부 (기본값: true)
   */
  border?: boolean;
}

// 사용 예시
<Block.AppHeader
  logo={<TeoLogo height={24} />}
  navigation={[
    { label: "Dashboard", href: "/dashboard", active: true },
    { label: "Projects", href: "/projects" },
    { label: "Team", href: "/team", badge: 3 }
  ]}
  actions={
    <>
      <Action icon={Search} variant="ghost" />
      <Action icon={Bell} variant="ghost" badge={5} />
      <Avatar src="/user.jpg" />
    </>
  }
  sticky
  blur
/>
```

---

### 2.2 Sidebar Block

**목적**: 좌측 고정 네비게이션 패널

```typescript
/**
 * Sidebar Item 타입
 */
interface SidebarItem {
  /** 아이템 ID (key로 사용) */
  id: string;

  /** 라벨 */
  label: string;

  /** 아이콘 */
  icon?: React.ElementType;

  /** 경로 또는 클릭 핸들러 */
  href?: string;
  onClick?: () => void;

  /** 활성 상태 */
  active?: boolean;

  /** 배지 (숫자 또는 텍스트) */
  badge?: string | number;

  /** 자식 아이템 (중첩 네비게이션) */
  children?: SidebarItem[];
}

/**
 * Sidebar Block Props
 */
interface SidebarProps extends BaseBlockProps {
  /**
   * 네비게이션 아이템 배열
   */
  items: SidebarItem[];

  /**
   * Sidebar 너비 (기본값: 240px)
   * WHY: 240px는 텍스트 + 아이콘의 최적 너비
   */
  width?: number;

  /**
   * 접기/펼치기 가능 여부
   */
  collapsible?: boolean;

  /**
   * 현재 접힌 상태 (collapsible=true일 때)
   */
  collapsed?: boolean;

  /**
   * 접기 토글 핸들러
   */
  onToggle?: (collapsed: boolean) => void;

  /**
   * Sidebar 위치
   */
  position?: "left" | "right";

  /**
   * 상단 로고/헤더 영역
   */
  header?: React.ReactNode;

  /**
   * 하단 고정 영역 (프로필, 설정 등)
   */
  footer?: React.ReactNode;

  /**
   * 검색 기능 활성화
   */
  searchable?: boolean;

  /**
   * 검색 placeholder
   */
  searchPlaceholder?: string;
}

// 사용 예시
<Block.Sidebar
  width={240}
  collapsible
  collapsed={isCollapsed}
  onToggle={setCollapsed}
  header={<TeoLogo />}
  items={[
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: true
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderOpen,
      href: "/projects",
      badge: 12
    }
  ]}
  footer={<UserProfile />}
  searchable
/>
```

---

### 2.3 Toolbar Block

**목적**: 작업 관련 버튼들이 모인 가로 바

```typescript
/**
 * Toolbar Action 타입
 */
interface ToolbarAction {
  /** 액션 ID */
  id: string;

  /** 아이콘 */
  icon: React.ElementType;

  /** 툴팁 */
  tooltip: string;

  /** 클릭 핸들러 */
  onClick?: () => void;

  /** 활성 상태 (토글 버튼) */
  active?: boolean;

  /** Variant */
  variant?: ActionVariant;

  /** 구분선 (이 액션 앞에 separator 추가) */
  separator?: boolean;
}

/**
 * Toolbar Block Props
 */
interface ToolbarProps extends BaseBlockProps {
  /**
   * 액션 버튼 배열
   */
  actions: ToolbarAction[];

  /**
   * Toolbar 위치
   * - "top": 상단 고정
   * - "bottom": 하단 고정
   * - "floating": 플로팅 (중앙 하단)
   */
  position?: "top" | "bottom" | "floating";

  /**
   * Variant
   * - "default": 직사각형 바
   * - "pill": 둥근 알약 형태 (floating에서 주로 사용)
   */
  variant?: "default" | "pill";

  /**
   * 좌측 그룹 (선택)
   * WHY: 툴바를 논리적으로 좌/우 분리
   */
  leftActions?: ToolbarAction[];

  /**
   * 우측 그룹 (선택)
   */
  rightActions?: ToolbarAction[];

  /**
   * 그림자 효과 (floating일 때 권장)
   */
  shadow?: "sm" | "md" | "lg" | "xl";
}

// 사용 예시
<Block.Toolbar
  position="floating"
  variant="pill"
  shadow="xl"
  actions={[
    { id: "select", icon: MousePointer2, tooltip: "Select", variant: "surface" },
    { id: "frame", icon: Square, tooltip: "Frame", separator: true },
    { id: "text", icon: Type, tooltip: "Text" },
    { id: "comment", icon: MessageSquare, tooltip: "Comment", separator: true },
    { id: "theme", icon: Moon, tooltip: "Dark Mode", onClick: toggleTheme }
  ]}
/>
```

---

### 2.4 Panel Block

**목적**: 우측/좌측 상세 정보 패널

```typescript
/**
 * Panel Section 타입
 */
interface PanelSection {
  /** 섹션 ID */
  id: string;

  /** 섹션 제목 */
  title: string;

  /** 섹션 아이콘 (선택) */
  icon?: React.ElementType;

  /** 섹션 내용 */
  content: React.ReactNode;

  /** 접기 가능 여부 */
  collapsible?: boolean;

  /** 기본 접힌 상태 */
  defaultCollapsed?: boolean;
}

/**
 * Panel Block Props
 */
interface PanelProps extends BaseBlockProps {
  /**
   * 패널 제목
   */
  title?: string;

  /**
   * 패널 섹션들
   * WHY: 여러 카테고리의 정보를 구조화
   */
  sections: PanelSection[];

  /**
   * 패널 너비 (기본값: 320px)
   */
  width?: number;

  /**
   * 전체 접기/펼치기 가능 여부
   */
  collapsible?: boolean;

  /**
   * 현재 접힌 상태
   */
  collapsed?: boolean;

  /**
   * 토글 핸들러
   */
  onToggle?: (collapsed: boolean) => void;

  /**
   * 위치
   */
  position?: "left" | "right";

  /**
   * 헤더 액션 버튼들 (우측 상단)
   */
  actions?: React.ReactNode;
}

// 사용 예시
<Block.Panel
  title="Properties"
  width={320}
  position="right"
  sections={[
    {
      id: "layout",
      title: "Layout",
      icon: LayoutTemplate,
      content: <LayoutControls />,
      collapsible: true
    },
    {
      id: "style",
      title: "Style",
      icon: Palette,
      content: <StyleControls />
    }
  ]}
  actions={<Action icon={X} onClick={handleClose} />}
/>
```

---

### 2.5 Drawer Block

**목적**: 화면 가장자리에서 슬라이드되는 패널

```typescript
/**
 * Drawer Block Props
 */
interface DrawerProps extends BaseBlockProps {
  /**
   * 열림/닫힘 상태
   * WHY: 외부에서 제어 (controlled component)
   */
  open: boolean;

  /**
   * 닫기 핸들러
   */
  onClose: () => void;

  /**
   * Drawer 위치
   */
  position?: "left" | "right" | "bottom" | "top";

  /**
   * Drawer 제목
   */
  title?: string;

  /**
   * Drawer 너비 (left/right) 또는 높이 (top/bottom)
   * 기본값: position에 따라 자동 (left/right: 400px, bottom: 50vh)
   */
  size?: number | string;

  /**
   * Backdrop 클릭 시 닫기 여부 (기본값: true)
   */
  closeOnBackdrop?: boolean;

  /**
   * ESC 키 닫기 여부 (기본값: true)
   */
  closeOnEscape?: boolean;

  /**
   * 헤더 영역 (title 대신 커스텀 헤더)
   */
  header?: React.ReactNode;

  /**
   * Footer 영역 (액션 버튼들)
   */
  footer?: React.ReactNode;

  /**
   * 애니메이션 지속 시간 (ms, 기본값: 300)
   */
  duration?: number;
}

// 사용 예시
<Block.Drawer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  position="right"
  title="Row Details"
  size={480}
  footer={
    <>
      <Action label="Cancel" onClick={handleCancel} />
      <Action label="Save" variant="primary" onClick={handleSave} />
    </>
  }
>
  <DetailContent />
</Block.Drawer>
```

---

### 2.6 SplitView Block

**목적**: 좌우로 나뉜 2개 영역 (리스트-디테일 패턴)

```typescript
/**
 * SplitView Block Props
 */
interface SplitViewProps extends BaseBlockProps {
  /**
   * 좌측 콘텐츠
   */
  leftContent: React.ReactNode;

  /**
   * 우측 콘텐츠
   */
  rightContent: React.ReactNode;

  /**
   * 좌우 비율 (CSS grid template columns)
   * 기본값: "1fr 2fr" (왼쪽 1, 오른쪽 2)
   */
  ratio?: string;

  /**
   * Resizable 여부 (드래그로 크기 조절)
   * WHY: 사용자가 비율을 조정할 수 있음
   */
  resizable?: boolean;

  /**
   * 최소 너비들 (resizable=true일 때)
   */
  minLeftWidth?: number;
  minRightWidth?: number;

  /**
   * 구분선 표시 여부 (기본값: true)
   */
  divider?: boolean;

  /**
   * 좌측 영역 접기 가능 여부
   */
  collapsibleLeft?: boolean;

  /**
   * 우측 영역 접기 가능 여부
   */
  collapsibleRight?: boolean;
}

// 사용 예시
<Block.SplitView
  leftContent={<MailList items={mails} />}
  rightContent={<MailDetail mail={selectedMail} />}
  ratio="384px 1fr"
  resizable
  minLeftWidth={320}
  divider
/>
```

---

## Priority 3: Specialized Content Blocks

### 3.1 FeatureCard Block

**목적**: 기능/서비스를 아이콘+제목+설명 형태로 표현

```typescript
/**
 * FeatureCard Block Props
 */
interface FeatureCardProps extends BaseBlockProps {
  /**
   * 아이콘 (Lucide React Component)
   */
  icon: React.ElementType;

  /**
   * 제목
   */
  title: string;

  /**
   * 설명
   */
  description: string;

  /**
   * 링크 (선택)
   */
  href?: string;

  /**
   * 클릭 핸들러 (선택)
   */
  onClick?: () => void;

  /**
   * 카드 변형
   * - "small": 아이콘 + 텍스트, 세로 레이아웃
   * - "large": 좌우 분할, 이미지 포함 가능
   * - "horizontal": 가로 레이아웃 (아이콘 좌측)
   */
  variant?: "small" | "large" | "horizontal";

  /**
   * 이미지/비주얼 (large variant에서 사용)
   */
  image?: string | React.ReactNode;

  /**
   * 아이콘 색상 커스터마이징
   */
  iconColor?: string;

  /**
   * Flex grow (Features grid에서 사용)
   */
  flex?: number;
}

// 사용 예시
<Block.FeatureCard
  icon={Zap}
  title="Lightning Fast"
  description="Optimized for speed with zero-runtime overhead"
  variant="small"
  iconColor="var(--color-primary)"
/>
```

---

### 3.2 FAQItem Block

**목적**: 질문-답변 아코디언 아이템

```typescript
/**
 * FAQItem Block Props
 */
interface FAQItemProps extends BaseBlockProps {
  /**
   * 질문
   */
  question: string;

  /**
   * 답변 (React Node 지원)
   */
  answer: React.ReactNode;

  /**
   * 기본 열림 상태
   */
  defaultOpen?: boolean;

  /**
   * Controlled 열림 상태
   */
  open?: boolean;

  /**
   * 토글 핸들러
   */
  onToggle?: (open: boolean) => void;

  /**
   * 애니메이션 지속 시간 (ms)
   */
  duration?: number;
}

// 사용 예시
<Block.FAQItem
  question="How secure is my data?"
  answer="We use industry-standard encryption and SOC2 certification."
  defaultOpen
/>
```

---

## Priority 4: Utility Blocks

### 4.1 ViewportSelector Block

**목적**: 반응형 뷰포트 전환기 (Desktop/Tablet/Mobile)

```typescript
/**
 * Viewport 타입
 */
type ViewportType = "desktop" | "tablet" | "mobile";

/**
 * ViewportSelector Block Props
 */
interface ViewportSelectorProps extends BaseBlockProps {
  /**
   * 현재 선택된 뷰포트
   */
  current: ViewportType;

  /**
   * 변경 핸들러
   */
  onChange: (viewport: ViewportType) => void;

  /**
   * 위치
   * - "floating": 플로팅 (중앙 상단, 기본값)
   * - "inline": 인라인 (툴바 내부)
   */
  position?: "floating" | "inline";

  /**
   * 커스텀 뷰포트 정의 (선택)
   * WHY: 특정 디바이스 크기 추가 가능
   */
  viewports?: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
    width?: number;
  }>;
}

// 사용 예시
<Block.ViewportSelector
  current={viewport}
  onChange={setViewport}
  position="floating"
/>
```

---

### 4.2 Badge Block

**목적**: 상태/카테고리 표시용 작은 라벨

```typescript
/**
 * Badge Block Props
 */
interface BadgeProps extends BaseBlockProps {
  /**
   * 표시할 텍스트
   */
  text: string;

  /**
   * 아이콘 (선택)
   */
  icon?: React.ElementType;

  /**
   * Variant (의미적 색상)
   * - "primary": 강조 (파란색)
   * - "success": 성공 (초록색)
   * - "warning": 경고 (노란색)
   * - "danger": 위험 (빨간색)
   * - "neutral": 중립 (회색)
   */
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";

  /**
   * 크기
   * - "sm": 작은 크기 (기본값)
   * - "md": 중간 크기
   * - "lg": 큰 크기
   */
  size?: "sm" | "md" | "lg";

  /**
   * Pill 형태 (완전 둥근 모서리)
   */
  pill?: boolean;

  /**
   * 클릭 가능 여부
   */
  onClick?: () => void;

  /**
   * 삭제 버튼 표시 (X 아이콘)
   */
  dismissible?: boolean;

  /**
   * 삭제 핸들러
   */
  onDismiss?: () => void;
}

// 사용 예시
<Block.Badge
  text="New Feature"
  icon={Sparkles}
  variant="primary"
  pill
/>
```

---

## 공통 타입 정의

```typescript
/**
 * 공통 Token 타입들
 * 모든 Block에서 재사용
 */

/** Surface Token */
type SurfaceToken = "base" | "raised" | "sunken" | "overlay" | "primary" | "selected";

/** Radius Token (2-Tier) */
type Radius2Token = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "round";

/** Shadow Token */
type ShadowToken = "sm" | "md" | "lg" | "xl" | "2xl";

/** Action Variant */
type ActionVariant = "ghost" | "surface" | "primary";

/** Space Token (1-Tier, 숫자는 TOKEN ID) */
type SpaceToken = number; // 예: 4 = 16px (--space-4)

/** Size Token (1-Tier) */
type WidthToken = number; // 예: 60 = 240px (--size-60)
type HeightToken = number;

/** Align Token */
type AlignToken = "start" | "center" | "end" | "stretch" | "baseline";

/** Justify Token */
type JustifyToken = "start" | "center" | "end" | "between" | "around" | "evenly";

/** Cursor Token */
type CursorToken = "pointer" | "default" | "text" | "move" | "not-allowed" | "grab" | "grabbing";

/**
 * Restricted Frame Style
 * spacing, sizing 속성은 차단 (Token 사용 강제)
 */
type RestrictedFrameStyle = Omit<
  React.CSSProperties,
  | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight"
  | "margin" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight"
  | "padding" | "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight"
  | "gap" | "opacity" | "borderRadius" | "boxShadow" | "zIndex" | "borderWidth"
>;
```

---

## 구현 예시: Hero Block 전체 코드

```typescript
/**
 * Hero Block Implementation Example
 * /src/design-system/Block/Marketing/Hero.tsx
 */

import { ArrowRight } from "lucide-react";
import { Action } from "../../Action";
import { Frame } from "../../Frame/Frame";
import { Layout } from "../../Frame/Layout/Layout";
import { Icon } from "../../Icon";
import { Text } from "../../text/Text";
import { IconSize, Size, Space } from "../../token/token.const.1tier";
import { Radius2 } from "../../token/token.const.2tier";
import type { HeroProps } from "./Hero.types";

export function Hero({
  variant = "centered",
  title,
  subtitle,
  badge,
  primaryAction,
  secondaryAction,
  media,
  decoration = false,
  maxWidth = 800,
  surface = "base",
  className,
  style,
  ...props
}: HeroProps) {
  return (
    <Frame
      override={{
        w: Size.full,
        py: variant === "fullscreen" ? Space.n0 : Space.n128,
        px: Space.n24,
        gap: Space.n24,
        align: variant === "split" ? "start" : "center",
      }}
      surface={surface}
      style={{
        minHeight: variant === "fullscreen" ? "100vh" : undefined,
        position: "relative",
        ...style,
      }}
      className={className}
      {...props}
    >
      {/* Background Decoration */}
      {decoration && (
        <>
          <Frame
            style={{
              position: "absolute",
              top: "-25px",
              right: "-25px",
              width: "300px",
              height: "300px",
              background: "var(--color-primary)",
              filter: "blur(150px)",
              opacity: 0.1,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Content Area */}
      <Frame
        style={{ maxWidth: `${maxWidth}px`, width: "100%" }}
        override={{
          gap: Space.n24,
          align: variant === "split" ? "start" : "center",
        }}
        layout={variant === "split" ? Layout.Row.Item.Default : undefined}
      >
        {/* Text Content */}
        <Frame override={{ gap: Space.n16, flex: variant === "split" ? 1 : undefined }}>
          {badge && (
            <Frame
              rounded={Radius2.full}
              surface="raised"
              layout={Layout.Row.Item.Compact}
              override={{
                py: Space.n4,
                px: Space.n12,
                gap: Space.n8,
                align: "center",
              }}
            >
              {badge.icon && (
                <Icon
                  src={badge.icon}
                  size={IconSize.n12}
                  style={{ color: "var(--color-primary)" }}
                />
              )}
              <Text.Card.Note weight="bold">{badge.text}</Text.Card.Note>
            </Frame>
          )}

          <Text.Prose.Title variant="xl" style={{ textAlign: variant === "centered" ? "center" : "left" }}>
            {title}
          </Text.Prose.Title>

          {subtitle && (
            <Text.Prose.Body
              style={{
                textAlign: variant === "centered" ? "center" : "left",
                color: "var(--text-secondary)",
              }}
            >
              {subtitle}
            </Text.Prose.Body>
          )}

          {/* CTAs */}
          {(primaryAction || secondaryAction) && (
            <Frame
              layout={Layout.Row.Actions.Default}
              override={{ gap: Space.n12, pt: Space.n16 }}
            >
              {primaryAction && (
                <Action
                  label={primaryAction.label}
                  onClick={primaryAction.onClick}
                  variant="primary"
                  size="lg"
                  rounded={Radius2.full}
                  px={Space.n24}
                  gap={Space.n8}
                >
                  {primaryAction.icon && (
                    <Icon src={primaryAction.icon} size={IconSize.n20} />
                  )}
                </Action>
              )}

              {secondaryAction && (
                <Action
                  label={secondaryAction.label}
                  onClick={secondaryAction.onClick}
                  variant="surface"
                  size="lg"
                  rounded={Radius2.full}
                  px={Space.n24}
                />
              )}
            </Frame>
          )}
        </Frame>

        {/* Media (split variant only) */}
        {variant === "split" && media && (
          <Frame override={{ flex: 1 }}>
            {media.type === "image" && media.src ? (
              <img src={media.src} alt={media.alt} style={{ width: "100%", height: "auto" }} />
            ) : media.type === "component" ? (
              media.component
            ) : null}
          </Frame>
        )}
      </Frame>
    </Frame>
  );
}
```

---

## 다음 단계

1. **타입 파일 생성**: 각 Block의 `*.types.ts` 파일 작성
2. **구현 시작**: Phase 1 Block부터 순차 구현
3. **Storybook 작성**: 각 Block의 variants 문서화
4. **테스트 작성**: Props validation 및 렌더링 테스트
5. **Migration Guide**: 기존 앱에서 Block 사용 전환 가이드

---

## 참고 사항

### Props Naming Best Practices

1. **Boolean Props**: `is-`, `has-`, `should-` 접두사 사용
   - `isOpen`, `hasIcon`, `shouldAutoFocus`

2. **Handler Props**: `on-` 접두사 사용
   - `onClick`, `onChange`, `onToggle`

3. **Data Props**: 단수/복수 구분
   - Single: `item`, `action`, `section`
   - Multiple: `items`, `actions`, `sections`

4. **Token Props**: 명확한 타입 표시
   - `surface: SurfaceToken`
   - `rounded: Radius2Token`
   - `gap: SpaceToken`

5. **Variant Props**: 명확한 의미 전달
   - `variant: "centered" | "split"` (❌ `type`)
   - `position: "left" | "right"` (❌ `side`)
