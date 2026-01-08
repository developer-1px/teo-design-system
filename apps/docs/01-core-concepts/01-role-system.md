# Role System

> **"이것은 무엇인가?"** - UI 요소의 정체성을 정의합니다

---

## 개요

**Role**은 Intent-Driven UI DSL의 첫 번째 핵심 속성으로, UI 요소가 **무엇인지(What it is)**를 정의합니다. Role은 요소의 목적과 행동을 결정하며, 디자인 시스템은 이 값을 기반으로 적절한 스타일과 레이아웃을 자동으로 적용합니다.

---

## Role 분류

### For Structure (Section/Group)

구조를 형성하는 컨테이너 요소들:

| Role | 설명 | 사용 예시 |
|------|------|-----------|
| `Container` | 일반적인 컨텐츠 영역 | 페이지 섹션, 카드 |
| `Navigator` | 네비게이션 요소 | 사이드바, 탭, 메뉴 |
| `Collection` | 데이터 목록/그리드 | 테이블, 리스트, 갤러리 |
| `Form` | 입력 폼 그룹 | 로그인 폼, 설정 폼 |
| `Toolbar` | 액션 버튼 그룹 | 헤더 버튼들, Footer 액션 |

### For Atom (Item)

최소 단위 요소들:

| Role | 설명 | 사용 예시 |
|------|------|-----------|
| `Identity` | 제목, 헤더 | 페이지 타이틀, 섹션 제목 |
| `Content` | 본문 텍스트 | 설명문, 단락, 라벨 |
| `Control` | 상호작용 요소 | 버튼, 링크, 토글 |
| `Status` | 상태 표시 | Badge, Tag, Indicator |
| `Facet` | 보조 정보 | 서브타이틀, 메타데이터 |
| `Separator` | 구분선 | Divider, HR |

### For Overlay

플로팅 UI 요소들:

| Role | 설명 | 사용 예시 |
|------|------|-----------|
| `Dialog` | 모달 대화상자 | 확인 모달, 입력 다이얼로그 |
| `Drawer` | 슬라이드 패널 | 사이드 메뉴, 설정 패널 |
| `Toast` | 알림 메시지 | 성공/오류 알림 |
| `Tooltip` | 툴팁 | 도움말, 힌트 |

---

## 사용 예시

```json
{
  "type": "Section",
  "role": "Container",
  "children": [
    {
      "type": "Group",
      "role": "Form",
      "children": [
        { "type": "Item", "role": "Identity", "label": "Sign In" },
        { "type": "Item", "role": "Control", "label": "Submit" }
      ]
    }
  ]
}
```

---

## 디자인 결정

Role에 따라 디자인 시스템이 자동으로 결정하는 것들:

### Navigator
- 세로 방향 레이아웃 (sidebar)
- 아이템 간 좁은 간격
- hover 상태 표시

### Collection
- 균일한 그리드/리스트 레이아웃
- 구분선 자동 삽입
- 스크롤 영역 처리

### Toolbar
- 가로 방향 레이아웃
- 버튼 간 일정한 간격
- 오른쪽 정렬 (액션 그룹)

### Control (Item)
- 클릭 가능한 인터랙션
- Focus/Hover 상태
- 키보드 접근성

### Status (Item)
- 컴팩트한 크기
- 색상 기반 시각적 구분
- 인라인 배치

---

## 원칙

1. **명확성**: 각 요소는 정확히 하나의 Role을 가져야 합니다
2. **일관성**: 같은 Role은 항상 같은 방식으로 렌더링됩니다
3. **의도 중심**: CSS 클래스가 아닌 의도(Role)로 정의합니다

---

## 다음 단계

Role을 정의한 후, 다른 속성들과 조합하여 완전한 UI를 표현합니다:

- **Prominence**: 얼마나 눈에 띄어야 하는가?
- **Density**: 정보 간격은 어떻게 할 것인가?
- **Intent**: 어떤 맥락(색상)인가?
