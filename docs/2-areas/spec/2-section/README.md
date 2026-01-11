# 2-section: Section 컴포넌트 스펙

Section은 **Page 내의 레이아웃 영역**을 정의하는 컴포넌트로, IDE/Studio 레이아웃의 주요 구성 요소입니다.

## 📄 스펙 문서

- **[section.spec.md](./section.spec.md)** - Section 컴포넌트 공식 스펙
  - SectionRole 타입 정의
  - Grid 배치 및 크기 시스템
  - Resizable/Collapsible 기능

## 🎯 Section의 역할

Section은 **Page의 layout에 따라 자동으로 배치**됩니다. 각 SectionRole은 고유한 grid area와 기본 크기를 가집니다.

### SectionRole 타입 (Studio Layout 예시)

| Role | Grid Area | 기본 크기 | 용도 |
|------|-----------|----------|------|
| **ActivityBar** | `activitybar` | 48px | 앱 전환, 주요 뷰 선택 |
| **PrimarySidebar** | `sidebar` | 250px | 파일 트리, 검색, Git |
| **Editor** | `editor` | 1fr | 메인 콘텐츠 영역 |
| **Panel** | `panel` | 300px | 터미널, 디버그, 출력 |
| **SecondarySidebar** | `secondarySidebar` | 300px | 아웃라인, 타임라인 |
| **StatusBar** | `statusbar` | 24px | 상태 정보 표시 |

### 기타 SectionRole

- **Header**: 페이지 상단 헤더
- **Footer**: 페이지 하단 푸터
- **Navigator**: 좌측 네비게이션
- **Container**: 메인 콘텐츠 컨테이너
- **Aside**: 우측 사이드바
- **Master/Detail**: Master-detail 레이아웃

## 🔧 주요 기능

### Resizable (크기 조정)

```tsx
<Section
  role="PrimarySidebar"
  resizable={{
    direction: 'horizontal',
    minSize: 200,
    maxSize: 400
  }}
>
  ...
</Section>
```

### Collapsible (접기/펼치기)

```tsx
<Section
  role="Panel"
  collapsible
  defaultCollapsed={false}
>
  ...
</Section>
```

### Scrollable (스크롤)

```tsx
<Section role="Editor" scrollable>
  ...
</Section>
```

## 📁 구조

```tsx
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">
    {/* 앱 전환 버튼 */}
  </Section>

  <Section role="PrimarySidebar" resizable collapsible>
    {/* 파일 트리 */}
  </Section>

  <Section role="Editor">
    {/* 에디터 탭 & 콘텐츠 */}
  </Section>

  <Section role="Panel" resizable collapsible>
    {/* 터미널, 디버그 콘솔 */}
  </Section>
</Page>
```

## 🔗 관련 문서

- [../0-core/](../0-core/) - IDDL 핵심 스펙
- [../1-page/](../1-page/) - Page 컴포넌트 스펙
- [../3-block/](../3-block/) - Block (Group) 컴포넌트 스펙

## 📍 구현 위치

- **Component**: `src/components/types/Section/Section.tsx`
- **Renderers**: `src/components/types/Section/renderers/`
- **Role Config**: `src/components/types/Section/role-config.ts`

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
