# Minimal Renderer Design Guide

**For:** IDDL 1.0.1 Renderer Implementation  
**Version:** 1.0.1

---

## 0. Purpose

> **"위계, 역할, 목적, 주목도를 명확히 전달한다."**

디자인 요소를 최소화하는 것은 **목적이 아니라 수단**이다.

### 0.1. Why Minimize?

불필요한 디자인 요소는 시선을 뺏는다. 시선이 분산되면 위계/역할/목적/주목도 전달이 흐려진다.

```
Primary Action에 시선이 가야 한다
  ↓
나머지가 조용해야 한다
  ↓
나머지의 디자인 요소를 줄인다
```

**최소화 자체가 목표가 아니다.** 목적 달성에 필요하면 디자인 요소를 쓴다.

### 0.2. Essential Elements of Minimal

Minimal이라고 해서 "아무것도 안 쓴다"가 아니다. **다음 4가지는 필수다:**

| 요소 | 이유 | 없으면? |
|------|------|--------|
| **아이콘 중심** | 공간 효율, 빠른 인식 | 텍스트가 공간 차지, 스캔 느림 |
| **라운드** | 시선이 흐르게 | 각지면 시선이 멈춤 |
| **여백 (패딩)** | 숨 쉴 공간 | 답답함 → 시선 끔 |
| **적은 토큰 종류** | 일관성, 노이즈 감소 | 산만함 → 위계 불명확 |

**패딩이 없으면:**
```
┌──────────────┐      ┌──────────────┐
│Text          │  vs  │   Text       │
└──────────────┘      └──────────────┘
  답답함 → 시선 감        여유 → 내용에 집중
```

**라운드가 없으면:**
```
┌──────────────┐      ╭──────────────╮
│              │  vs  │              │
└──────────────┘      ╰──────────────╯
  시선이 꺾임            시선이 흐름
```

### 0.3. Decision Framework

모든 디자인 결정에서 묻는다:

```
1. 이 요소가 위계/역할/목적/주목도 전달에 기여하는가?
   - Yes → 쓴다
   - No → 쓰지 않는다

2. 이 요소가 다른 곳의 주목도를 방해하는가?
   - Yes → 약하게 쓰거나 빼거나
   - No → 유지
```

### 0.4. Token Economy

디자인 토큰 종류를 최소화한다:

| Category | 허용 개수 | 이유 |
|----------|----------|------|
| 간격 (space) | 5단계 | 관계 표현에 충분 |
| 폰트 크기 | 3단계 | 위계 표현에 충분 |
| 폰트 굵기 | 2단계 | 강조 구분에 충분 |
| 면 (surface) | 4단계 | 레벨 구분에 충분 |
| 선 (border) | 2종류 | subtle, default |
| 라운드 | 3단계 | sm, md, lg |
| 그림자 | 2종류 | float, modal |
| 의미 색상 | 4종류 | brand, critical, positive, caution |

**토큰이 많아지면:**
- 선택 피로 → 일관성 저하
- 미세한 차이 → 구분 불명확
- 유지보수 어려움

---

## 1. Prominence: 주목도 표현

### 1.1. Where Attention Should Go

| IDDL Prominence | 시선이 가야 하는가? | 디자인 요소 |
|-----------------|-------------------|------------|
| Hero | ✅ 반드시 | 크기 + 굵기 + 면/색상 허용 |
| Primary | ✅ 자연스럽게 | 굵기 + 면 허용 |
| Secondary | ⚠️ 필요할 때 | 기본 스타일 |
| Tertiary | ❌ 배경으로 | 흐리게 (opacity) |

### 1.2. Action Buttons

| Prominence | 스타일 | 이유 |
|------------|--------|------|
| Hero | 배경색 (brand) + 넓은 패딩 (12px 24px) + radius | 시선이 가야 함 |
| Primary | 배경색 (surface-2) + 패딩 (8px 16px) + radius | 시선이 가야 함 |
| Secondary | 배경 없음, 패딩 (8px 16px), hover 시 surface-1 | 조용히 존재 |
| Tertiary | opacity 0.6, 아이콘만 (패딩 8px) | 거의 안 보임 |

