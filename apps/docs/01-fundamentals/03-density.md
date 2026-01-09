# Density 시스템 완전 정복 📐

**예상 소요 시간**: 10분
**난이도**: ⭐⭐ 기초
**사전 지식**: [Intent 시스템](./02-intent.md)

---

## 이 문서를 읽고 나면

- Density의 3가지 레벨을 이해합니다
- 언제 어떤 밀도를 써야 할지 판단할 수 있습니다
- 정보 소비 패턴에 맞는 UI를 만들 수 있습니다

---

## Density란?

> **"얼마나 빽빽하게 보여줄 것인가?"** - 공간 밀도

Density는 **정보 소비 방식(Scanning Pattern)**과 **공간 활용(Spacing)**을 정의합니다.
같은 콘텐츠도 밀도에 따라 전혀 다른 느낌을 줍니다.

---

## 3가지 레벨

### Comfortable - 넓은 여백

**의미**: "여유롭게, 편안하게, 시선을 끌어야 함"

**간격**: 16px-24px 내부 여백, 24px-32px 외부 여백

**사용 시나리오**:
- 마케팅 페이지
- 대시보드 요약 뷰
- 온보딩 화면
- 프레젠테이션 모드

**특징**:
- 큰 터치 영역 (모바일 친화적)
- 큰 타이포그래피
- 스캔보다 **읽기** 중심

```json
{
  "type": "Group",
  "role": "Card",
  "density": "Comfortable",
  "children": [...]
}
```

**렌더링 예시**:
```
┌─────────────────────────────┐
│                             │  ← 넓은 여백
│   Welcome to Dashboard      │
│                             │
│   View your stats below     │
│                             │
│   [ Get Started ]           │
│                             │  ← 넓은 여백
└─────────────────────────────┘
```

---

### Standard - 표준 간격 (기본값)

**의미**: "일반적인 읽기, 균형 잡힌 밀도"

**간격**: 12px-16px 내부 여백, 16px-20px 외부 여백

**사용 시나리오**:
- 일반 문서
- 폼 입력
- 설정 페이지
- 콘텐츠 관리

**특징**:
- 읽기 편한 밀도
- 스크롤 최소화
- 대부분의 UI에 적합

```json
{
  "type": "Group",
  "role": "Form",
  "density": "Standard",  // 생략 가능 (기본값)
  "children": [...]
}
```

**렌더링 예시**:
```
┌──────────────────────┐
│                      │
│  Profile Settings    │
│                      │
│  Name:  [_________]  │
│  Email: [_________]  │
│                      │
│  [Save]              │
│                      │
└──────────────────────┘
```

---

### Compact - 좁은 간격

**의미**: "정보 밀도 최대화, 빠른 스캔"

**간격**: 4px-8px 내부 여백, 8px-12px 외부 여백

**사용 시나리오**:
- 데이터 그리드/테이블
- 전문가용 도구
- 리스트 뷰 (많은 항목)
- 대시보드 위젯

**특징**:
- 최대 정보량
- 빠른 스캔 가능
- 읽기보다 **검색** 중심

```json
{
  "type": "Group",
  "role": "Table",
  "density": "Compact",
  "children": [...]
}
```

**렌더링 예시**:
```
┌────┬────────┬────────┬────────┐
│ ID │ Name   │ Email  │ Status │  ← 작은 간격
├────┼────────┼────────┼────────┤
│001 │Teo     │teo@... │Active  │
│002 │Jane    │jane@...│Pending │
│003 │Bob     │bob@... │Active  │
└────┴────────┴────────┴────────┘
```

---

## 밀도 비교표

| Density | 내부 여백 | 외부 여백 | 사용 사례 | 정보량 |
|---------|----------|----------|----------|--------|
| **Comfortable** | 16-24px | 24-32px | 마케팅, 대시보드 | 적음 |
| **Standard** | 12-16px | 16-20px | 폼, 문서 | 중간 |
| **Compact** | 4-8px | 8-12px | 테이블, 그리드 | 많음 |

---

## 사용 시나리오별 가이드

### Comfortable 사용 케이스

