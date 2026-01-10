# IDDL 1.0 표준 역할(Role) 레지스트리

**상태:** 권고안 (Recommendation)  
**버전:** 1.0.1 (Part 1 Aligned)

IDDL 1.0 Part 1에서는 `layout` 속성이 없으므로, **Role이 곧 레이아웃의 힌트**가 됩니다.
Renderer 구현 시 아래의 "기본 의도"를 참고하여 적절한 Default Layout을 구현해야 합니다.

---

## 1. Section Roles (Level 1)
| Role | 설명 | 기본 레이아웃 의도 (Default Hint) |
| :--- | :--- | :--- |
| **`Header`** | 페이지 상단 영역. | 상단 고정, 좌우 배치(Between) |
| **`Footer`** | 페이지 하단 영역. | 하단 배치 |
| **`Main`** | 핵심 컨텐츠 영역. | 남은 공간 채움 (Flex Grow) |
| **`Sidebar`** | 측면 영역. | 좌/우측 배치, 세로 스택 |
| **`Drawer`** | 오버레이 패널. | 평소 숨김, 호출 시 슬라이드 등 |
| **`Modal`** | 다이얼로그. | 중앙 정렬, 오버레이 |

---

## 2. Block Roles (Level 2)

### 2.1 컨테이너형
| Role | 설명 | 기본 렌더링 힌트 |
| :--- | :--- | :--- |
| **`Card`** | 독립된 컨텐츠 묶음. | 세로 스택, 보더/쉐도우 |
| **`List`** | 반복 아이템 집합. | 세로 스택 (또는 Grid 변형 가능) |
| **`Grid`** | 격자 배치. | `spec.columns`에 따른 Grid |
| **`Form`** | 입력 필드 집합. | 세로 스택, 간격(Gap) 있음 |

### 2.2 제어형
| Role | 설명 | 기본 렌더링 힌트 |
| :--- | :--- | :--- |
| **`Toolbar`** | 액션 버튼 모음. | 가로 나열 (Inline), 아이콘 중심 |
| **`Menu`** | 명령 목록. | 세로 스택 (드롭다운 등) |

### 2.3 유틸리티형 (Utility Blocks)
| Role | 설명 |
| :--- | :--- |
| **`Group`** | 단순 묶음. (기본 세로) |
| **`Row`** | 단순 가로 나열 묶음. (기본 가로) |

---

## 3. Element Roles (Level 3)
| Role | 유형 | 설명 |
| :--- | :--- | :--- |
| **`Title`** | Text | 가장 큰 제목 |
| **`Heading`** | Text | 중간 제목 |
| **`Body`** | Text | 본문 |
| **`Label`** | Text | 라벨 |
| **`Caption`** | Text | 작은 설명 |
