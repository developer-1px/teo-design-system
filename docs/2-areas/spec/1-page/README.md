# 1-page: Page 컴포넌트 스펙

Page는 **IDDL 컴포넌트 계층의 최상위 루트**로, 애플리케이션의 전체 레이아웃을 정의합니다.

## 📄 스펙 문서

- **[page.gpt.spec.md](./page.gpt.spec.md)** - Page 컴포넌트 스펙 (GPT 버전)
  - PageRole 타입 정의 (Application, Document, Focus, Fullscreen)
  - 레이아웃 시스템 (Studio, HolyGrail, Sidebar, Split, etc.)
  - Dynamic Grid Template 시스템

- **[page.gemini.spec.md](./page.gemini.spec.md)** - Page 컴포넌트 스펙 (Gemini 버전)
  - 상세 구현 가이드
  - Props API 레퍼런스
  - 사용 예시

## 🎯 Page의 역할

Page는 4가지 PageRole을 통해 다양한 화면 유형을 지원합니다:

### PageRole 타입

| Role | 용도 | Physical Laws |
|------|------|---------------|
| **Application** | IDE, Studio, Dashboard | Full-screen, no scroll (`w-screen h-screen overflow-hidden`) |
| **Document** | 문서, 설정, 폼 | Scrollable (`min-h-screen overflow-y-auto`) |
| **Focus** | 로그인, 결제 | Centered content (`flex items-center justify-center`) |
| **Fullscreen** | 프레젠테이션, 키오스크 | Locked viewport (no scroll, no chrome) |

### 주요 기능

- **Dynamic Grid System**: Section의 role에 따라 자동으로 CSS Grid 생성
- **Resizable Panels**: 사용자가 패널 크기를 조정할 수 있는 기능
- **Layout Templates**: 사전 정의된 레이아웃 패턴 (Studio, HolyGrail, Sidebar, etc.)
- **Breadcrumbs & Navigation**: 페이지 네비게이션 지원

## 📁 구조

```tsx
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
  <Section role="Panel">...</Section>
</Page>
```

## 🔗 관련 문서

- [../0-core/](../0-core/) - IDDL 핵심 스펙
- [../2-section/](../2-section/) - Section 컴포넌트 스펙
- [../9-meta/](../9-meta/) - 구현 분석 및 로드맵

## 📍 구현 위치

- **Component**: `src/components/types/Page/Page.tsx`
- **Renderers**: `src/components/types/Page/renderers/AppLayout.tsx`
- **Hooks**: `src/components/types/Page/hooks/useDynamicGridTemplate.ts`

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
