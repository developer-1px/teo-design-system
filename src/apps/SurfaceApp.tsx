import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Prose } from "../design-system/text/context/Prose.tsx";
import { Space } from "../design-system/token/token.const.1tier.ts";
import type { SurfaceToken } from "../design-system/lib/types.ts";

export function SurfaceApp() {
  return (
    <Frame
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {/* Page 1: Surface Concept Introduction */}
      <IntroductionPage />

      {/* Page 2: Surface Showcase */}
      <ShowcasePage />
    </Frame>
  );
}

function IntroductionPage() {
  return (
    <Frame
      style={{
        minHeight: "100vh",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
      }}
      surface="sunken"
      layout={Layout.Center.Default}
    >
      <Frame
        override={{
          maxWidth: "800px",
          gap: Space.n24,
        }}
        layout={Layout.Stack.Content.Loose}
      >
        {/* Title */}
        <Frame layout={Layout.Stack.Content.Tight}>
          <Prose
            role="h1"
            align="center"
            style={{
              fontSize: "clamp(48px, 8vw, 96px)",
              letterSpacing: "-0.04em",
            }}
          >
            Surface
          </Prose>
          <Prose
            role="body"
            align="center"
            color="tertiary"
            style={{ fontSize: "20px" }}
          >
            The foundation of visual hierarchy
          </Prose>
        </Frame>

        {/* Concept Explanation */}
        <Frame
          override={{
            gap: Space.n20,
            p: Space.n40,
          }}
          rounded="xl"
          surface="base"
        >
          <Frame layout={Layout.Stack.Content.Default}>
            <Prose
              role="h3"
              style={{ fontSize: "32px", fontWeight: 600 }}
            >
              What is Surface?
            </Prose>
            <Prose
              role="body"
              color="secondary"
              style={{ fontSize: "18px", lineHeight: 1.7 }}
            >
              Surface는 디자인 시스템의 <strong>배경 레이어 체계</strong>입니다.
              컴포넌트가 위치하는 깊이감(elevation)과 문맥(context)을 시각적으로 전달하며,
              명확한 정보 계층 구조를 만듭니다.
            </Prose>
          </Frame>

          <Frame layout={Layout.Stack.Content.Default}>
            <Prose
              role="h3"
              style={{ fontSize: "32px", fontWeight: 600 }}
            >
              Why Surface Matters
            </Prose>
            <Prose
              role="body"
              color="secondary"
              style={{ fontSize: "18px", lineHeight: 1.7 }}
            >
              색상이나 테두리 없이도 <strong>레이어 분리</strong>를 표현할 수 있어,
              깔끔하고 모던한 인터페이스를 구축할 수 있습니다.
              다크 모드와 라이트 모드에서 자동으로 적절한 대비를 유지합니다.
            </Prose>
          </Frame>
        </Frame>

        {/* Scroll Hint */}
        <Frame layout={Layout.Center.Default}>
          <Frame
            override={{
              gap: Space.n8,
            }}
            layout={Layout.Stack.Content.Tight}
            style={{
              opacity: 0.6,
              animation: "bounce 2s infinite",
            }}
          >
            <Prose role="caption" align="center">
              Scroll to explore
            </Prose>
            <Prose
              role="body"
              align="center"
              style={{ fontSize: "24px" }}
            >
              ↓
            </Prose>
          </Frame>
        </Frame>
      </Frame>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
    </Frame>
  );
}

function ShowcasePage() {
  const surfaces: Array<{
    token: SurfaceToken;
    name: string;
    description: string;
    usage: string;
  }> = [
    {
      token: "base",
      name: "Base",
      description: "기본 배경 레이어",
      usage: "카드, 패널, 다이얼로그 등 주요 컨텐츠 영역",
    },
    {
      token: "sunken",
      name: "Sunken",
      description: "음각 효과의 낮은 레이어",
      usage: "앱 전체 배경, Well 영역, 입력 필드",
    },
    {
      token: "raised",
      name: "Raised",
      description: "부각된 높은 레이어",
      usage: "플로팅 툴바, 드롭다운 메뉴",
    },
    {
      token: "overlay",
      name: "Overlay",
      description: "최상단 오버레이",
      usage: "모달, 토스트, 팝오버",
    },
    {
      token: "primary",
      name: "Primary",
      description: "강조 액센트 레이어",
      usage: "주요 액션 버튼, 선택된 상태",
    },
    {
      token: "selected",
      name: "Selected",
      description: "선택/활성 상태",
      usage: "선택된 리스트 아이템, 활성 탭",
    },
  ];

  return (
    <Frame
      style={{
        minHeight: "100vh",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
      }}
      surface="sunken"
      override={{
        p: Space.n40,
        gap: Space.n40,
      }}
    >
      {/* Title */}
      <Frame layout={Layout.Center.Default}>
        <Frame layout={Layout.Stack.Content.Tight}>
          <Prose
            role="h1"
            align="center"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              letterSpacing: "-0.03em",
            }}
          >
            Surface Tokens
          </Prose>
          <Prose
            role="body"
            align="center"
            color="tertiary"
            style={{ fontSize: "18px" }}
          >
            6 semantic layers for visual depth
          </Prose>
        </Frame>
      </Frame>

      {/* Surface Grid */}
      <Frame
        override={{
          maxWidth: "1400px",
          gap: Space.n24,
        }}
        style={{
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        }}
      >
        {surfaces.map((item) => (
          <SurfaceCard key={item.token} {...item} />
        ))}
      </Frame>
    </Frame>
  );
}

function SurfaceCard({
  token,
  name,
  description,
  usage,
}: {
  token: SurfaceToken;
  name: string;
  description: string;
  usage: string;
}) {
  return (
    <Frame
      surface={token}
      override={{p: Space.n32,
        gap: Space.n20}} rounded="2xl"
      style={{
        minHeight: "280px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Header */}
      <Frame layout={Layout.Stack.Content.Tight}>
        <Frame
          override={{
            gap: Space.n12,
          }}
          layout={Layout.Row.Item.Default}
        >
          {/* Color Swatch */}
          <Frame
            surface={token}
            override={{w: "48px" as any,
              h: "48px" as any}} rounded="md"
            style={{
              border: "2px solid var(--border-color)",
              flexShrink: 0,
            }}
          />

          {/* Title */}
          <Frame layout={Layout.Stack.Content.Tight}>
            <Prose
              role="h3"
              style={{
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {name}
            </Prose>
            <Prose
              role="caption"
              color="tertiary"
              style={{
                fontSize: "13px",
                fontFamily: "monospace",
                letterSpacing: "0.02em",
              }}
            >
              surface="{token}"
            </Prose>
          </Frame>
        </Frame>
      </Frame>

      {/* Description */}
      <Frame layout={Layout.Stack.Content.Default}>
        <Prose
          role="body"
          style={{
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Prose>
        <Prose
          role="body"
          color="secondary"
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          {usage}
        </Prose>
      </Frame>

      {/* Visual Example */}
      <Frame
        override={{gap: Space.n8,
          p: Space.n16}} rounded="md"
        surface={token === "sunken" ? "base" : "sunken"}
        style={{
          marginTop: "auto",
        }}
      >
        <Frame layout={Layout.Row.Item.Tight}>
          <Frame
            override={{w: "12px" as any,
              h: "12px" as any}} rounded="full"
            surface={token}
            style={{ flexShrink: 0 }}
          />
          <Prose
            role="caption"
            color="tertiary"
            style={{ fontSize: "12px" }}
          >
            Nested example
          </Prose>
        </Frame>
      </Frame>
    </Frame>
  );
}
