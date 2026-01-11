# Section Specification

Section은 Page 내의 물리적인 공간 구획을 담당합니다. Page Layout Template의 슬롯에 대응됩니다.

## SectionRole

| Role | 설명 | 주요 자식 Block |
|------|------|---------------|
| `Header` | 상단 영역 | AppBar, Toolbar |
| `Footer` | 하단 영역 | Toolbar, Info |
| `Main` | 핵심 콘텐츠 영역 | Stack, Grid, List |
| `Navigation` | 이동/메뉴 영역 | Tabs, VerticalNav |
| `Sidebar` | 보조 정보/도구 영역 | TreeView, Inspector |
| `Search` | 검색 전용 영역 | FilterBar, SearchList |
| `Region` | 범용 지역 | Any |
| `Modal` | 팝업 레이어 | Dialog, Form |
| `Drawer` | 측면 슬라이드 레이어 | Form, TreeView |

## Props

```typescript
interface SectionProps extends BaseProps {
  role: SectionRole;
}
```

## 규칙 (Rules)

1. Section의 직계 자식은 반드시 **Block**이어야 합니다.
2. Section은 레이아웃 배치를 담당하며, 직접적인 상호작용 요소(Element)를 자식으로 가질 수 없습니다 (반드시 Block으로 감싸야 함).
3. `role`에 따라 Renderer는 적절한 HTML Landmark (header, footer, main, aside, nav 등)를 생성해야 합니다.
