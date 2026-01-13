# Minimal Design Kit (Teo Design System)

이 프로젝트는 단순한 UI 라이브러리를 넘어, **프리미엄급 데이터 밀집 인터페이스(Premium Data-Dense Interfaces)**를 구축하기 위한 실험적이고 진보적인 디자인 시스템 구현체입니다.

단순히 예쁜 컴포넌트를 모아둔 것이 아니라, **"개발자의 의도가 코드에 직관적으로 드러나는 아키텍처"**를 목표로 설계되었습니다.

---

## 💡 배경 및 의도 (Background & Intent)

### 1. "Utility Class의 한계 극복과 Semantic Design"
Tailwind CSS와 같은 Utility-first 방식은 빠르지만, 프로젝트가 커질수록 "디자인의 의미"가 사라지고 "수치"만 남는 문제가 있었습니다.
이 프로젝트는 **Design Token**과 **Component Primitive**를 결합하여, `calssName="p-4 bg-white"` 대신 `<Frame p={4} surface="page">`와 같이 **구조와 의도**를 명확히 표현하고자 했습니다.

### 2. "Pure White & Zero-Decoration"
화려한 장식으로 본질을 가리는 디자인이 아니라, **컨텐츠와 데이터가 주인공이 되는** "Pure White" 아키텍처를 지향합니다.
그림자, 경계선, 여백의 미묘한 차이만으로 계층(Hierarchy)을 표현하는 **Composite Surface Model**을 구현했습니다.

### 3. "DevTools for Design Systems"
브라우저의 기본 개발자 도구는 `<div>`와 CSS만 보여줄 뿐, 우리가 만든 "컴포넌트"를 이해하지 못합니다.
이 간극을 메우기 위해 **React Fiber를 직접 순회하여 디자인 시스템 컴포넌트를 인식하고 수정할 수 있는 전용 Inspector Overlay**를 직접 구현했습니다.

---

## 🔥 핵심 기술 및 구현 노력 (Key Efforts)

이 프로젝트를 진행하며 특별히 공을 들인 기술적 도전들은 다음과 같습니다.

### 🛠 1. The `Frame` Architecture (Hybrid CSS Variable Engine)
모든 레이아웃의 근간이 되는 `Frame` 컴포넌트는 단순한 `div` 래퍼가 아닙니다.
- **성능 최적화**: Props로 전달된 수치들을 실시간으로 CSS Variable로 변환하여(`frameToSettings`), 런타임 오버헤드를 최소화하면서 동적인 스타일링을 가능하게 했습니다.
- **Unified Props**: Flex, Grid, Position, Spacing을 하나의 인터페이스로 통합하여 `row`, `pack`, `fill` 등 직관적인 Props로 복잡한 레이아웃을 선언적으로 작성할 수 있습니다.

### 🔮 2. Custom Inspector Overlay (`src/inspector`)
가장 많은 노력을 기울인 부분 중 하나로, **런타임에 리액트 컴포넌트 트리(Fiber)를 역추적**하는 독자적인 디버깅 도구입니다.
- **Deep Component Awareness**: 단순 DOM 요소가 아닌, `Action`, `Field`, `Prose` 등 디자인 시스템의 Atomic 컴포넌트 단위를 인식하여 스냅(Snap)합니다.
- **AI Assist Integration**: 컴포넌트의 구조를 분석하여 "Fix Padding", "Convert to Row" 등의 수정 제안을 LLM 프롬프트 형태로 즉시 생성해주는 기능을 내장했습니다.
- **Interactive Locking**: 요소를 'Lock' 걸어두고 스타일 속성과 계층 구조(Hierarchy Stack)를 실시간으로 분석합니다.

### 🎨 3. Multi-Layered Token System
`src/design-system/tokens.css`에 정의된 토큰 시스템은 3계층 구조를 엄격히 따릅니다.
- **Tier 1 (Scalar/Primitive)**: `space-4`, `zinc-500` 등 원자 단위 값.
- **Tier 2 (Semantic)**: `surface-page`, `text-subtle`, `border-color` 등 의미론적 별칭.
- **Tier 3 (Component)**: `control-bg`, `field-height` 등 컴포넌트 전용 토큰.
이를 통해 다크 모드(`[data-theme="dark"]`) 전환이 완벽하게 자동화되며, 유지보수성을 극대화했습니다.

---

## 📂 프로젝트 구조

```bash
src/
├── design-system/     # 핵심 디자인 시스템 (Frame, Text, Action 등)
│   ├── tokens.css     # 3계층 토큰 정의 (Zinc Palette, Semantic Surfaces)
│   └── Frame.tsx      # Hybrid Layout Engine
├── inspector/         # React Fiber 기반 커스텀 인스펙터
├── apps/              # 디자인 시스템을 검증하기 위한 데모 애플리케이션
│   ├── CMSApp.tsx     # 컨텐츠 관리 시스템 UI 데모
│   ├── IDEApp.tsx     # 통합 개발 환경 UI 데모
│   └── LandingApp.tsx # 랜딩 페이지 데모
└── main.tsx           # Entry Point
```

## 🚀 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm run dev
```

---

이 키트는 단순한 코드가 아니라, **"더 나은 인터페이스 구축 방법론"**에 대한 치열한 고민의 결과물입니다.
