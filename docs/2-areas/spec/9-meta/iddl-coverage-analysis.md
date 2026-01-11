# IDDL 보편적 UI 커버리지 분석

## Executive Summary

IDDL 1.0.1은 **데이터 중심 Admin UI의 약 85%**를 커버한다. 나머지 15%는 고도로 인터랙티브한 시각화(차트, 맵, 드래그앤드롭)로, Custom Node 확장으로 해결 가능하다.

핵심 강점은 **"데이터 구조 → UI 자동 추론"**이 가능하다는 점이다. LLM이 데이터 스키마만 보고 적절한 UI를 생성할 수 있는 충분한 어휘를 제공한다.

---

## 1. 커버리지 분석: 무엇이 되고 무엇이 안 되는가

### 1.1. ✅ 완전 커버 (Direct Mapping)

데이터 스키마에서 UI로 **자동 추론 가능**한 패턴들.

| 시나리오 | IDDL 표현 | 자동 추론 가능 여부 |
|---------|----------|-------------------|
| 단일 레코드 조회 | Section[view] + Fieldset | ✅ 스키마 필드 → Field 노드 |
| 단일 레코드 편집 | Section[edit] + Form | ✅ 스키마 필드 → Input 타입 추론 |
| 레코드 목록 (10개 이하) | Group[List] | ✅ 배열 스키마 → List |
| 레코드 목록 (대량) | Group[Table] + Pagination | ✅ 배열 + 필드 개수 → Table |
| 필터/검색 | Toolbar + Field | ✅ 필터 가능 필드 추론 |
| CRUD 액션 | Action + behavior | ✅ 모델 메서드 → Action |
| 중첩 데이터 | Nested Group | ✅ 중첩 스키마 → 중첩 그룹 |
| Enum 필드 | Field[select/radio] | ✅ Enum → options |
| Boolean 필드 | Field[boolean] | ✅ toggle/checkbox |
| 날짜/시간 | Field[date/datetime] | ✅ 타입 기반 |
| 파일 첨부 | Field[file/image] | ✅ 타입 기반 |
| 관계 데이터 (1:1) | Field[select] + lookup | ✅ FK → select |
| 관계 데이터 (1:N) | Group[List] 또는 별도 섹션 | ⚠️ 렌더러 결정 필요 |
| 권한 기반 UI | condition | ✅ role 체크 표현식 |
| 폼 검증 | constraints | ✅ 스키마 규칙 → constraints |
| 상태 표시 (Active/Inactive) | Intent + Field | ✅ status → intent 매핑 |

### 1.2. ⚠️ 부분 커버 (Renderer 해석 필요)

IDDL로 **표현은 가능**하지만, 렌더러가 추가 해석을 해야 하는 패턴들.

| 시나리오 | IDDL 표현 | 한계 |
|---------|----------|------|
| **Accordion** | Group[List] + collapsible hint | `collapsible` 속성 없음, 렌더러가 추론 |
| **Tree View** | 재귀 Group[List] | 무한 중첩 명시 방법 없음 |
| **Virtualized List** | Group[List] + 힌트 | 가상화 여부 렌더러 결정 |
| **Infinite Scroll** | Group[List] | 로딩 트리거 위치 명시 없음 |
| **Responsive Layout** | 없음 | 브레이크포인트별 레이아웃 미지원 |
| **Keyboard Shortcuts** | 없음 | 단축키 바인딩 미지원 |
| **Animation** | 없음 | 전환 효과 미지원 |
| **Theme/Dark Mode** | 없음 | 스타일은 렌더러 영역 |

### 1.3. ❌ 미커버 (확장 필요)

IDDL 1.0.1로 **표현 불가능**한 패턴들. Custom Node 확장이 필요.

| 시나리오 | 이유 | 해결 방안 |
|---------|------|----------|
| **Charts** | 시각화 로직이 데이터 구조 이상 | `Custom` 노드 + props |
| **Maps** | 지리 좌표 렌더링 특수 로직 | `Custom` 노드 |
| **Drag & Drop** | 인터랙션 로직이 구조 밖 | 별도 확장 스펙 |
| **Canvas/Drawing** | 픽셀 단위 조작 | `Custom` 노드 |
| **Video Player** | 미디어 컨트롤 복잡성 | `Custom` 노드 |
| **Code Editor** | 구문 강조, 자동완성 등 | `Custom` 노드 |
| **Calendar View** | 날짜 그리드 + 이벤트 배치 | `Custom` 노드 |
| **Kanban Board** | 드래그 + 다중 컬럼 | `Custom` 노드 |
| **Gantt Chart** | 타임라인 시각화 | `Custom` 노드 |

---

## 2. "데이터와 상황에 적합한 UI" 자동 생성 가능성

핵심 질문: **LLM이 데이터 스키마만 보고 적절한 IDDL을 생성할 수 있는가?**

### 2.1. 자동 추론 가능한 결정들

