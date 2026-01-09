# Prominence 시스템 완전 정복 📏

**예상 소요 시간**: 12분
**난이도**: ⭐⭐ 기초
**사전 지식**: [IDDL의 핵심 아이디어](../00-getting-started/02-core-idea.md)

---

## 이 문서를 읽고 나면

- Prominence의 4가지 레벨을 완벽히 구분할 수 있습니다
- 언제 어떤 레벨을 써야 할지 판단할 수 있습니다
- 시각적 계층을 IDDL로 표현할 수 있습니다

---

## Prominence란?

> **"얼마나 눈에 띄어야 하는가?"** - 시각적 주목도

Prominence는 UI 요소의 **시각적 무게감(Visual Weight)**을 정의합니다.
"몇 번째로 중요한가?"가 아니라 "얼마나 강하게 보이는가?"입니다.

---

## 4가지 레벨

### Hero - 최상위 강조

**의미**: "페이지의 핵심. 즉시 눈에 들어와야 함"

**시각적 특징**:
- 가장 큰 크기 (48px+)
- 굵은 폰트 (Bold/ExtraBold)
- 배경색 채움 (버튼의 경우)

**사용 예시**:
- 랜딩 페이지 메인 타이틀
- 페이지 최상단 제목
- 거대한 CTA 버튼

```json
{
  "type": "Text",
  "role": "Title",
  "content": "Welcome to Dashboard",
  "prominence": "Hero"
}
```

**렌더링 예시**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━
Welcome to Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━
(거대한 타이틀, 48px, Bold)
```

### Primary - 표준 강조 (기본값)

**의미**: "주요 콘텐츠. 자연스럽게 주목됨"

**시각적 특징**:
- 표준 크기 (16px)
- 중간 굵기 (Medium)
- Solid 스타일 (버튼의 경우)

**사용 예시**:
- 일반 본문 텍스트
- 주요 버튼
- 섹션 제목

```json
{
  "type": "Action",
  "label": "Save Changes",
  "prominence": "Primary",  // 생략 가능 (기본값)
  "intent": "Positive"
}
```

**렌더링 예시**:
```
┌─────────────────┐
│  Save Changes   │  ← 표준 크기 버튼
└─────────────────┘
```

### Secondary - 보조 강조

**의미**: "보조 정보. 필요시 발견됨"

**시각적 특징**:
- 작은 크기 (14px)
- 흐린 색상 (60% opacity)
- Outline 스타일 (버튼의 경우)

**사용 예시**:
- 서브타이틀, 부제
- 보조 버튼 (Cancel 등)
- 설명 텍스트

```json
{
  "type": "Text",
  "role": "Body",
  "content": "This is a description",
  "prominence": "Secondary"
}
```

**렌더링 예시**:
```
This is a description
(작고 흐린 회색 텍스트)
```

### Tertiary - 최소 강조

**의미**: "부가 정보. 배경에 녹아듦"

**시각적 특징**:
- 최소 크기 (12px)
- 매우 흐림 (40% opacity)
- Ghost/Link 스타일 (버튼의 경우)

**사용 예시**:
- 메타 정보 (작성일, 조회수 등)
- 캡션, 힌트 텍스트
- 아이콘 버튼

```json
{
  "type": "Text",
  "role": "Caption",
  "content": "Last updated 2 hours ago",
  "prominence": "Tertiary"
}
```

**렌더링 예시**:
```
Last updated 2 hours ago
(거의 안 보이는 작은 회색 텍스트)
```

---

## 레벨 비교표

| 레벨 | 크기 | 굵기 | 불투명도 | 버튼 스타일 | 사용 빈도 |
|------|------|------|----------|-------------|----------|
| **Hero** | 48px | 700 | 100% | Solid (거대) | 페이지당 1개 |
| **Primary** | 16px | 500 | 100% | Solid | 주요 요소 |
| **Secondary** | 14px | 400 | 60% | Outline | 보조 요소 |
| **Tertiary** | 12px | 400 | 40% | Ghost/Link | 메타 정보 |

---

## 노드 타입별 Prominence

### Text 노드

```json
// Hero → h1 또는 Display 폰트
{ "type": "Text", "role": "Title", "prominence": "Hero" }

