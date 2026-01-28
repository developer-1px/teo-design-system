# 회고: Layout Primitives 및 Pro Shell 아키텍처

## 요약 (Summary)
우리는 재사용 가능한 Primitives(`Shell`, `Panel`, `TopBar`)를 추출하고 이를 **Admin UI**(`AdminLayout`)와 **Slides Editor**(`SlidesPage`)에 모두 적용함으로써 견고한 "Pro Tool" 레이아웃 아키텍처를 성공적으로 구축했습니다. 이번 전환을 통해 애플리케이션은 임시방편(Ad-hoc) CSS 레이아웃에서 벗어나 VS Code나 Figma와 유사한 표준화된 그리드 기반 Shell 시스템으로 이동했습니다.

## 생성된 산출물 (Artifacts Created)
-   `Shell.tsx / .css.ts`: Navbar, Sidebar, AuxPanel, BottomPanel 등 구획된 인터랙션 영역을 지원하는 핵심 Grid 컨테이너.
-   `Panel.tsx / .css.ts`: 사이드바 및 도구 패널을 위한 일반화된 컴포넌트로, 표준화된 헤더, 바디, 섹션을 지원.
-   `TopBar.tsx / .css.ts`: 3개 컬럼(Left, Center, Right) 슬롯을 가진 표준화된 헤더 컴포넌트.

## 주요 성과 (Key Wins)
1.  **일관성 (Consistency)**: Admin 영역과 Slides 에디터가 이제 완전히 동일한 구조적 DNA를 공유합니다. 이는 유지보수를 단순화하고 일관되지 않은 여백이나 동작을 제거합니다.
2.  **유연성 (Flexibility)**: `Shell` 컴포넌트는 비어 있는 슬롯(예: `bottomPanel`이 없는 경우)을 자연스럽게 처리하여 그리드를 자동으로 조정하므로 다양한 뷰에 적합합니다.
3.  **리팩토링 속도 (Refactoring Velocity)**: `SlidesPage` 마이그레이션은 초기 구현보다 훨씬 적은 시간이 소요되었으며, 이는 Primitives의 재사용성을 입증합니다.
4.  **시각적 완성도 (Visual Polish)**: `surface` 토큰과 표준화된 테두리(border)를 사용하여 애플리케이션의 "프리미엄 감성"을 높였습니다.

## 과제 및 배운 점 (Challenges & Learnings)
-   **CSS Grid 복잡성**: 복잡한 Shell을 위한 `grid-template-areas` 정의에는 신중한 계획이 필요했습니다. 명명된 영역(Named Areas)은 명확성을 제공하지만 DOM 구조를 엄격히 준수해야 함을 알게 되었습니다.
-   **다형성 (Polymorphism)**: `Panel.Item`을 다형성 컴포넌트(`div`, `a`, `Link` 등으로 렌더링 가능)로 만드는 것은 라우팅 링크(AdminSidebar)와 인터랙티브 요소(Thumbnails) 간의 격차를 해소하는 데 결정적이었습니다.

## 향후 개선 사항 (Future Improvements)
-   **크기 조절 (Resizability)**: 현재 패널들은 고정되거나 콘텐츠 기반의 너비를 가집니다. `Shell` 영역에 드래그 가능한 스플리터(Splitter)를 구현하는 것이 진정한 "Pro" 경험을 위한 논리적인 다음 단계입니다.
-   **접이식 패널 (Collapsible Panels)**: `Shell`에 패널의 가시성을 토글하는 상태(예: `cmd+b`로 사이드바 토글)를 추가하는 것은 가치 있는 기능이 될 것입니다.
-   **툴바 통일 (Toolbar Unification)**: 여전히 일부 툴바 스타일(`floatingToolbar`)은 임시방편으로 구현되어 있습니다. `Toolbar` Primitive를 만들어 이 패턴을 표준화할 수 있습니다.

## 결론 (Conclusion)
**Layout Primitives**는 성공적인 기반 레이어입니다. 이는 디자인 시스템의 일관성을 강화하면서 복잡하고 밀도 높은 인터페이스("Pro Tools")를 신속하게 구축할 수 있게 해줍니다.