```json
// 1. 마케팅 히어로 섹션
{
  "type": "Section",
  "role": "Container",
  "density": "Comfortable",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Transform Your Workflow",
      "prominence": "Hero"
    },
    {
      "type": "Action",
      "label": "Start Free Trial",
      "prominence": "Hero",
      "intent": "Brand"
    }
  ]
}

// 2. 대시보드 통계 카드
{
  "type": "Group",
  "role": "Grid",
  "density": "Comfortable",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "children": [
        { "type": "Field", "model": "stats.revenue", "prominence": "Hero" },
        { "type": "Text", "content": "Revenue" }
      ]
    }
  ]
}
```

### Standard 사용 케이스

```json
// 1. 프로필 편집 폼
{
  "type": "Group",
  "role": "Form",
  "density": "Standard",
  "children": [
    { "type": "Field", "label": "Name", "model": "user.name" },
    { "type": "Field", "label": "Email", "model": "user.email" },
    { "type": "Action", "label": "Save" }
  ]
}

// 2. 설정 페이지
{
  "type": "Section",
  "role": "Container",
  "density": "Standard",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "children": [
        { "type": "Text", "content": "Notifications" },
        { "type": "Field", "label": "Email", "dataType": "boolean" }
      ]
    }
  ]
}
```

### Compact 사용 케이스

```json
// 1. 데이터 테이블
{
  "type": "Group",
  "role": "Table",
  "density": "Compact",
  "children": [
    { "type": "Field", "label": "ID", "model": "item.id" },
    { "type": "Field", "label": "Name", "model": "item.name" },
    { "type": "Field", "label": "Status", "model": "item.status" }
  ]
}

// 2. 사이드바 네비게이션
{
  "type": "Section",
  "role": "Navigator",
  "density": "Compact",
  "children": [
    {
      "type": "Group",
      "role": "List",
      "children": [
        { "type": "Action", "label": "Dashboard", "to": "/" },
        { "type": "Action", "label": "Users", "to": "/users" },
        { "type": "Action", "label": "Settings", "to": "/settings" }
      ]
    }
  ]
}
```

---

## Density 상속 규칙

Density는 **부모에서 자식으로 전파**됩니다:

```json
{
  "type": "Section",
  "density": "Comfortable",  // 전체 섹션
  "children": [
    {
      "type": "Group",
      "role": "Card",
      // density 생략 → Comfortable 상속
      "children": [...]
    },
    {
      "type": "Group",
      "role": "Form",
      "density": "Standard",  // 오버라이드
      "children": [...]
    }
  ]
}
```

---

## 실습 1: 밀도 판단하기

다음 UI의 적절한 Density를 선택하세요:

**A) 랜딩 페이지 히어로**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━
Welcome to Our Platform
Start your journey today
[Get Started for Free]
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**B) 사용자 목록 (1000명)**
```
┌─────────────────────────┐
│ ID   Name     Email     │
│ 001  Teo      teo@...   │
│ 002  Jane     jane@...  │
│ ... (998 more)          │
└─────────────────────────┘
```

**C) 프로필 편집 폼**
```
┌─────────────────┐
│ Edit Profile    │
│ Name:  [____]   │
│ Email: [____]   │
│ [Save]          │
└─────────────────┘
```

<details>
<summary>정답 보기</summary>

**A) Comfortable** - 마케팅, 시선 집중
```json
{
  "type": "Section",
  "density": "Comfortable"
}
```

**B) Compact** - 대량 데이터, 빠른 스캔
```json
{
  "type": "Group",
  "role": "Table",
  "density": "Compact"
}
```

**C) Standard** - 일반 폼, 읽기 편함
```json
{
  "type": "Group",
  "role": "Form",
  "density": "Standard"
}
```

</details>

---

## 실습 2: 대시보드 레이아웃