**Primary Action에는 시선이 가야 한다 → 디자인 요소를 쓴다.**

**모든 버튼에 패딩은 필수다** — 클릭 영역 확보 + 답답함 방지.

### 1.3. Text

| Prominence | 스타일 |
|------------|--------|
| Hero | text-lg + font-medium |
| Primary | text-base + font-medium |
| Secondary | text-base + font-normal |
| Tertiary | text-sm + opacity 0.6 |

---

## 2. Hierarchy: Z-Index 표현

### 2.1. Why Shadow Exists

그림자는 **z-index / 부유(floating) 상태**를 전달한다.

| 상황 | 그림자 필요? | 이유 |
|------|------------|------|
| Modal/Dialog | ✅ | 페이지 위에 떠 있음을 표현 |
| Drawer | ✅ | 페이지 위에 떠 있음을 표현 |
| Dropdown | ✅ | 트리거 위에 떠 있음 |
| Popover | ✅ | 요소 위에 떠 있음 |
| Tooltip | ⚠️ 약하게 | 떠 있지만 작고 일시적 |
| Toast | ✅ | 페이지 위에 떠 있음 |
| Card | ❌ | 페이지와 같은 레벨 |
| Button | ❌ | 페이지와 같은 레벨 |

### 2.2. Shadow Intensity

그림자가 필요하더라도 **강하면 시선을 뺏는다**.

```css
/* Floating elements - 떠 있음을 표현하되 조용하게 */
--shadow-float: 0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);

/* Modal - 배경을 덮는 중요한 요소 */
--shadow-modal: 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08);
```

**강한 그림자 ❌** — 목적은 "떠 있음"이지 "주목"이 아니다.

### 2.3. Backdrop

Modal/Dialog는 그림자 외에 backdrop dimming으로 위계를 표현한다.

```css
--backdrop: rgba(0,0,0,0.4);
```

---

## 3. Shape: 둥근 모서리

### 3.1. Why Rounded Corners

각진 모서리는 시선을 끈다. 둥글면 시선이 흐른다.

```
각진 모서리 → 시선이 멈춤 → 불필요한 주목
둥근 모서리 → 시선이 흐름 → 내용에 집중
```

### 3.2. Radius Scale

```css
--radius-sm: 4px;   /* 작은 요소: 버튼, 인풋, 뱃지 */
--radius-md: 8px;   /* 중간 요소: 카드, 드롭다운 */
--radius-lg: 12px;  /* 큰 요소: 모달, 드로어 */
```

### 3.3. When to Use

| 요소 | Radius | 이유 |
|------|--------|------|
| Button | sm (4px) | 경계는 필요하지만 부드럽게 |
| Input | sm (4px) | 필드 경계 표시 |
| Card | md (8px) | 그룹 경계 |
| Dropdown | md (8px) | 부유 요소 |
| Modal | lg (12px) | 큰 부유 요소 |
| Tooltip | sm (4px) | 작은 부유 요소 |
| Avatar | 50% (원형) | 사람 인식 |

---

## 4. Intent: 의미 색상

### 4.1. When Color is Needed

색상은 **의미를 전달할 때** 쓴다.

| Intent | 색상 필요? | 이유 |
|--------|----------|------|
| Brand | ✅ Primary Action 구분 | 핵심 CTA에 시선 유도 |
| Critical | ✅ 위험 경고 | 실수 방지 필수 |
| Positive | ✅ 성공 확인 | 상태 인식 |
| Caution | ✅ 주의 환기 | 상태 인식 |
| Neutral | ❌ 기본 | 색상 불필요 |
| Info | ⚠️ 상황에 따라 | 위치로 구분 가능하면 불필요 |

### 4.2. Color Application

색상도 **강도 조절**이 필요하다.

| 적용 대상 | 강도 | 예시 |
|----------|------|------|
| Primary Action 배경 | 100% | 버튼 배경 brand |
| Secondary Action 텍스트 | 100% | 텍스트만 brand |
| Status badge | 10% 배경 + 100% 텍스트 | 태그, 상태 표시 |
| Error message | 텍스트만 | 필드 아래 에러 |
| Success feedback | 일시적 | 저장 완료 표시 |

