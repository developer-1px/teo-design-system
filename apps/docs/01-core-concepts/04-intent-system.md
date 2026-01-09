# Intent System

> **"어떤 맥락(색상)인가?"** - Semantic Color를 정의합니다

---

## 개요

**Intent**는 UI 요소의 **의미론적 맥락(Semantic Context)**을 색상으로 표현하는 속성입니다. 사용자에게 시각적 단서를 제공하여 UI의 상태나 의도를 즉시 이해할 수 있게 합니다.

---

## Intent 레벨

| Intent | 색상 | 의미 | 사용 예시 |
|--------|------|------|-----------|
| **Neutral** | Gray/Black | 기본, 중립 | 일반 텍스트, 기본 버튼 |
| **Brand** | Primary Color | 브랜드, 주요 액션 | CTA 버튼, 강조 요소 |
| **Positive** | Green | 성공, 긍정, 완료 | 성공 메시지, 완료 상태 |
| **Caution** | Yellow/Orange | 주의, 경고 | 경고 메시지, 주의 필요 |
| **Critical** | Red | 위험, 오류, 파괴 | 삭제 버튼, 에러 메시지 |
| **Info** | Blue | 참고 정보, 도움말 | 툴팁, 안내 메시지 |

---

## 색상 팔레트

### Neutral (기본값)
```css
text: #1a1a1a (dark mode: #ffffff)
background: transparent
border: #e5e5e5
```

**사용:**
- 기본 텍스트
- 보조 버튼
- 일반 컨테이너

---

### Brand
```css
text: #ffffff
background: #3b82f6 (Blue) 또는 브랜드 색상
hover: #2563eb
active: #1d4ed8
```

**사용:**
- 주요 CTA (Call-to-Action)
- 브랜드 강조 요소
- 주목도가 높은 링크

---

### Positive
```css
text: #ffffff
background: #10b981 (Green)
hover: #059669
active: #047857
```

**사용:**
- 성공 알림
- 완료 상태
- 긍정적 피드백

---

### Caution
```css
text: #000000
background: #f59e0b (Orange)
hover: #d97706
active: #b45309
```

**사용:**
- 경고 메시지
- 주의가 필요한 상태
- 되돌릴 수 있는 위험 액션

---

### Critical
```css
text: #ffffff
background: #ef4444 (Red)
hover: #dc2626
active: #b91c1c
```

**사용:**
- 삭제 버튼
- 에러 메시지
- 되돌릴 수 없는 파괴적 액션

---

### Info
```css
text: #ffffff
background: #3b82f6 (Blue)
hover: #2563eb
active: #1d4ed8
```

**사용:**
- 도움말 툴팁
- 안내 메시지
- 정보 알림

---

## Role별 Intent 적용

### Control (버튼)
```json
// 주요 액션
{ "role": "Control", "intent": "Brand", "label": "Get Started" }

// 파괴적 액션
{ "role": "Control", "intent": "Critical", "label": "Delete" }

// 중립 액션
{ "role": "Control", "intent": "Neutral", "label": "Cancel" }
```

### Status (상태 표시)
```json
// 성공 상태
{ "role": "Status", "intent": "Positive", "label": "Active" }

// 경고 상태
{ "role": "Status", "intent": "Caution", "label": "Pending" }

// 오류 상태
{ "role": "Status", "intent": "Critical", "label": "Failed" }
```

### Overlay (알림)
```json
// 성공 토스트
{
  "type": "Overlay",
  "role": "Toast",
  "intent": "Positive",
  "children": [
    { "role": "Identity", "label": "Success" },
    { "role": "Content", "label": "Your changes have been saved" }
  ]
}
```

---

## Prominence와의 조합

Intent는 Prominence와 독립적으로 작동합니다:

```json
// 거대한 위험 버튼
{
  "role": "Control",
  "prominence": "Hero",
  "intent": "Danger",
  "label": "Delete All Data"
}

// 작은 브랜드 버튼
{
  "role": "Control",
  "prominence": "Tertiary",
  "intent": "Brand",
  "label": "Learn more"
}
```

---

## 사용 원칙

### 1. 의미론적 사용
```
✅ Correct:
- Positive: 성공적인 완료 상태
- Critical: 삭제, 파괴적 액션

❌ Wrong:
- Positive: 단순히 녹색이 필요해서
- Critical: 단순히 빨간색이 필요해서
```

### 2. Intent 사용 빈도
```
페이지당 권장 사용량:
- Neutral: 무제한 (기본)
- Brand: 1-2개 (주요 CTA)
- Positive/Caution/Critical/Info: 필요시에만
```

