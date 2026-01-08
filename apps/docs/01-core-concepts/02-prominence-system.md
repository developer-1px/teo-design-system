# Prominence System

> **"얼마나 눈에 띄어야 하는가?"** - Visual Hierarchy를 정의합니다

---

## 개요

**Prominence**는 UI 요소의 **시각적 주목도(Visual Hierarchy)**를 정의하는 속성입니다. 4단계의 prominence 레벨을 통해 정보의 중요도를 명확하게 표현합니다.

---

## Prominence 레벨

| Level | 설명 | 시각적 특징 | 사용 예시 |
|-------|------|-------------|-----------|
| **Hero** | 최상위 강조 | 거대한 크기, 굵은 폰트 | 랜딩 페이지 타이틀, 메인 CTA |
| **Primary** | 주요 (기본값) | 표준 크기, 읽기 좋은 폰트 | 본문 제목, 주요 버튼 |
| **Secondary** | 보조 | 작은 크기, 흐린 색상 | 서브타이틀, 보조 버튼 |
| **Tertiary** | 미약 | 최소 크기, 매우 흐림 | 메타 정보, 캡션, 비활성 요소 |

---

## 타이포그래피 적용

### Hero
```
font-size: 48px (3rem)
font-weight: 700 (Bold)
line-height: 1.2
letter-spacing: -0.02em
```

### Primary (Default)
```
font-size: 16px (1rem)
font-weight: 500 (Medium)
line-height: 1.5
letter-spacing: normal
```

### Secondary
```
font-size: 14px (0.875rem)
font-weight: 400 (Regular)
line-height: 1.5
color: text-secondary (60% opacity)
```

### Tertiary
```
font-size: 12px (0.75rem)
font-weight: 400 (Regular)
line-height: 1.4
color: text-tertiary (40% opacity)
```

---

## 컴포넌트별 적용

### Identity (제목)
```json
{
  "role": "Identity",
  "prominence": "Hero",
  "label": "Welcome to App"
}
```
→ 거대한 페이지 타이틀로 렌더링

### Content (본문)
```json
{
  "role": "Content",
  "prominence": "Primary",
  "label": "This is the main description"
}
```
→ 표준 본문 텍스트로 렌더링

### Facet (메타 정보)
```json
{
  "role": "Facet",
  "prominence": "Tertiary",
  "label": "Last updated: 2 hours ago"
}
```
→ 작고 흐린 메타 텍스트로 렌더링

### Control (버튼)
```json
{
  "role": "Control",
  "prominence": "Primary",
  "intent": "Brand",
  "label": "Get Started"
}
```
→ 브랜드 색상의 주요 버튼으로 렌더링

---

## 계층 구조 원칙

### 1. 페이지당 Hero는 최대 1개
```
✅ Correct:
Hero: "User Dashboard" (페이지 타이틀)
Primary: "Recent Activity" (섹션 제목)
Secondary: "View all →" (링크)

❌ Wrong:
Hero: "User Dashboard"
Hero: "Recent Activity" (너무 많은 Hero)
```

### 2. 부모-자식 관계
```
Hero > Primary > Secondary > Tertiary

자식은 항상 부모보다 낮거나 같은 prominence를 가짐
```

### 3. 기본값은 Primary
```json
{
  "role": "Content",
  // prominence 생략 시 자동으로 Primary
  "label": "Standard text"
}
```

---

## Intent와의 조합

Prominence는 Intent(색상)와 독립적으로 작동합니다:

```json
// 큰 위험 버튼
{
  "role": "Control",
  "prominence": "Hero",
  "intent": "Danger",
  "label": "Delete Everything"
}

// 작은 성공 알림
{
  "role": "Status",
  "prominence": "Tertiary",
  "intent": "Success",
  "label": "Saved"
}
```

---

## 디자인 결정 매트릭스

| Prominence | Font Size | Font Weight | Color Opacity | 사용 빈도 |
|------------|-----------|-------------|---------------|----------|
| Hero | 3rem (48px) | 700 | 100% | 페이지당 1개 |
| Primary | 1rem (16px) | 500 | 100% | 주요 요소 |
| Secondary | 0.875rem (14px) | 400 | 60% | 보조 요소 |
| Tertiary | 0.75rem (12px) | 400 | 40% | 메타 정보 |

---

## 접근성 고려사항

### Contrast Ratio
- Hero/Primary: 최소 4.5:1 (WCAG AA)
- Secondary: 최소 3:1 (Large Text)
- Tertiary: 최소 3:1 (보조 정보는 예외 허용)

### Font Size
- 최소 12px 유지 (Tertiary)
- 본문은 16px 권장 (Primary)

---

## 실전 예시

### 프로필 카드
```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    { "role": "Identity", "prominence": "Primary", "label": "Teo" },
    { "role": "Facet", "prominence": "Secondary", "label": "Senior Frontend Dev" },
    { "role": "Facet", "prominence": "Tertiary", "label": "Seoul, KR" }
  ]
}
```

### 알림 메시지
```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    { "role": "Identity", "prominence": "Secondary", "label": "Success" },
    { "role": "Content", "prominence": "Tertiary", "label": "Your changes have been saved" }
  ]
}
```

---

## 다음 단계

Prominence와 함께 다른 속성들을 조합하여 완전한 UI를 표현합니다:

- **Role**: 이것은 무엇인가?
- **Density**: 정보 간격은 어떻게 할 것인가?
- **Intent**: 어떤 맥락(색상)인가?