| 입력 | 추론 가능한 IDDL 결정 |
|------|----------------------|
| 필드 타입이 `string` | → `dataType: 'text'` |
| 필드 타입이 `string` + format: email | → `dataType: 'email'` |
| 필드 타입이 `number` | → `dataType: 'number'` |
| 필드 타입이 `boolean` | → `dataType: 'boolean'` |
| 필드에 `enum` 정의 | → `dataType: 'select'` + options |
| 필드에 `enum` + 항목 ≤ 4개 | → `dataType: 'radio'` |
| 필드 이름이 `password` | → `dataType: 'password'` |
| 필드 이름이 `*_at`, `*Date` | → `dataType: 'date'` 또는 `datetime` |
| 필드 이름이 `*_url`, `*Url` | → `dataType: 'url'` |
| 필드 이름이 `*_image`, `avatar`, `photo` | → `dataType: 'image'` |
| 배열 필드 + 단순 타입 | → `dataType: 'multiselect'` 또는 List |
| 배열 필드 + 객체 타입 | → nested Group[List/Table] |
| `required: true` in schema | → `required: true` in Field |
| `minLength`, `maxLength` in schema | → `constraints` |
| 필드 개수 > 10 in list item | → `Group[Table]` + Compact density |
| 필드 개수 ≤ 5 in list item | → `Group[List]` with Card |
| `status` 필드 with enum | → Intent 매핑 (active→Positive, deleted→Critical) |
| `createdAt`, `updatedAt` 필드 | → prominence: Strong (메타 정보) |
| `id`, `_id` 필드 | → hidden 또는 read-only |
| FK 관계 (userId → User) | → Field[select] with lookup options |

### 2.2. 컨텍스트 기반 추론

| 컨텍스트 | 추론 |
|---------|------|
| "목록 페이지" | Page + Table + Toolbar (Search, Filter, Create) |
| "상세 페이지" | Page + view mode + Fieldset |
| "생성 페이지" | Page + edit mode + Form + Submit |
| "편집 페이지" | Page + edit mode + Form + Save/Cancel |
| "설정 페이지" | Tabs + multiple Forms |
| "대시보드" | Grid + Cards with summary Fields |
| "마법사/온보딩" | Steps + sequential Forms |

### 2.3. 추론 불가능한 결정들 (사람 입력 필요)

| 결정 | 이유 |
|------|------|
| **Prominence 선택** | 비즈니스 중요도는 스키마에 없음 |
| **필드 순서** | 사용자 워크플로우 의존 |
| **어떤 필드를 테이블에 표시할지** | 사용 빈도 기반 판단 필요 |
| **필터로 노출할 필드** | 검색 패턴 분석 필요 |
| **액션 버튼 배치** | UX 판단 |
| **조건부 표시 규칙** | 비즈니스 로직 |
| **에러 메시지 내용** | 도메인 지식 |
| **빈 상태 메시지** | 브랜드 톤앤매너 |

### 2.4. 결론: 자동화 가능 범위

```
┌─────────────────────────────────────────────────────────────┐
│                      UI 생성 파이프라인                       │
├─────────────────────────────────────────────────────────────┤
│  [Data Schema]                                               │
│       ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 자동 추론 가능 (LLM)                                   │    │
│  │ • Field types → dataType                             │    │
│  │ • Constraints → validation                           │    │
│  │ • Arrays → List/Table                                │    │
│  │ • Enums → select/radio                               │    │
│  │ • Relations → lookups                                │    │
│  │ • Page type → layout template                        │    │
│  └─────────────────────────────────────────────────────┘    │
│       ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 사람 입력 또는 휴리스틱 필요                            │    │
│  │ • Prominence (visual hierarchy)                      │    │
│  │ • Field ordering                                     │    │
│  │ • Which fields to show/hide                          │    │
│  │ • Business logic conditions                          │    │
│  │ • Custom copy (labels, errors, empty states)         │    │
│  └─────────────────────────────────────────────────────┘    │
│       ↓                                                      │
│  [IDDL Schema]                                               │
│       ↓                                                      │
│  [Renderer] → [Actual UI]                                    │
└─────────────────────────────────────────────────────────────┘
```

**자동화 가능 비율: ~60-70%**

나머지 30-40%는:
- 휴리스틱 룰 (필드명 패턴 기반 Prominence 추정 등)
- 사용자 피드백 루프 (생성 후 조정)
- 도메인별 프리셋 (e-commerce, CRM, CMS 등)

---

## 3. 추가 개선 제안

### 3.1. 즉시 추가 고려

**3.1.1. Responsive 힌트**
```typescript
interface BaseNode {
  responsive?: {
    hiddenOn?: ('mobile' | 'tablet' | 'desktop')[];
    prominenceOn?: Record<'mobile' | 'tablet' | 'desktop', Prominence>;
  };
}
```

