# Density System

> **"정보 간격은 어떻게 할 것인가?"** - Spatial Hierarchy를 정의합니다

---

## 개요

**Density**는 UI의 **공간 밀도(Spatial Hierarchy)**를 정의하는 속성입니다. 정보 간의 간격, 패딩, 여백을 조절하여 용도에 맞는 최적의 레이아웃을 제공합니다.

---

## Density 레벨

| Level | 설명 | 특징 | 사용 예시 |
|-------|------|------|-----------|
| **Comfortable** | 넓은 여백 | 시원하고 읽기 편함 | 랜딩 페이지, 마케팅 사이트, 대시보드 요약 |
| **Standard** | 표준 여백 | 균형잡힌 밀도 | 문서, 블로그, 일반적인 애플리케이션 |
| **Compact** | 좁은 여백 | 정보 밀집 | 데이터 테이블, 관리 도구, 전문가용 인터페이스 |

---

## 간격 값 정의

### Comfortable
```
padding: 24px (1.5rem)
gap: 16px (1rem)
line-height: 1.75
min-height: 48px (버튼/입력)
```

**특징:**
- 시각적 여유가 있어 스캔하기 쉬움
- 터치 타겟이 크고 명확
- 모바일 친화적

**사용 케이스:**
```json
{
  "type": "Section",
  "role": "Container",
  "density": "Comfortable",
  "children": [
    { "role": "Identity", "prominence": "Hero", "label": "Welcome" },
    { "role": "Content", "label": "Get started with our platform" }
  ]
}
```

---

### Standard (기본값)
```
padding: 16px (1rem)
gap: 12px (0.75rem)
line-height: 1.5
min-height: 40px (버튼/입력)
```

**특징:**
- 가장 보편적인 밀도
- 정보와 공간의 균형
- 대부분의 애플리케이션에 적합

**사용 케이스:**
```json
{
  "type": "Section",
  "role": "Form",
  "density": "Standard",
  "children": [
    { "role": "Identity", "label": "Sign In" },
    { "role": "Control", "label": "Email" },
    { "role": "Control", "label": "Password" }
  ]
}
```

---

### Compact
```
padding: 8px (0.5rem)
gap: 8px (0.5rem)
line-height: 1.4
min-height: 32px (버튼/입력)
```

**특징:**
- 많은 정보를 한 화면에 표시
- 전문가/파워 유저용
- 빠른 스캔과 비교에 유리

**사용 케이스:**
```json
{
  "type": "Section",
  "role": "Collection",
  "density": "Compact",
  "children": [
    { "role": "Content", "label": "Row 1: Data..." },
    { "role": "Content", "label": "Row 2: Data..." },
    { "role": "Content", "label": "Row 3: Data..." }
  ]
}
```

---

## 상속 규칙

Density는 **부모에서 자식으로 상속**됩니다:

```json
{
  "type": "Section",
  "density": "Comfortable",  // 전체 섹션은 Comfortable
  "children": [
    {
      "type": "Group",
      "role": "Collection",
      "density": "Compact",    // 이 그룹만 Compact 오버라이드
      "children": [
        { "role": "Content", "label": "Item 1" }
      ]
    }
  ]
}
```

---

## Role별 권장 Density

### Navigator
- **권장**: Compact
- **이유**: 메뉴 항목이 많을수록 빠른 스캔이 중요

```json
{
  "type": "Group",
  "role": "Navigator",
  "density": "Compact",
  "children": [...]
}
```

### Collection (데이터 테이블)
- **권장**: Compact
- **이유**: 많은 데이터를 한 화면에 표시

```json
{
  "type": "Group",
  "role": "Collection",
  "density": "Compact",
  "children": [...]
}
```

### Form
- **권장**: Standard
- **이유**: 입력 정확성과 가독성의 균형

```json
{
  "type": "Group",
  "role": "Form",
  "density": "Standard",
  "children": [...]
}
```

### Container (마케팅)
- **권장**: Comfortable
- **이유**: 시각적 여유가 신뢰감 제공

```json
{
  "type": "Section",
  "role": "Container",
  "density": "Comfortable",
  "children": [...]
}
```

---

## 반응형 Density

화면 크기에 따라 Density를 조정할 수 있습니다:

```typescript
// 의사 코드
const density = {
  mobile: 'Comfortable',   // 터치 타겟 우선
  tablet: 'Standard',      // 균형
  desktop: 'Compact'       // 정보 밀도 우선
}
```

---

## 접근성 고려사항

### 터치 타겟 크기
- **Comfortable**: 48px (권장)
- **Standard**: 40px (최소 기준)
- **Compact**: 32px (마우스 전용)

### 읽기 편의성
- **Comfortable**: line-height 1.75 (읽기 편함)
- **Standard**: line-height 1.5 (표준)
- **Compact**: line-height 1.4 (정보 우선)

---

## 실전 예시

### 대시보드 (혼합 Density)
```json
{
  "type": "Section",
  "density": "Comfortable",  // 전체적으로 시원하게
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "role": "Identity", "prominence": "Hero", "label": "Dashboard" }
      ]
    },
    {
      "type": "Group",
      "role": "Collection",
      "density": "Compact",  // 데이터 테이블만 Compact
      "children": [
        { "role": "Content", "label": "User: Teo" },
        { "role": "Content", "label": "Status: Active" }
      ]
    }
  ]
}
```

---

## 디자인 결정 매트릭스

| Density | Padding | Gap | Line Height | Min Touch Target | 사용 맥락 |
|---------|---------|-----|-------------|------------------|----------|
| Comfortable | 24px | 16px | 1.75 | 48px | 마케팅, 랜딩 |
| Standard | 16px | 12px | 1.5 | 40px | 일반 앱 |
| Compact | 8px | 8px | 1.4 | 32px | 데이터 중심 |

---

## 원칙

1. **기본값은 Standard**: 명시하지 않으면 Standard 적용
2. **상속 활용**: 섹션 레벨에서 정의하고 자식이 상속
3. **맥락에 맞게**: 데이터는 Compact, 마케팅은 Comfortable
4. **일관성 유지**: 같은 화면에서 너무 많은 Density 변경 지양

---

## 다음 단계

Density와 함께 다른 속성들을 조합하여 완전한 UI를 표현합니다:

- **Role**: 이것은 무엇인가?
- **Prominence**: 얼마나 눈에 띄어야 하는가?
- **Intent**: 어떤 맥락(색상)인가?