대시보드를 두 영역으로 나누세요:
- 상단: 통계 요약 카드 (큼직큼직)
- 하단: 최근 활동 테이블 (촘촘)

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Page",
  "title": "Dashboard",
  "children": [
    {
      "type": "Section",
      "role": "Container",
      "children": [
        // 상단: 통계 요약
        {
          "type": "Group",
          "role": "Grid",
          "density": "Comfortable",  // 넓게
          "children": [
            {
              "type": "Group",
              "role": "Card",
              "children": [
                {
                  "type": "Field",
                  "model": "stats.revenue",
                  "dataType": "currency",
                  "prominence": "Hero"
                },
                {
                  "type": "Text",
                  "content": "Revenue",
                  "prominence": "Tertiary"
                }
              ]
            }
          ]
        },

        // 하단: 최근 활동
        {
          "type": "Group",
          "role": "Table",
          "density": "Compact",  // 촘촘하게
          "children": [
            { "type": "Field", "label": "User", "model": "activity.user" },
            { "type": "Field", "label": "Action", "model": "activity.action" },
            { "type": "Field", "label": "Time", "model": "activity.time" }
          ]
        }
      ]
    }
  ]
}
```

**포인트**: 같은 페이지 안에서도 영역별로 다른 밀도를 사용할 수 있습니다.

</details>

---

## 흔한 실수

### 실수 1: 모든 곳에 Comfortable

```json
// ❌ Wrong: 테이블인데 Comfortable
{
  "type": "Group",
  "role": "Table",
  "density": "Comfortable"  // ← 테이블엔 Compact가 적합
}
// → 스크롤 지옥

// ✅ Correct
{
  "type": "Group",
  "role": "Table",
  "density": "Compact"
}
```

### 실수 2: 밀도 무시

```json
// ❌ Wrong: density 아예 안 씀
{
  "type": "Section"
  // → 모두 Standard (기본값)
}

// ✅ Correct: 의도적으로 선택
{
  "type": "Section",
  "density": "Comfortable"  // 마케팅 섹션이니 넓게
}
```

### 실수 3: 역할과 밀도 불일치

```json
// ❌ Wrong: 히어로 섹션인데 Compact
{
  "type": "Section",
  "density": "Compact",  // ← 히어로에 Compact???
  "children": [
    {
      "type": "Text",
      "prominence": "Hero",
      "content": "Welcome"
    }
  ]
}

// ✅ Correct: 히어로는 Comfortable
{
  "type": "Section",
  "density": "Comfortable",
  "children": [...]
}
```

---

## Density와 다른 속성 조합

### Density + Prominence

```json
// Hero + Comfortable = 거대한 타이틀 with 넓은 여백
{
  "prominence": "Hero",
  "density": "Comfortable"
}

// Tertiary + Compact = 작은 텍스트 with 좁은 간격
{
  "prominence": "Tertiary",
  "density": "Compact"
}
```

### Density + Role

```json
// Card + Comfortable = 큰 여유 있는 카드
{
  "role": "Card",
  "density": "Comfortable"
}

// Table + Compact = 촘촘한 데이터 그리드
{
  "role": "Table",
  "density": "Compact"
}

// Form + Standard = 일반 폼 (기본값)
{
  "role": "Form",
  "density": "Standard"
}
```

---

## 반응형 고려사항

모바일에서는 자동으로 밀도가 조정될 수 있습니다:

```json
{
  "density": "Compact"
}
```

**데스크톱**: 4px 여백
**모바일**: 8px 여백 (터치 영역 확보)

---

## 핵심 정리

### Density 선택 가이드

```
Comfortable → 마케팅, 대시보드, 온보딩
Standard → 폼, 설정, 문서 (기본값)
Compact → 테이블, 그리드, 사이드바
```

### 판단 기준

1. **정보량**: 많으면 Compact, 적으면 Comfortable
2. **사용 패턴**: 스캔이면 Compact, 읽기면 Comfortable
3. **화면 크기**: 작으면 Compact, 크면 Comfortable

### 기억할 공식

```
정보 많음 + 빠른 스캔 = Compact
일반적 읽기 + 균형 = Standard
시선 집중 + 여유 = Comfortable
```

---

## 다음 단계

Density까지 완벽히 이해했습니다!
이제 마지막 속성인 **Role**을 배워봅시다.

**다음**: [Role 시스템 →](./04-role.md)

**관련 문서**:
- [속성 조합하기](./05-combining-properties.md) - 4가지 속성 함께 쓰기
- [실전: 대시보드](../04-patterns/04-dashboard.md)
- [실전: 데이터 테이블](../04-patterns/01-crud-list.md)

---

**이전**: [← Intent 시스템](./02-intent.md)
**다음**: [Role 시스템 →](./04-role.md)