// Primary → h2 또는 본문 표준
{ "type": "Text", "role": "Body", "prominence": "Primary" }

// Secondary → h3 또는 작은 본문
{ "type": "Text", "role": "Body", "prominence": "Secondary" }

// Tertiary → Caption 또는 힌트
{ "type": "Text", "role": "Caption", "prominence": "Tertiary" }
```

### Action 노드 (버튼)

```json
// Hero → 전체 폭 또는 거대 CTA
{
  "type": "Action",
  "label": "Get Started",
  "prominence": "Hero",
  "intent": "Brand"
}
// → [========== Get Started ==========]

// Primary → 표준 Solid 버튼
{
  "type": "Action",
  "label": "Save",
  "prominence": "Primary"
}
// → [Save]

// Secondary → Outline 버튼
{
  "type": "Action",
  "label": "Cancel",
  "prominence": "Secondary"
}
// → [ Cancel ]

// Tertiary → 텍스트 링크 또는 아이콘 버튼
{
  "type": "Action",
  "label": "Learn more",
  "prominence": "Tertiary"
}
// → Learn more →
```

### Field 노드

```json
// Hero → 거대한 입력 필드 (검색 등)
{
  "type": "Field",
  "label": "Search",
  "model": "query",
  "dataType": "text",
  "prominence": "Hero"
}

// Primary → 표준 입력 필드
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "prominence": "Primary"  // 기본값
}

// Secondary → 작은 입력 필드
{
  "type": "Field",
  "label": "Tags",
  "model": "post.tags",
  "dataType": "text",
  "prominence": "Secondary"
}

// Tertiary → 인라인 편집
{
  "type": "Field",
  "label": "Note",
  "model": "note",
  "dataType": "text",
  "prominence": "Tertiary"
}
```

---

## 계층 구조 원칙

### 1. 페이지당 Hero는 최대 1개

```json
// ✅ Correct
{
  "children": [
    { "prominence": "Hero" },      // 1개만
    { "prominence": "Primary" },
    { "prominence": "Primary" }
  ]
}

// ❌ Wrong
{
  "children": [
    { "prominence": "Hero" },      // Hero가
    { "prominence": "Hero" }       // 2개 → 경쟁
  ]
}
```

### 2. 부모보다 자식이 더 강할 수 없음

```json
// ✅ Correct: 부모 ≥ 자식
{
  "prominence": "Primary",
  "children": [
    { "prominence": "Primary" },    // 같거나
    { "prominence": "Secondary" }   // 낮음
  ]
}

// ❌ Wrong: 자식 > 부모
{
  "prominence": "Secondary",
  "children": [
    { "prominence": "Hero" }        // 부모보다 강함 (이상함)
  ]
}
```

### 3. 연속된 레벨 건너뛰지 않기

```json
// ✅ Correct: 순차적 감소
Hero → Primary → Secondary → Tertiary

// ⚠️ 가능하지만 비추천: 레벨 건너뜀
Hero → Secondary (Primary 건너뜀)
```

---

## 실습 1: 프로필 카드

다음 UI를 Prominence로 표현해보세요:

```
┌────────────────────────────┐
│  Teo                       │  ← 가장 눈에 띄는 이름
│  Senior Frontend Developer │  ← 중간 크기 직책
│  Seoul, Korea              │  ← 작은 위치
│  Last seen 5 minutes ago   │  ← 거의 안 보이는 메타
└────────────────────────────┘
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Teo",
      "prominence": "Primary"  // 카드 안에서 가장 강조
    },
    {
      "type": "Text",
      "role": "Body",
      "content": "Senior Frontend Developer",
      "prominence": "Secondary"  // 중간 강조
    },
    {
      "type": "Text",
      "role": "Body",
      "content": "Seoul, Korea",
      "prominence": "Tertiary"  // 약한 강조
    },
    {
      "type": "Text",
      "role": "Caption",
      "content": "Last seen 5 minutes ago",
      "prominence": "Tertiary"  // 거의 안 보임
    }
  ]
}
```

</details>

---

## 실습 2: 버튼 그룹

다음 버튼 그룹의 Prominence를 정의하세요:

```
[Delete]  [Cancel]  [  Save  ]
  ↑          ↑           ↑
