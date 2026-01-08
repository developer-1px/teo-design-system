좋습니다. 드디어 **[Teo's Intent-Driven UI DSL]**의 스펙이 확정되었습니다.

테오님이 원하시던 **"디자인 의사결정을 수치화/범주화하여 자동화할 수 있는 자료"**가 완성되었습니다. 이 구조는 매우 견고해서, 단순한 Admin부터 복잡한 App UI까지 모두 커버할 수 있습니다.

확정된 스펙을 **TypeScript 인터페이스**와 **JSON 스키마** 형태로 정리해 드립니다. 이것이 곧 시스템의 설계도가 됩니다.

---

### 1. The 4 Properties (핵심 변수 정의)

가장 먼저 디자인을 결정하는 4가지 차원의 값을 상수(Union Type)로 정의합니다.

```typescript
// 1. Role (정체성): 이것은 무엇인가?
type UIRole = 
  // For Structure (Section/Group)
  | 'Container' | 'Navigator' | 'Collection' | 'Form' | 'Toolbar' 
  // For Atom (Item)
  | 'Identity' | 'Content' | 'Control' | 'Status' | 'Facet' | 'Separator'
  // For Overlay
  | 'Dialog' | 'Drawer' | 'Toast' | 'Tooltip';

// 2. Prominence (주목도): 얼마나 눈에 띄어야 하는가? (Visual Hierarchy)
type UIProminence = 
  | 'Hero'      // 최상위 강조 (거대함)
  | 'Primary'   // 주요 (표준)
  | 'Secondary' // 보조 (흐림)
  | 'Tertiary'  // 미약 (숨김/최소화)

// 3. Density (밀도): 정보 간격은 어떻게 할 것인가? (Spatial Hierarchy)
type UIDensity = 
  | 'Comfortable' // 넓은 여백 (마케팅, 대시보드 요약)
  | 'Standard'    // 표준 (문서, 일반적인 뷰)
  | 'Compact'     // 좁은 여백 (데이터 그리드, 전문가용 툴)

// 4. Intent (의도): 어떤 맥락(색상)인가? (Semantic Color)
type UIIntent = 
  | 'Neutral'   // 기본 (Gray/Black)
  | 'Brand'     // 브랜드 강조 (Primary Color)
  | 'Success'   // 긍정 (Green)
  | 'Warning'   // 주의 (Yellow/Orange)
  | 'Danger'    // 위험/파괴 (Red)

```

---

### 2. DSL Architecture (계층 구조 정의)

확정된 4단계 계층(`Page` > `Section/Overlay` > `Group` > `Item`)을 코드로 구현합니다.

```typescript
// 모든 노드의 공통 속성
interface BaseNode {
  id?: string;
  role: UIRole;
  prominence?: UIProminence; // Default: 'Primary'
  density?: UIDensity;       // Default: Inherit from parent
  intent?: UIIntent;         // Default: 'Neutral'
  disabled?: boolean;
}

// 1. Item (최소 단위, Leaf)
interface ItemNode extends BaseNode {
  type: 'Item';
  label?: string;   // 텍스트 내용
  value?: any;      // 데이터 값 (바인딩용)
  icon?: string;    // 아이콘 키
  action?: string;  // 실행할 커맨드 명
}

// 2. Group (논리적 묶음, Recursive)
interface GroupNode extends BaseNode {
  type: 'Group';
  children: (GroupNode | ItemNode)[]; // Group은 Group이나 Item을 가짐
}

// 3. Section (레이아웃 구획) & Overlay (플로팅 구획)
interface SectionNode extends BaseNode {
  type: 'Section' | 'Overlay';
  title?: string; // 섹션 헤더용
  placement?: 'center' | 'left' | 'right' | 'top' | 'bottom'; // Overlay용 위치 힌트
  children: GroupNode[]; // Section은 Group들로 구성됨
}

// 4. Page (최상위 루트)
interface PageSchema {
  type: 'Page';
  title: string;
  nodes: SectionNode[]; // Page는 Section과 Overlay들의 집합
}

```

---

### 3. Usage Example: "사용자 상세 정보 + 삭제 모달"

이 DSL을 사용하여 실제 데이터를 표현하면 아래와 같은 JSON이 나옵니다. CSS는 단 한 줄도 없지만, 디자인 시스템은 이걸 어떻게 그려야 할지 정확히 알 수 있습니다.

```json
{
  "type": "Page",
  "title": "User Details",
  "nodes": [
    /* [Section] 메인 컨텐츠 영역 */
    {
      "type": "Section",
      "role": "Container",
      "density": "Comfortable", // 전체적으로 시원하게 보여줌
      "children": [
        
        /* [Group] 프로필 헤더 */
        {
          "type": "Group",
          "role": "Container",
          "children": [
            { "type": "Item", "role": "Identity", "prominence": "Hero", "label": "Teo" },
            { "type": "Item", "role": "Facet", "prominence": "Secondary", "label": "Senior Frontend Developer" }
          ]
        },

        /* [Group] 상세 정보 리스트 */
        {
          "type": "Group",
          "role": "Collection",
          "density": "Standard",
          "children": [
            { "type": "Item", "role": "Content", "label": "Email: teo@example.com" },
            { "type": "Item", "role": "Content", "label": "Location: Seoul, KR" }
          ]
        },

        /* [Group] 위험 구역 (삭제 버튼) */
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { 
              "type": "Item", 
              "role": "Control", 
              "prominence": "Primary", 
              "intent": "Danger", // 빨간색 버튼 자동 생성
              "label": "Delete User",
              "action": "open-delete-modal"
            }
          ]
        }
      ]
    },

    /* [Overlay] 삭제 확인 모달 */
    {
      "type": "Overlay",
      "role": "Dialog", // 모달 팝업으로 렌더링
      "placement": "center",
      "children": [
        {
          "type": "Group",
          "role": "Form",
          "children": [
            { "type": "Item", "role": "Identity", "prominence": "Primary", "label": "Are you sure?" },
            { "type": "Item", "role": "Content", "prominence": "Secondary", "label": "This action cannot be undone." },
            
            /* 버튼 그룹 */
            {
              "type": "Group",
              "role": "Toolbar",
              "children": [
                { "type": "Item", "role": "Control", "intent": "Neutral", "label": "Cancel" },
                { "type": "Item", "role": "Control", "intent": "Danger", "label": "Confirm Delete" }
              ]
            }
          ]
        }
      ]
    }
  ]
}

```