### 3. 대비되는 Intent 사용
```json
// 위험한 액션 확인 모달
{
  "type": "Overlay",
  "role": "Dialog",
  "children": [
    {
      "type": "Group",
      "role": "Toolbar",
      "children": [
        { "role": "Control", "intent": "Neutral", "label": "Cancel" },
        { "role": "Control", "intent": "Critical", "label": "Delete" }
      ]
    }
  ]
}
```

---

## 접근성 고려사항

### Color Contrast
모든 Intent는 WCAG AA 기준(4.5:1)을 만족해야 합니다:

| Intent | Background | Text | Contrast Ratio |
|--------|------------|------|----------------|
| Neutral | #ffffff | #1a1a1a | 12.6:1 ✅ |
| Brand | #3b82f6 | #ffffff | 8.6:1 ✅ |
| Success | #10b981 | #ffffff | 4.5:1 ✅ |
| Warning | #f59e0b | #000000 | 10.4:1 ✅ |
| Danger | #ef4444 | #ffffff | 5.2:1 ✅ |

### 색맹 고려
Intent는 색상만으로 의미를 전달하지 않습니다:

```json
{
  "role": "Status",
  "intent": "Positive",
  "icon": "CheckCircle",  // 시각적 아이콘 추가
  "label": "Completed"    // 명확한 텍스트
}
```

---

## 실전 예시

### 폼 제출
```json
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    { "role": "Control", "intent": "Neutral", "label": "Cancel" },
    { "role": "Control", "intent": "Brand", "label": "Save" }
  ]
}
```

### 상태 표시
```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    { "role": "Status", "intent": "Positive", "label": "✓ 5 completed" },
    { "role": "Status", "intent": "Caution", "label": "⚠ 2 pending" },
    { "role": "Status", "intent": "Critical", "label": "✕ 1 failed" }
  ]
}
```

### 삭제 확인 모달
```json
{
  "type": "Overlay",
  "role": "Dialog",
  "placement": "center",
  "children": [
    {
      "type": "Group",
      "role": "Form",
      "children": [
        {
          "role": "Identity",
          "prominence": "Primary",
          "label": "Delete User?"
        },
        {
          "role": "Content",
          "prominence": "Secondary",
          "intent": "Critical",
          "label": "This action cannot be undone"
        },
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { "role": "Control", "intent": "Neutral", "label": "Cancel" },
            { "role": "Control", "intent": "Critical", "label": "Delete" }
          ]
        }
      ]
    }
  ]
}
```

---

## 디자인 결정 매트릭스

| Intent | 사용 맥락 | 색상 | 사용 빈도 | 중요도 |
|--------|----------|------|----------|--------|
| Neutral | 기본, 중립 | Gray | 무제한 | 낮음 |
| Brand | 주요 액션, 강조 | Primary | 1-2개 | 높음 |
| Positive | 성공, 완료, 긍정 | Green | 필요시 | 중간 |
| Caution | 주의, 경고, 대기 | Orange | 필요시 | 중간 |
| Critical | 위험, 에러, 파괴 | Red | 필요시 | 높음 |
| Info | 참고, 도움말 | Blue | 필요시 | 낮음 |

---

## Dark Mode 지원

Intent 색상은 Dark Mode에서 자동으로 조정됩니다:

```css
/* Light Mode */
--intent-brand: #3b82f6;
--intent-positive: #10b981;
--intent-caution: #f59e0b;
--intent-critical: #ef4444;
--intent-info: #3b82f6;

/* Dark Mode */
--intent-brand: #60a5fa;      /* 밝은 Blue */
--intent-positive: #34d399;   /* 밝은 Green */
--intent-caution: #fbbf24;    /* 밝은 Orange */
--intent-critical: #f87171;   /* 밝은 Red */
--intent-info: #60a5fa;       /* 밝은 Blue */
```

---

## 원칙

1. **의미 우선**: 색상은 의미를 전달하는 도구
2. **절제 사용**: 너무 많은 색상은 혼란
3. **일관성**: 같은 Intent는 항상 같은 의미
4. **접근성**: 색상만으로 의미 전달 금지

---

## 다음 단계

Intent와 함께 다른 속성들을 조합하여 완전한 UI를 표현합니다:

- **Role**: 이것은 무엇인가?
- **Prominence**: 얼마나 눈에 띄어야 하는가?
- **Density**: 정보 간격은 어떻게 할 것인가?
