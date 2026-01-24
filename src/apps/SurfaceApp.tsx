import { Frame } from "../design-system/Frame/Frame.tsx";
import type { SurfaceToken } from "../design-system/lib/types.ts";
import { Prose } from "../design-system/text/context/Prose.tsx";
import {
  ContainerSize,
  Opacity,
  Size,
  Space,
} from "../design-system/token/token.const.1tier.ts";

const SURFACES: Array<{
  token: SurfaceToken;
  name: string;
  description: string;
  usage: string;
}> = [
    {
      token: "ghost",
      name: "Ghost",
      description: "투명한 배경 레이어",
      usage: "아이콘 버튼, 고스트 버튼",
    },
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
  ];

export function SurfaceApp() {
  return (
    <Frame
      override={{ minHeight: Size.screen }}
    >
      {/* Page 1: Surface Concept Introduction */}
      <IntroductionPage />

      {/* Page 2: Surface Showcase - Simple squares */}
      <ShowcasePage />

      {/* Pages 3-8: Each Surface Detail (1 page per surface) */}
      {SURFACES.map((surface, index) => (
        <SurfaceDetailPage
          key={surface.token}
          {...surface}
          pageNumber={index + 3}
        />
      ))}
    </Frame>
  );
}

function IntroductionPage() {
  return (
    <Frame
      style={{
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
      }}
      surface="sunken"
      layout={Layout.Col.Center.Start}
      spacing={Space.n0}
      override={{ minHeight: Size.screen }}
    >
      <Frame
        override={{
          gap: Space.n24,
          maxWidth: ContainerSize.n768,
        }}
        layout={Layout.Col.Left.Start}
        spacing={Space.n16}
      >
        {/* Title */}
        <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
          <Prose.Title
            variant="xl"
            style={{
              textAlign: "center",
              fontSize: "clamp(48px, 8vw, 96px)",
              letterSpacing: "-0.04em",
            }}
          >
            Surface
          </Prose.Title>
          <Prose.Note
            style={{
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            The foundation of visual hierarchy
          </Prose.Note>
        </Frame>

        {/* Concept Explanation */}
        <Frame
          override={{
            gap: Space.n20,
            p: Space.n40,
          }}
          rounded={Radius2.xl}
          surface="base"
        >
          <Frame layout={Layout.Col.Left.Start} spacing={Space.n12}>
            <Prose.Title
              variant="md"
              style={{ fontSize: "32px", fontWeight: 600 }}
            >
              What is Surface?
            </Prose.Title>
            <Prose.Body style={{ fontSize: "18px", lineHeight: 1.7 }}>
              Surface는 디자인 시스템의 <strong>배경 레이어 체계</strong>입니다.
              컴포넌트가 위치하는 깊이감(elevation)과 문맥(context)을 시각적으로
              전달하며, 명확한 정보 계층 구조를 만듭니다.
            </Prose.Body>
          </Frame>

          <Frame layout={Layout.Col.Left.Start} spacing={Space.n12}>
            <Prose.Title
              variant="md"
              style={{ fontSize: "32px", fontWeight: 600 }}
            >
              Why Surface Matters
            </Prose.Title>
            <Prose.Body style={{ fontSize: "18px", lineHeight: 1.7 }}>
              색상이나 테두리 없이도 <strong>레이어 분리</strong>를 표현할 수
              있어, 깔끔하고 모던한 인터페이스를 구축할 수 있습니다. 다크 모드와
              라이트 모드에서 자동으로 적절한 대비를 유지합니다.
            </Prose.Body>
          </Frame>
        </Frame>

        {/* Scroll Hint */}
        <Frame layout={Layout.Col.Center.Start} spacing={Space.n0}>
          <Frame
            override={{
              opacity: Opacity.n60,
            }}
            layout={Layout.Col.Left.Start}
            spacing={Space.n8}
            style={{
              animation: "bounce 2s infinite",
            }}
          >
            <Prose.Note style={{ textAlign: "center" }}>
              Scroll to explore
            </Prose.Note>
            <Prose.Body style={{ textAlign: "center", fontSize: "24px" }}>
              ↓
            </Prose.Body>
          </Frame>
        </Frame>
      </Frame>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Frame>
  );
}

function ShowcasePage() {
  return (
    <Frame
      style={{
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
      }}
      surface="sunken"
      layout={Layout.Col.Center.Start}
      spacing={Space.n0}
      override={{
        gap: Space.n40,
        minHeight: Size.screen,
      }}
    >
      <Frame
        override={{
          gap: Space.n32,
        }}
        layout={Layout.Col.Left.Start}
        spacing={Space.n12}
      >
        {/* Title */}
        <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
          <Prose.Title
            variant="xl"
            style={{
              textAlign: "center",
              fontSize: "clamp(40px, 6vw, 72px)",
              letterSpacing: "-0.03em",
            }}
          >
            Surface Tokens
          </Prose.Title>
          <Prose.Note
            style={{
              textAlign: "center",
              fontSize: "18px",
            }}
          >
            6 semantic layers for visual depth
          </Prose.Note>
        </Frame>

        {/* Square Surface Cards */}
        <Frame
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          layout={Layout.Col.Left.Start}
          spacing={Space.n16}
        >
          {SURFACES.map((item) => (
            <Frame
              key={item.token}
              surface={item.token}
              interactive
              rounded={Radius2.xl}
              override={{
                w: Size.n192,
                h: Size.n192,
                p: Space.n16,
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
              layout={Layout.Col.Center.Start}
              spacing={Space.n0}
            >
              <Prose.Title
                variant="sm"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {item.name}
              </Prose.Title>
            </Frame>
          ))}
        </Frame>

        {/* Scroll Hint */}
        <Frame layout={Layout.Col.Center.Start} spacing={Space.n0}>
          <Prose.Note
            style={{ textAlign: "center", fontSize: "14px", opacity: 0.6 }}
          >
            Scroll for details ↓
          </Prose.Note>
        </Frame>
      </Frame>
    </Frame>
  );
}

function SurfaceDetailPage({
  token,
  name,
  description,
  usage,
  pageNumber,
}: {
  token: SurfaceToken;
  name: string;
  description: string;
  usage: string;
  pageNumber: number;
}) {
  return (
    <Frame
      style={{
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        background: `linear-gradient(135deg, var(--surface-sunken) 0%, var(--surface-base) 100%)`,
      }}
      override={{
        py: Space.n64,
        px: Space.n64,
        minHeight: Size.screen,
      }}
      layout={Layout.Col.Center.Start}
      spacing={Space.n0}
    >
      <Frame
        override={{
          gap: Space.n64,
          maxWidth: ContainerSize.n1280,
          w: Size.fill,
        }}
      >
        {/* Page Number */}
        <Frame layout={Layout.Col.Center.Start} spacing={Space.n0}>
          <Prose.Code
            style={{
              fontSize: "12px",
              opacity: 0.3,
              letterSpacing: "0.15em",
            }}
          >
            {String(pageNumber).padStart(2, "0")} / 08
          </Prose.Code>
        </Frame>

        {/* 2-Column Layout */}
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
          style={{
            animation: `fadeInUp 0.8s ease both`,
          }}
          override={{ gap: Space.n64, minHeight: Size.n40 }}
        >
          {/* Left: Visual Sample */}
          <Frame override={{ flex: 1, gap: Space.n32, align: "center" }}>
            {/* Large Surface Preview */}
            <Frame
              surface={token}
              interactive
              rounded={Radius2["3xl"]}
              style={{
                aspectRatio: "1",
                display: "flex",
              }}
              override={{
                w: Size.fill,
                maxWidth: ContainerSize.n480,
                p: Space.n32,
              }}
              layout={Layout.Col.Center.Start}
              spacing={Space.n0}
            >
              <Prose.Code
                style={{
                  fontSize: "16px",
                  opacity: 0.6,
                }}
              >
                surface="{token}"
              </Prose.Code>
            </Frame>
          </Frame>

          {/* Right: Description */}
          <Frame override={{ flex: 1, gap: Space.n40 }}>
            {/* Title */}
            <Frame layout={Layout.Col.Left.Start} spacing={Space.n12}>
              <Prose.Title
                variant="xl"
                style={{
                  fontSize: "clamp(48px, 6vw, 72px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                {name}
              </Prose.Title>
              <Frame
                rounded={Radius2.sm}
                style={{
                  background: `var(--surface-${token})`,
                }}
                override={{ w: Size.n80, h: Size.n4 }}
              />
            </Frame>

            {/* Description */}
            <Frame layout={Layout.Col.Left.Start} spacing={Space.n16}>
              <Prose.Note
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  opacity: 0.5,
                }}
              >
                Description
              </Prose.Note>
              <Prose.Body
                style={{
                  fontSize: "22px",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  color: "var(--text-body)",
                }}
              >
                {description}
              </Prose.Body>
            </Frame>

            {/* Usage */}
            <Frame layout={Layout.Col.Left.Start} spacing={Space.n16}>
              <Prose.Note
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  opacity: 0.5,
                }}
              >
                Use Cases
              </Prose.Note>
              <Prose.Body
                style={{
                  fontSize: "18px",
                  lineHeight: 1.8,
                  color: "var(--text-subtle)",
                }}
              >
                {usage}
              </Prose.Body>
            </Frame>
          </Frame>
        </Frame>

        {/* Scroll Hint */}
        {pageNumber < 8 && (
          <Frame layout={Layout.Col.Center.Start} spacing={Space.n0}>
            <Prose.Note
              style={{
                textAlign: "center",
                fontSize: "12px",
                opacity: 0.3,
              }}
            >
              Scroll for next surface ↓
            </Prose.Note>
          </Frame>
        )}
      </Frame>
    </Frame>
  );
}