### 4.3. Color Palette

```css
--color-text: rgba(0,0,0,0.85);
--color-muted: rgba(0,0,0,0.5);

--color-brand: #2563eb;
--color-brand-subtle: rgba(37,99,235,0.1);

--color-critical: #dc2626;
--color-critical-subtle: rgba(220,38,38,0.1);

--color-positive: #16a34a;
--color-positive-subtle: rgba(22,163,74,0.1);

--color-caution: #d97706;
--color-caution-subtle: rgba(217,119,6,0.1);
```

---

## 5. Space: Gap & Padding

### 5.1. Two Types of Space

| 종류 | 역할 | 없으면? |
|------|------|--------|
| **Gap (외부 간격)** | 요소 간 관계 표현 | 그룹핑 불명확 |
| **Padding (내부 여백)** | 숨 쉴 공간 확보 | 답답함 → 시선 끔 |

둘 다 필수다.

### 5.2. Gap: 관계 표현

간격으로 **관계(grouping)**를 표현한다.

```
간격 좁음 → 밀접한 관계
간격 넓음 → 분리된 관계
```

```css
--space-1: 4px;   /* 인라인 요소 내부 */
--space-2: 8px;   /* 밀접한 요소 사이 */
--space-3: 16px;  /* 그룹 내 요소 사이 */
--space-4: 24px;  /* 그룹 사이 */
--space-5: 48px;  /* 섹션 사이 */
```

### 5.3. Padding: 숨 쉴 공간

콘텐츠와 경계 사이에 **여백이 필수**다.

| 요소 | 최소 패딩 | 이유 |
|------|----------|------|
| Button | 8px 16px (세로 가로) | 클릭 영역 + 여유 |
| Input | 8px 12px | 입력 공간 확보 |
| Card | 16px | 내용과 경계 분리 |
| Modal | 24px | 충분한 여유 |
| Table cell | 8px 12px | 데이터 가독성 |
| Badge/Tag | 4px 8px | 작지만 여유 |
| Tooltip | 6px 10px | 간결하지만 여유 |

**패딩 없는 버튼:**
```
┌────────┐
│Save    │  ← 답답함, 클릭하기 불안
└────────┘
```

**패딩 있는 버튼:**
```
┌────────────┐
│   Save     │  ← 여유, 신뢰감
└────────────┘
```

### 5.4. Density Mapping

Density는 gap과 padding 모두에 영향을 준다.

| Density | Gap 배수 | Padding 배수 | 용도 |
|---------|----------|-------------|------|
| Compact | 0.66x | 0.75x | 데이터 밀집 (테이블) |
| Standard | 1x | 1x | 일반 |
| Comfortable | 1.5x | 1.25x | 여유로운 읽기 |

**Compact에서도 padding을 너무 줄이지 않는다** — 답답함 임계점이 있다.

---

## 6. Separation: 구분 표현

### 6.1. Choosing the Right Tool

구분이 필요할 때, **목적에 맞는 수단**을 선택한다.

| 상황 | 최적 수단 | 이유 |
|------|----------|------|
| 섹션 구분 (2-3개) | 간격 48px | 공간만으로 충분 |
| 폼 필드 그룹 | 간격 24px + 그룹 라벨 | 라벨이 구분 역할 |
| 목록 아이템 (많음) | 구분선 1px | 간격 반복은 노이즈 |
| 테이블 행 | 구분선 1px | 정렬된 데이터 구분 |
| 카드 그리드 | 간격 24px | 각 카드가 독립적 |
| 카드 내부 | 테두리 1px | 경계 명확화 필요 |
| 사이드바 | 테두리 1px 또는 배경색 차이 | 영역 구분 |

### 6.2. Lines

```css
--border-subtle: 1px solid rgba(0,0,0,0.08);
--border-default: 1px solid rgba(0,0,0,0.15);
```

### 6.3. Surfaces

```css
--surface-0: transparent;
--surface-1: rgba(0,0,0,0.02);  /* hover, 선택 */
--surface-2: rgba(0,0,0,0.05);  /* active, 강조 */
--surface-3: rgba(0,0,0,0.08);  /* 영역 구분 */
```

---

