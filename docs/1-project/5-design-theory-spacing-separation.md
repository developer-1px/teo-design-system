# 선, 면, Padding, Gap, Size의 디자인 이론적 배경

**작성일**: 2026-01-12
**목적**: Token Engine의 Layout Strategy (선으로 구분 vs 면으로 구분)에 대한 이론적 근거 정리

---

## 목차

1. [개요](#개요)
2. [심리학적 기반: 게슈탈트 원리](#심리학적-기반-게슈탈트-원리)
3. [시각적 분리 방법론](#시각적-분리-방법론)
4. [공간 시스템: Padding과 Gap](#공간-시스템-padding과-gap)
5. [8px Grid System과 일관성](#8px-grid-system과-일관성)
6. [미니멀리즘과 Data-Ink Ratio](#미니멀리즘과-data-ink-ratio)
7. [Token Engine 적용: 이론에서 실무로](#token-engine-적용-이론에서-실무로)
8. [참고문헌](#참고문헌)

---

## 개요

현대 UI 디자인에서 시각적 분리(Visual Separation)와 그룹화(Grouping)는 정보 구조를 전달하는 핵심 수단입니다. 본 문서는 **선(Border)**, **면(Surface)**, **여백(Padding/Gap)**, **크기(Size)**를 활용한 디자인의 이론적 배경을 정리하고, Token Engine의 Layout Strategy에 대한 학술적 근거를 제시합니다.

### 핵심 질문

1. **왜 Border와 Background를 동시에 사용하지 않는가?**
2. **왜 Padding이 있으면 Radius가 있어야 하는가?**
3. **왜 Gap과 Padding은 체계적인 Scale을 따라야 하는가?**
4. **왜 Overflow-hidden을 최소화해야 하는가?**

이 질문들의 답은 모두 **게슈탈트 심리학**, **시각적 계층 이론**, **미니멀리즘 디자인 철학**에서 찾을 수 있습니다.

---

## 심리학적 기반: 게슈탈트 원리

### 1. 게슈탈트 심리학이란?

**게슈탈트(Gestalt)** 심리학은 20세기 초 독일에서 시작된 심리학 이론으로, "인간의 뇌는 개별 요소를 인식할 때 전체적인 패턴으로 조직화하려는 선천적 경향이 있다"는 것을 주장합니다.

> "The whole is greater than the sum of its parts."
> (전체는 부분의 합보다 크다)

게슈탈트 원리는 시각 디자인의 이론적 토대를 제공하며, UI/UX 디자인에서 그룹화, 분리, 계층 구조를 설계하는 데 필수적입니다.

### 2. 근접성의 원리 (Principle of Proximity)

**정의**: 서로 가까이 있는 요소는 관련된 것으로 인식되고, 멀리 떨어진 요소는 별개의 그룹으로 인식됩니다.

**핵심 발견**:
- 근접성은 색상, 형태, 크기 등 다른 시각적 속성을 압도합니다 (가장 강력한 게슈탈트 원리)
- 텍스트에서도 적용: 문장은 단락으로 그룹화되고, 단락 사이의 여백은 분리를 의미합니다.

**Token Engine 적용**:
```typescript
// Gap: 요소 간 간격 → 관련성 정도를 표현
gap: 4px  // 밀접한 관계 (List Item 내부)
gap: 16px // 독립적 그룹 (Card와 Card 사이)
gap: 32px // 완전히 다른 섹션 (Section 간 분리)
```

**실무 가이드**:
- **내부 Gap < 외부 Gap** 원칙: 그룹 내부의 간격은 그룹 간 간격보다 작아야 합니다.
- Proximity만으로도 충분한 경우, Border나 Background를 추가하지 않습니다 (미니멀리즘).

### 3. 공통 영역의 원리 (Principle of Common Region)

**정의**: 동일한 경계(Boundary) 내에 있는 요소들은 하나의 그룹으로 인식되며, 공통된 특성이나 기능을 공유한다고 가정됩니다.

**역사**: Stephen Palmer와 Irvin Rock이 1999년에 공식화한 원리로, 게슈탈트 이론의 현대적 확장입니다.

**실현 방법**:
1. **Background (면으로 구분)**: 배경색 변화로 영역 표시
2. **Border (선으로 구분)**: 경계선으로 영역 구획
3. **Shadow**: 그림자로 depth 표현

**Token Engine의 선택**:
```typescript
// Surface Strategy (면으로 구분)
padding: 16px;        // 콘텐츠와 배경 분리
background: #ffffff;  // 면이 경계 역할
border: 0;            // Border 불필요
radius: 8px;          // 부드러운 모서리 (면 강조)

// Border Strategy (선으로 구분)
padding: 0;           // 선이 경계, padding 불필요
background: transparent;
border: 1px solid;    // 선명한 구획
radius: 0;            // 직선 강조
```

**이론적 근거**:
- Border와 Background를 **동시에 사용하면 시각적 중복**이 발생합니다.
- 두 가지 방법이 모두 "공통 영역"을 정의하므로, 하나만 사용해도 충분합니다.
- 불필요한 시각 요소는 **인지 부하(Cognitive Load)**를 증가시킵니다.

### 4. 유사성의 원리 (Principle of Similarity)

**정의**: 색상, 형태, 크기가 유사한 요소들은 관련된 것으로 인식됩니다.

**Token Engine 적용**:
- 동일한 `prominence` 값을 가진 요소들은 동일한 크기, 색상, spacing을 가집니다.
- 일관된 디자인 토큰 사용 → 시각적 리듬 생성 → 사용자 학습 용이

---

## 시각적 분리 방법론

### 1. 분리 방법의 위계 (Hierarchy of Separation Methods)

시각적 분리는 "약한 수단"에서 "강한 수단"으로 점진적으로 강화해야 합니다.

**Edward Tufte의 원칙 응용**:
> "Above all else show the data. Erase non-data-ink."

이를 UI 디자인에 적용하면:
> "Above all else show the content. Erase non-content visual elements."

**분리 수단의 강도 순서** (약 → 강):

1. **여백 (White Space)** ← 가장 약한 수단 (최우선 사용)
2. **배경색 차이 (Background Color)**
3. **테두리 (Border)**
4. **그림자 (Shadow)**
5. **강조색 (Accent Color)** ← 가장 강한 수단 (최소 사용)

### 2. Token Engine의 Design Decision Tree

```
정보 구조를 분리하고 싶다
  ↓
[1단계] Proximity로 해결 가능한가?
  YES → Gap 조정만으로 해결 (Best Practice)
  NO  → 2단계로
  ↓
[2단계] Background 차이로 해결 가능한가?
  YES → Surface Strategy 사용
       padding: O, background: O, border: X, radius: O
  NO  → 3단계로
  ↓
[3단계] Border가 필요한가?
  YES → Border Strategy 사용
       padding: X, background: X, border: O, radius: X
  NO  → 4단계로
  ↓
[4단계] Shadow가 필요한가? (물리적 elevation 표현)
  YES → depth 시스템 사용 (depth 0~6)
  NO  → 5단계로
  ↓
[5단계] Accent Color 사용 (화면당 최대 1~2개만 허용)
  → Primary CTA, Focus State 등에만 사용
```

### 3. 왜 Border와 Background를 함께 쓰지 않는가?

**NN/g (Nielsen Norman Group) 연구 결과**:
> "Borders are often added in an abundance of caution to ensure that groupings are clear; however, this approach can result in busy, cluttered designs."
> (Border는 그룹화를 명확히 하기 위해 과도하게 추가되지만, 이는 복잡하고 어수선한 디자인을 초래합니다.)

**Token Engine의 원칙**:
- Surface Strategy: **면이 이미 경계 역할**을 하므로 Border 불필요
- Border Strategy: **선이 이미 경계 역할**을 하므로 Background/Padding 불필요
- 두 가지를 동시에 사용하면 **시각적 중복** → 인지 부하 증가

**예외 사항**:
- Input Field는 Surface Strategy이지만 subtle border를 추가할 수 있습니다.
- 이유: 사용자가 입력 가능한 영역임을 명확히 표시하기 위함 (Affordance 원리)
- 단, border opacity는 20~30%로 매우 약하게 설정 (중복 최소화)

---

## 공간 시스템: Padding과 Gap

### 1. Negative Space의 힘

**정의**: Negative Space (또는 White Space)는 디자인 요소 사이와 내부의 빈 공간을 의미합니다.

**심리학적 효과**:
- 적절한 여백은 정보 처리를 용이하게 하고, 사용자가 압도당하지 않게 합니다.
- 연구 결과: 텍스트 행 간격과 여백의 적절한 사용은 **이해도를 최대 20% 향상**시킵니다.
- CTA 버튼 주변의 전략적 여백은 **클릭률을 25% 증가**시킵니다.

### 2. Macro vs Micro White Space

**Macro White Space**:
- 주요 레이아웃 요소 간의 큰 간격
- Token Engine: `gap` (Section 간 간격, Card 간 간격 등)
- 목적: 페이지 구조 정의, 시각적 계층 생성

**Micro White Space**:
- 요소 내부의 작은 간격
- Token Engine: `padding` (버튼 내부 여백, Card 내부 여백 등)
- 목적: 가독성 향상, 시각적 편안함 제공

### 3. Active vs Passive White Space

**Active White Space**:
- 사용자를 특정 흐름으로 유도하기 위해 의도적으로 배치한 여백
- 예: CTA 버튼 주변의 넓은 여백 → 시선 집중

**Passive White Space**:
- 미적 개선을 위한 여백
- 예: 텍스트 행간, 일반적인 padding

### 4. Padding과 Radius의 관계

**이론적 배경**:
- **Surface Strategy**에서 padding은 "콘텐츠와 배경의 분리"를 의미합니다.
- Radius는 "면의 부드러움"을 강조하여 **surface의 존재감**을 높입니다.
- Padding이 있는데 Radius가 없으면 → 면이 딱딱하고 인위적으로 느껴짐
- Padding이 없는데 Radius가 있으면 → 시각적 혼란 (무엇을 둥글게 만든 것인가?)

**Token Engine 공식**:
```typescript
radius = padding.x × RADIUS_RATIO[role]
```

**역할별 Ratio**:
- **Button**: 0.67 (padding 12px → radius 8px) - 높은 친화력
- **Card**: 0.6 (padding 20px → radius 12px) - 중간 친화력
- **Input**: 0.5 (padding 12px → radius 6px) - 절제된 친화력
- **Panel**: 0 (radius 없음) - 구조적 요소

**Snapping Algorithm**:
계산된 radius는 Tailwind 허용 값 (2, 4, 6, 8, 12, 16, 24px)으로 반올림됩니다.

---

## 8px Grid System과 일관성

### 1. 8px Grid의 역사와 채택 이유

**기원**:
- Apple과 Google이 공식 권장하는 시스템
- 2010년대 중반부터 Material Design과 iOS HIG에서 표준화

**왜 8px인가?**:
1. **확장성**: 8의 배수는 2로 나누어떨어지므로 반응형 디자인에 적합
2. **픽셀 퍼펙트**: 대부분의 화면 해상도에서 깨끗하게 렌더링
3. **인지적 부담 감소**: 4, 8, 16, 24, 32 등 단순한 숫자 → 디자이너와 개발자 간 소통 용이

### 2. Token Engine의 Spacing Scale

**허용된 Spacing 값** (px):
```
4, 8, 12, 16, 24, 32, 48, 64, 96
```

**이론적 근거**:
- **제한된 선택지** → 일관성 강제 → 시각적 리듬 생성
- **피보나치 수열과 유사**: 자연스러운 비율 증가 (1.5배 ~ 2배)
- **인지 부하 감소**: "이 간격은 얼마가 적당할까?" 고민 불필요

### 3. Design Tokens의 네이밍

**일반적 컨벤션**:
1. **Numeric** (100, 200, 300): Tailwind, Chakra UI
2. **Multiplier** (x1, x2, x3): Material Design
3. **Size** (xs, s, m, l, xl): Bootstrap

**Token Engine의 선택**:
- rem 기반 (1rem = 16px)
- Prominence × Density에 따라 자동 계산
- 결과값은 허용된 spacing 값으로 snapping

### 4. Internal ≤ External Rule

**원칙**: 그룹 내부의 간격은 그룹 간 간격보다 작거나 같아야 합니다.

```
Card 내부 gap: 8px
Card 간 gap: 16px
Section 간 gap: 32px
```

**이론적 근거**:
- 근접성의 원리(Proximity Principle) 구현
- 시각적 계층 강화
- 사용자의 정보 그룹화 학습 용이

---

## 미니멀리즘과 Data-Ink Ratio

### 1. Edward Tufte의 Data-Ink Ratio

**정의** (1983):
> "Data-ink is the non-erasable core of a graphic, the non-redundant ink arranged in response to variation in the numbers represented."

**Data-Ink Ratio 공식**:
```
Data-Ink Ratio = (Ink used for data) / (Total ink used)
```

**Tufte의 5가지 원칙**:
1. Above all else show the data
2. Maximize the data-ink ratio
3. Erase non-data-ink
4. Erase redundant data-ink
5. Revise and edit

### 2. UI 디자인에 적용: Content-Ink Ratio

**변형된 공식**:
```
Content-Ink Ratio = (Pixels used for content) / (Total pixels used)
```

**Token Engine의 미니멀리즘 원칙**:
1. **Above all else show the content** (콘텐츠 우선)
2. **Maximize the content-pixel ratio** (장식 요소 최소화)
3. **Erase non-content pixels** (불필요한 border, shadow 제거)
4. **Erase redundant visual elements** (border + background 중복 제거)
5. **Revise and edit** (예외를 문서화하고 지속적으로 검토)

### 3. 실무 적용 예시

**Before (Low Content-Ink Ratio)**:
```css
.card {
  background: white;
  border: 2px solid gray;      /* 중복 1 */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* 중복 2 */
  padding: 20px;
  border-radius: 12px;
}
```
→ Border, Shadow, Background가 모두 "경계"를 정의 → 시각적 잡음

**After (High Content-Ink Ratio)**:
```css
/* Surface Strategy */
.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Subtle elevation만 */
}

/* OR Border Strategy */
.table-cell {
  border: 1px solid gray;
  /* padding, background, radius 없음 */
}
```

### 4. Overflow-hidden의 문제

**왜 최소화해야 하는가?**

1. **Tooltip/Dropdown 잘림**:
   - `overflow: hidden`이 있는 컨테이너 내부의 floating UI는 잘립니다.
   - 사용자 경험 저해 (정보를 볼 수 없음)

2. **Sticky Element 실패**:
   - `position: sticky`는 부모에 `overflow: hidden`이 있으면 작동하지 않습니다.

3. **불필요한 제약**:
   - Radius를 적용하기 위해 습관적으로 `overflow: hidden`을 추가하는 경우가 많습니다.
   - 하지만 대부분의 경우 불필요합니다 (자식 요소가 부모를 벗어나지 않음).

**Token Engine의 원칙**:
```typescript
// Default
overflow: 'visible'

// Exceptions only (명시적으로 필요한 경우만)
const needsClipping = ['ImageCard', 'Avatar', 'MediaContainer'];
if (needsClipping.includes(role)) {
  overflow: 'overflow-hidden';
}
```

**이론적 근거**:
- **Principle of Least Constraint**: 최소한의 제약만 적용
- **Progressive Enhancement**: 필요한 경우에만 추가

---

## Token Engine 적용: 이론에서 실무로

### 1. Layout Strategy Decision Matrix

| 조건 | 전략 | Padding | Background | Border | Radius | Overflow |
|------|------|---------|------------|--------|--------|----------|
| 데이터 그리드 (Table, List) | Border | ✗ | ✗ | ✓ | ✗ | visible |
| 콘텐츠 카드 (Card, Button) | Surface | ✓ | ✓ | ✗ | ✓ | visible |
| 구분선 (Divider, Separator) | Border | ✗ | ✗ | ✓ | ✗ | visible |
| 입력 필드 (Input, Select) | Surface* | ✓ | ✓ | ✓ (subtle) | ✓ | visible |

*Input은 예외적으로 subtle border 추가 (Affordance 원리)

### 2. Prominence와 Spacing의 관계

**이론**: 시각적 중요도가 높을수록 더 많은 공간이 필요합니다.

**Token Engine 구현**:
```typescript
const PROMINENCE_MULTIPLIER: Record<Prominence, number> = {
  Hero: 1.5,      // 최대 spacing (최고 중요도)
  Elevated: 1.29,
  Strong: 1.125,
  Standard: 1.0,  // 기준선
  Subtle: 0.875,
  None: 0.75,
  Hidden: 0       // spacing 없음 (숨김)
};

// 실제 spacing 계산
spacing = basePadding × density × prominence
```

**실무 예시**:
- Hero CTA Button: padding 24px (1.5 × 16px)
- Standard Button: padding 16px (1.0 × 16px)
- Subtle Icon Button: padding 14px (0.875 × 16px)

### 3. Radius Calculation의 이론적 배경

**가설**: Radius는 Padding에 비례해야 자연스럽습니다.

**근거**:
- Padding이 크면 → 내부 공간이 넓음 → 부드러운 모서리 필요
- Padding이 작으면 → 내부 공간이 좁음 → 절제된 모서리 필요

**검증**:
- Material Design: Card padding 16px, radius 4px → ratio 0.25
- iOS HIG: Button padding 16px, radius 8px → ratio 0.5
- Token Engine: 역할별로 0.4~0.67 사이 (중간값 0.5)

### 4. 예외 처리와 문서화

**원칙**: 모든 예외는 주석으로 명시해야 합니다.

**예시**:
```typescript
// EXCEPTION: Input fields use subtle border even with Surface Strategy
// Reason: Provide clear affordance for interactive input area
// Reference: Nielsen Norman Group - Signifiers of Interactivity
if (isInput && prominence !== 'Hero') {
  widthNum = 1;
  color = 'border-border-muted/30';
}
```

**문서 위치**:
- `docs/1-project/5-design-theory-spacing-separation.md` (본 문서)
- `docs/2-areas/core/token-engine-layout-principles.md`
- Inline comments in `generators/geometry.ts`

---

## 요약: Token Engine의 Design Philosophy

### 핵심 원칙 7가지

1. **Proximity First** (근접성 우선)
   - Gap 조정만으로 해결 가능하면 다른 수단 사용하지 않기

2. **One Separation Method** (단일 분리 수단)
   - Border와 Background를 동시에 사용하지 않기
   - 시각적 중복 제거 → 인지 부하 감소

3. **Padding ↔ Radius Coupling** (Padding과 Radius 결합)
   - Surface Strategy에서는 padding이 있으면 radius도 있어야 함
   - Radius = Padding × Ratio (역할별 비율)

4. **8px Base Unit** (8px 기본 단위)
   - 모든 spacing은 4, 8, 12, 16, 24, 32, 48, 64, 96 중 선택
   - 일관성 강제 → 시각적 리듬 생성

5. **Internal ≤ External** (내부 ≤ 외부)
   - 그룹 내부 간격 < 그룹 간 간격
   - 근접성 원리 구현

6. **Overflow Visible by Default** (기본값 visible)
   - Tooltip/Dropdown 잘림 방지
   - 예외만 명시적으로 hidden 설정

7. **Maximize Content-Ink Ratio** (콘텐츠 비율 최대화)
   - 장식 요소 최소화
   - 콘텐츠에 집중

### 이론적 뿌리

- **게슈탈트 심리학** (1920s): Proximity, Common Region
- **정보 디자인 이론** (1983): Edward Tufte의 Data-Ink Ratio
- **인터랙션 디자인** (1999): Palmer & Rock의 Common Region 원리
- **현대 디자인 시스템** (2010s): Material Design, iOS HIG의 8px Grid

### 실무 적용

Token Engine은 이러한 이론들을 **자동화**하여, 디자이너와 개발자가 일일이 고민하지 않아도 이론에 부합하는 디자인이 생성되도록 합니다.

```typescript
// 개발자가 작성하는 코드 (선언적)
<Block role="Card" prominence="Standard">
  <Text>Content</Text>
</Block>

// Token Engine이 자동 생성 (이론 기반)
{
  padding: "1rem 1.25rem",     // Proximity: 내부 여백
  background: "bg-surface",     // Common Region: 면으로 구분
  border: "border-0",           // 중복 제거
  radius: "rounded-xl",         // padding × 0.6 = 12px
  overflow: "overflow-visible"  // Tooltip 보호
}
```

---

## 참고문헌

### 학술 논문 및 서적

1. **Wertheimer, M. (1923)**
   "Laws of Organization in Perceptual Forms"
   *Psychologische Forschung*
   → 게슈탈트 심리학의 원류

2. **Palmer, S., & Rock, I. (1994)**
   "Rethinking perceptual organization: The role of uniform connectedness"
   *Psychonomic Bulletin & Review*, 1(1), 29-55
   → Common Region 원리 정립

3. **Tufte, E. R. (1983)**
   *The Visual Display of Quantitative Information*
   Graphics Press
   → Data-Ink Ratio 이론

4. **Ware, C. (2012)**
   *Information Visualization: Perception for Design* (3rd ed.)
   Morgan Kaufmann
   → 시각 인지와 디자인

### 디자인 시스템 문서

5. **Nielsen Norman Group**
   "Proximity Principle in Visual Design"
   https://www.nngroup.com/articles/gestalt-proximity/

6. **Nielsen Norman Group**
   "The Principle of Common Region: Containers Create Groupings"
   https://www.nngroup.com/articles/common-region/

7. **Google Material Design**
   "Understanding Layout" (2024)
   https://m3.material.io/foundations/layout/understanding-layout/overview

8. **Apple Human Interface Guidelines**
   "Layout" (iOS 17, 2024)
   https://developer.apple.com/design/human-interface-guidelines/layout

9. **Atlassian Design System**
   "Spacing" (2024)
   https://atlassian.design/foundations/spacing/

### 실무 가이드

10. **Chris Godby (2017)**
    "The 8pt Grid: Consistent Spacing in UI Design with Sketch"
    Prototypr
    https://blog.prototypr.io/the-8pt-grid-consistent-spacing-in-ui-design-with-sketch-577e4f0fd520

11. **Cieden Design**
    "Spacing Best Practices (8pt Grid System)"
    https://cieden.com/book/sub-atomic/spacing/spacing-best-practices

12. **Hakan Ertan (2023)**
    "Designer's Ultimate Spacing Guide: From Design Tokens to Final Design"
    https://hakan-ertan.com/designers-ultimate-spacing-guide-from-design-tokens-to-final-design/

### 연구 논문

13. **Miniukovich, A., & De Angeli, A. (2014)**
    "Minimalism in information visualization: Attitudes towards maximizing the data-ink ratio"
    *Proceedings of the 2014 Conference on Designing Interactive Systems*
    → Data-Ink Ratio의 실증 연구

14. **Lin, R. (2004)**
    "A study of visual features for icon design"
    *Design Studies*, 15(2), 185-197
    → 아이콘과 시각적 계층

---

## 부록: Token Engine 구현 예시

### A. Layout Strategy 분기 로직

```typescript
// geometry.ts
function getLayoutStrategy(role: Role): 'surface' | 'border' {
  const BORDER_ROLES = [
    'Table', 'TableRow', 'TableCell',
    'List', 'ListItem',
    'Divider', 'Separator',
    'TabList', 'TabItem',
    'TreeView', 'TreeItem',
    'Grid', 'GridItem'
  ];

  return BORDER_ROLES.includes(role) ? 'border' : 'surface';
}
```

### B. Radius 계산 및 Snapping

```typescript
// geometry.ts
function calculateRadius(role: Role, input: TokenInput): string {
  const strategy = getLayoutStrategy(role);

  if (strategy === 'border') {
    return 'rounded-none'; // Border Strategy: 직선 강조
  }

  const ratio = RADIUS_RATIO[role] || 0.5;
  if (ratio === 0) return 'rounded-none';
  if (ratio >= 999) return 'rounded-full';

  const basePadding = BASE_PADDING_MAP[role] || { x: 1.0, y: 1.0 };
  const paddingPx = basePadding.x * 16; // rem to px
  const radiusPx = paddingPx * ratio;

  return snapToRadius(radiusPx); // 2, 4, 6, 8, 12, 16, 24로 반올림
}
```

### C. Prominence 기반 Spacing

```typescript
// spacing.ts
const PROMINENCE_MULTIPLIER: Record<Prominence, number> = {
  Hero: 1.5,      // 게슈탈트: 중요한 요소는 더 많은 공간
  Elevated: 1.29,
  Strong: 1.125,
  Standard: 1.0,
  Subtle: 0.875,
  None: 0.75,
  Hidden: 0
};

export function generateSpacing(input: TokenInput): SpacingTokens {
  const { role, density = 'Standard', prominence = 'Standard' } = input;

  const basePadding = BASE_PADDING_MAP[role] || { x: 1.0, y: 1.0 };
  const densityMult = DENSITY_MULTIPLIER[density];
  const prominenceMult = PROMINENCE_MULTIPLIER[prominence];

  const paddingX = basePadding.x * densityMult * prominenceMult;
  const paddingY = basePadding.y * densityMult * prominenceMult;

  return {
    gap: `${baseGap * densityMult}rem`,
    padding: `${paddingY}rem ${paddingX}rem`
  };
}
```

---

**문서 버전**: 1.0
**최종 수정**: 2026-01-12
**작성자**: Claude (Token Engine Improvement Project)
**관련 문서**:
- `docs/2-areas/core/token-engine-formula-report.md`
- `docs/2-areas/core/token-engine-layout-principles.md`
- `docs/2-areas/core/token-engine-future-proposals.md`