위험함    보조     메인 액션
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    {
      "type": "Action",
      "label": "Delete",
      "prominence": "Secondary",  // 작게 (위험하지만 자주 안 씀)
      "intent": "Critical"
    },
    {
      "type": "Action",
      "label": "Cancel",
      "prominence": "Secondary",  // 보조 버튼
      "intent": "Neutral"
    },
    {
      "type": "Action",
      "label": "Save",
      "prominence": "Primary",  // 메인 CTA
      "intent": "Positive"
    }
  ]
}
```

**포인트**: Prominence는 "위험도"가 아니라 "주목도"입니다.
Delete는 위험하지만 (intent: Critical), 주목도는 낮습니다 (prominence: Secondary).

</details>

---

## 실습 3: 대시보드 통계

다음 통계 카드의 Prominence를 정의하세요:

```
┌────────────┐
│  $45,231   │  ← 거대한 숫자
│  Revenue   │  ← 작은 라벨
│  +12.5%    │  ← 작은 변화량
└────────────┘
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Field",
      "label": "",
      "model": "stats.revenue",
      "dataType": "currency",
      "prominence": "Hero"  // 거대한 숫자
    },
    {
      "type": "Text",
      "role": "Label",
      "content": "Revenue",
      "prominence": "Tertiary"  // 작은 라벨
    },
    {
      "type": "Text",
      "role": "Caption",
      "content": "+12.5%",
      "prominence": "Tertiary",  // 작은 변화량
      "intent": "Positive"
    }
  ]
}
```

**포인트**: 대시보드에서는 **숫자가 Hero**, 라벨은 Tertiary입니다.

</details>

---

## 흔한 실수

### 실수 1: 모든 것을 Primary로

```json
// ❌ Wrong: 모두 같은 강조 → 계층 없음
{
  "children": [
    { "prominence": "Primary" },
    { "prominence": "Primary" },
    { "prominence": "Primary" }
  ]
}

// ✅ Correct: 계층 있음
{
  "children": [
    { "prominence": "Primary" },
    { "prominence": "Secondary" },
    { "prominence": "Tertiary" }
  ]
}
```

### 실수 2: Hero 남발

```json
// ❌ Wrong: 페이지 안에 Hero가 5개
{ "prominence": "Hero" }  // 제목
{ "prominence": "Hero" }  // 검색
{ "prominence": "Hero" }  // 버튼
// → 모두 거대함 → 혼란

// ✅ Correct: Hero는 딱 1개
{ "prominence": "Hero" }      // 페이지 제목만
{ "prominence": "Primary" }   // 나머지는 Primary
{ "prominence": "Primary" }
```

### 실수 3: Intent와 Prominence 혼동

```json
// ❌ Wrong: "위험하니까 Hero로?"
{
  "type": "Action",
  "label": "Delete",
  "prominence": "Hero",  // ← 거대한 삭제 버튼???
  "intent": "Critical"
}

// ✅ Correct: "위험하지만 보조 액션"
{
  "type": "Action",
  "label": "Delete",
  "prominence": "Secondary",  // 작게
  "intent": "Critical"  // 빨간색
}
```

---

## 핵심 정리

### Prominence 선택 가이드

```
Hero → 페이지당 1개만, 거대한 제목/CTA
Primary → 주요 콘텐츠, 기본 버튼 (기본값)
Secondary → 보조 정보, Cancel 버튼
Tertiary → 메타 정보, 아이콘 버튼, 링크
```

### 기억할 3가지 원칙

1. **페이지당 Hero는 1개**
2. **부모 ≥ 자식** (역전 금지)
3. **Prominence ≠ 중요도** (시각적 무게감일 뿐)

---

## 다음 단계

Prominence를 완전히 이해했습니다!
이제 **색상과 맥락**을 정의하는 Intent를 배워봅시다.

**다음**: [Intent 시스템 →](./02-intent.md)

**관련 문서**:
- [Density 시스템](./03-density.md) - 간격 조절하기
- [속성 조합하기](./05-combining-properties.md) - 4가지 속성 함께 쓰기
- [실전: 대시보드 만들기](../04-patterns/04-dashboard.md)

---

**이전**: [← IDDL의 핵심 아이디어](../00-getting-started/02-core-idea.md)
**다음**: [Intent 시스템 →](./02-intent.md)