## 7. Icons

### 7.1. Icon-First Approach

아이콘은 **공간 효율**이 높다. 텍스트보다 작은 영역에 의미를 담는다.

| 상황 | 권장 |
|------|------|
| 반복 액션 (edit, delete, view) | 아이콘 only + tooltip |
| 단일 중요 액션 | 아이콘 + 텍스트 |
| 네비게이션 | 아이콘 only + tooltip |
| 상태 표시 | 아이콘 + 색상 |

### 7.2. Tooltip Required

아이콘만 있을 때 **tooltip은 필수**다.

```
- hover 200-300ms 후 표시
- 아이콘 근처 (위 또는 아래)
- 간결한 동사구 ("Edit", "Delete", "View details")
```

### 7.3. Icon Style

```css
--icon-size: 16px;
--icon-size-lg: 20px;

/* 아이콘은 현재 텍스트 색상 상속 */
color: currentColor;
```

- Stroke 기반 (filled 아이콘 ❌)
- 단색 (멀티컬러 ❌)
- 일관된 stroke width

---

## 8. States

### 8.1. Interactive States

| State | 표현 | 목적 |
|-------|------|------|
| Default | 기본 | — |
| Hover | surface-1 배경 또는 opacity 변화 | 상호작용 가능 표시 |
| Focus | 2px outline (brand 또는 currentColor) | 키보드 접근성 |
| Active | surface-2 배경 또는 scale 0.98 | 누름 피드백 |
| Disabled | opacity 0.4 | 사용 불가 표시 |

### 8.2. Data States

| State | 표현 | 목적 |
|-------|------|------|
| Loading | spinner 아이콘 + opacity 0.6 | 진행 중 표시 |
| Empty | 중앙 정렬 메시지 | 데이터 없음 안내 |
| Error | critical 색상 텍스트 | 문제 표시 |
| Success | positive 색상 (일시적) | 완료 확인 |

### 8.3. Transitions

상태 변화에 **미세한 transition**은 허용된다.

```css
transition: background-color 100ms, opacity 100ms, transform 100ms;
```

**단, 주목을 끄는 애니메이션은 ❌**
- 긴 duration ❌
- 바운스/탄성 효과 ❌
- 색상 전환 (배경색 변화는 OK, 텍스트 색상 변화는 ❌)

---

## 9. IDDL → Visual Mapping Summary

### 9.1. Prominence

| Value | Text | Action | Container |
|-------|------|--------|-----------|
| Hero | lg + medium | 배경 brand + 넓은 패딩 | — |
| Primary | base + medium | 배경 surface-2 | border-subtle |
| Secondary | base + normal | 배경 없음 | 간격만 |
| Tertiary | sm + muted | opacity 0.6 | — |

### 9.2. Intent

| Value | 색상 | 적용 |
|-------|------|------|
| Neutral | 무채색 | 기본 |
| Brand | --color-brand | Action 배경/텍스트 |
| Critical | --color-critical | Action 텍스트, 에러 메시지 |
| Positive | --color-positive | 성공 상태 |
| Caution | --color-caution | 경고 상태 |

### 9.3. Overlay Roles

| Role | 그림자 | Radius | Backdrop |
|------|--------|--------|----------|
| Dialog | shadow-modal | lg | Yes (0.4) |
| Drawer | shadow-float | lg (한쪽만) | Yes (0.4) |
| Popover | shadow-float | md | No |
| Dropdown | shadow-float | md | No |
| Toast | shadow-float | md | No |
| Tooltip | 약하게 또는 없음 | sm | No |

---

## 10. CSS Variables Reference