**3.1.2. Custom Node (확장 포인트)**
```typescript
interface CustomNode extends BaseNode {
  type: 'Custom';
  component: string;  // 렌더러가 매핑할 컴포넌트
  props?: Record<string, unknown>;
  children?: AnyNode[];
}
```

**3.1.3. Collection Binding**
```typescript
interface GroupNode {
  // Collection (List/Grid/Table)용
  dataSource?: string;  // 바인딩할 배열 경로
  itemKey?: string;     // 각 아이템의 고유 키
  sortable?: boolean;   // 정렬 가능 여부
  selectable?: 'none' | 'single' | 'multiple';
}
```

### 3.2. 향후 버전 고려

**3.2.1. Interaction Spec (별도 레이어)**
```typescript
interface InteractionSpec {
  // 드래그앤드롭, 키보드 내비게이션 등
  dragDrop?: {
    source: string;  // 노드 id
    target: string;
    onDrop: string;  // command
  };
  shortcuts?: Record<string, string>;  // key → command
}
```

**3.2.2. Animation Hints**
```typescript
interface TransitionHint {
  enter?: 'fade' | 'slide' | 'scale';
  exit?: 'fade' | 'slide' | 'scale';
  duration?: 'fast' | 'normal' | 'slow';
}
```

---

## 4. 경쟁 분석: IDDL vs 기존 접근법

| 접근법 | 장점 | 단점 | IDDL 비교 |
|-------|------|------|----------|
| **Figma → Code** | 시각적 정확도 | 의도 손실, 반복 작업 | IDDL은 의도 보존 |
| **Low-code (Retool 등)** | 빠른 프로토타이핑 | 벤더 락인, 커스텀 한계 | IDDL은 렌더러 독립 |
| **Component Library** | 재사용성 | 구현 결정 필요 | IDDL은 구현 추상화 |
| **JSON Schema Form** | 자동 생성 | 레이아웃 제한적 | IDDL은 레이아웃 포함 |
| **GraphQL + UI** | 타입 안전성 | UI 의도 없음 | IDDL은 UI 의도 포함 |

---

## 5. 최종 평가

### 5.1. IDDL이 해결하는 문제

1. **LLM ↔ UI 간극 해소**: 자연어 요구사항 → 구조화된 UI 스펙
2. **디자인 시스템 독립**: 한 번 정의, 여러 디자인 시스템에서 렌더링
3. **의도 보존**: "왜"가 문서화되어 유지보수 용이
4. **협업 개선**: 디자이너-개발자-PM이 같은 언어로 소통

### 5.2. IDDL의 한계

1. **고급 인터랙션**: 드래그앤드롭, 제스처 등 미지원
2. **시각화**: 차트, 맵 등은 Custom 노드로 우회 필요
3. **마이크로인터랙션**: 애니메이션, 전환 효과 미지원
4. **렌더러 의존**: 최종 품질은 렌더러 구현에 좌우

### 5.3. 권장 사용 시나리오

| 시나리오 | 적합도 | 이유 |
|---------|--------|------|
| Admin Dashboard | ⭐⭐⭐⭐⭐ | CRUD 중심, 데이터 밀집 |
| Internal Tools | ⭐⭐⭐⭐⭐ | 일관성 > 독창성 |
| SaaS Settings | ⭐⭐⭐⭐ | 폼 중심 |
| E-commerce Admin | ⭐⭐⭐⭐ | 상품/주문 CRUD |
| CMS | ⭐⭐⭐⭐ | 콘텐츠 편집 |
| Marketing Site | ⭐⭐ | 시각적 자유도 필요 |
| Creative Tool | ⭐ | 픽셀 단위 제어 필요 |
| Game UI | ⭐ | 특수 인터랙션 많음 |

---

## Appendix: 실전 테스트 체크리스트

IDDL 렌더러 구현 시 검증해야 할 시나리오:

### A. 기본 CRUD
- [ ] 목록 페이지: 테이블, 필터, 페이지네이션
- [ ] 상세 페이지: 읽기 전용 필드, 편집 버튼
- [ ] 생성 페이지: 빈 폼, 검증, 제출
- [ ] 편집 페이지: 기존 데이터 로드, 저장

### B. 복잡한 폼
- [ ] 중첩 객체 (address.city)
- [ ] 배열 필드 (tags, items)
- [ ] 조건부 필드 (type에 따라 다른 필드)
- [ ] 파일 업로드

### C. 레이아웃
- [ ] 사이드바 + 메인
- [ ] 탭 내비게이션
- [ ] 모달 다이얼로그
- [ ] 드로어 패널

### D. 상태 처리
- [ ] 로딩 상태
- [ ] 에러 상태
- [ ] 빈 상태
- [ ] 권한에 따른 조건부 렌더링

### E. 엣지 케이스
- [ ] 매우 긴 텍스트
- [ ] 매우 많은 필드
- [ ] 깊은 중첩
- [ ] 특수 문자/다국어