```css
:root {
  /* ===== Space (Gap) ===== */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 48px;

  /* ===== Padding ===== */
  --padding-xs: 4px 8px;     /* badge, tag */
  --padding-sm: 6px 10px;    /* tooltip */
  --padding-md: 8px 12px;    /* input, table cell */
  --padding-button: 8px 16px; /* button */
  --padding-lg: 16px;        /* card */
  --padding-xl: 24px;        /* modal, section */

  /* ===== Radius ===== */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* ===== Shadow ===== */
  --shadow-float: 0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
  --shadow-modal: 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08);

  /* ===== Surface ===== */
  --surface-0: transparent;
  --surface-1: rgba(0,0,0,0.02);
  --surface-2: rgba(0,0,0,0.05);
  --surface-3: rgba(0,0,0,0.08);

  /* ===== Border ===== */
  --border-subtle: 1px solid rgba(0,0,0,0.08);
  --border-default: 1px solid rgba(0,0,0,0.15);

  /* ===== Typography ===== */
  --text-sm: 12px;
  --text-base: 14px;
  --text-lg: 18px;
  --font-normal: 400;
  --font-medium: 500;
  --line-height: 1.5;

  /* ===== Color ===== */
  --color-text: rgba(0,0,0,0.85);
  --color-muted: rgba(0,0,0,0.5);
  
  --color-brand: #2563eb;
  --color-brand-subtle: rgba(37,99,235,0.1);
  
  --color-critical: #dc2626;
  --color-critical-subtle: rgba(220,38,38,0.1);
  
  --color-positive: #16a34a;
  --color-positive-subtle: rgba(22,163,74,0.1);
  
  --color-caution: #d97706;
  --color-caution-subtle: rgba(217,119,6,0.1);

  /* ===== Icon ===== */
  --icon-size: 16px;
  --icon-size-lg: 20px;

  /* ===== Transition ===== */
  --transition-fast: 100ms;

  /* ===== Backdrop ===== */
  --backdrop: rgba(0,0,0,0.4);
}
```

---

## 11. Audit Checklist

### 11.1. Essential Elements Check

```
□ 모든 버튼/인풋에 충분한 패딩이 있는가?
□ 카드/모달 내부에 여백이 있는가?
□ 모서리가 라운드 처리되어 있는가?
□ 아이콘에 tooltip이 있는가?
□ 토큰 종류가 정해진 개수 이내인가?
```

### 11.2. Prominence Check

```
□ Hero 요소에 시선이 먼저 가는가?
□ Primary Action이 명확히 구분되는가?
□ Tertiary 요소가 시선을 뺏지 않는가?
```

### 11.3. Hierarchy Check

```
□ Overlay가 페이지 위에 떠 보이는가? (그림자, backdrop)
□ 그림자가 너무 강해서 주목을 끌지는 않는가?
□ 모서리가 각져서 시선을 끌지는 않는가?
```

### 11.4. Intent Check

```
□ Critical Action이 위험해 보이는가?
□ 색상을 빼도 기능 구분이 되는가? (접근성)
□ 불필요한 곳에 색상이 있지는 않은가?
```

### 11.5. Noise Check

```
□ 목적 없는 디자인 요소가 있는가?
□ 반복 요소가 시각적 노이즈를 만드는가?
□ 한 화면에 경쟁하는 강조 요소가 있는가?
```

### 11.6. Breathing Room Check

```
□ 글자가 박스에 붙어있지 않은가?
□ 클릭 영역이 충분한가? (최소 32px 높이)
□ Compact 모드에서도 답답하지 않은가?
```

---

## 12. Summary

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Purpose: 위계, 역할, 목적, 주목도를 명확히 전달한다.      │
│                                                         │
│   Essential (없으면 안 됨):                               │
│   - 아이콘 중심: 공간 효율, 빠른 스캔                       │
│   - 라운드: 시선이 흐르게                                  │
│   - 여백 (padding): 답답함 방지                           │
│   - 적은 토큰 종류: 일관성, 노이즈 감소                     │
│                                                         │
│   Method:                                               │
│   - 주목해야 할 곳에는 디자인 요소를 쓴다                  │
│   - 주목하지 않아도 될 곳에는 줄인다                       │
│   - 결과적으로 전체 요소가 최소화된다                      │
│                                                         │
│   Tools (목적에 맞게 사용):                               │
│   - 둥근 모서리: 시선이 흐르게                            │
│   - 그림자: 부유/위계 표현 (약하게)                        │
│   - 색상: 의미 전달에만                                  │
│   - 간격/선/면: 구분에 적합한 수단 선택                    │
│   - 패딩: 숨 쉴 공간 확보                                │
│   - 아이콘: 공간 효율 + tooltip                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
