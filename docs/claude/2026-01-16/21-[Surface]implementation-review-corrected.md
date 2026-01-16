# Surface Interactive Implementation Review (Corrected)

**작성일**: 2026-01-16
**태그**: #Surface #Interactive #Review #Analysis

## 0. 이전 리뷰의 오류

### 잘못된 이해 (20번 문서)
> "Surface는 색상만 표현해야 한다"
> "Raised/Overlay에서 border+shadow 제거해야 한다"
> "Interactive는 surface를 상승시킨다"

**완전히 틀렸습니다.**

### 올바른 이해

**Surface = 완전한 정체성 (bg + border + shadow + interactive의 조합체)**
- 제거가 아니라 **통일** = 각 surface의 정체성 일관성
- 안 쓰는 건 선언 안 함 (명시적으로 없다고 쓰지 않음)
- Interactive = 각 surface에 **어울리는** 반응

---

## 1. Surface의 올바른 정체성

### 1.1 각 Surface의 본질

#### Base - "깨끗한 평면"
```css
.surface-base {
  background-color: var(--surface-base);  /* 흰색 */
  /* border 없음 - 평평함의 본질 */
  /* shadow 없음 - 평면임을 강조 */
}
```
**정체성**: 깨끗하고 평평한 바탕
**사용처**: 메인 컨텐츠 영역, 카드 내부

#### Sunken - "음각된 배경"
```css
.surface-sunken {
  background-color: var(--surface-sunken);  /* #f9f9fb 살짝 회색 */
  /* border 없음 - 음각은 테두리 아님 */
  /* shadow 없음 - 들어간 느낌 */
}
```
**정체성**: 살짝 들어간 배경
**사용처**: 앱 전체 배경, Input 기본 상태

#### Raised - "떠오른 카드"
```css
.surface-raised {
  background-color: var(--surface-raised);  /* 흰색 */
  border: 1px solid var(--border-color);    /* ✅ 경계 있음 */
  box-shadow: var(--shadow-sm);             /* ✅ 살짝 뜸 */
}
```
**정체성**: 카드처럼 살짝 떠오른 느낌
**사용처**: 카드, 버튼 (surface variant)
**왜 border+shadow?**: 떠오름을 시각화하기 위해 **원래부터** 필요

#### Overlay - "최상단 부유"
```css
.surface-overlay {
  background-color: var(--surface-overlay);  /* 흰색 */
  border: 1px solid var(--border-color);     /* ✅ 경계 있음 */
  box-shadow: var(--shadow-lg);              /* ✅ 높이 뜸 */
}
```
**정체성**: 모달처럼 최상단에 떠 있음
**사용처**: 드롭다운, 모달, 팝오버
**왜 border+shadow?**: 최상단임을 강조하기 위해 **원래부터** 필요

#### Ghost - "투명한 존재"
```css
.surface-ghost {
  background-color: transparent;
  color: var(--text-body);
  border: 1px solid transparent;  /* Layout shift 방지 */
}
```
**정체성**: 존재하지만 보이지 않음
**사용처**: Ghost button
**왜 transparent border?**: Hover 시 border 나타날 때 layout shift 방지

#### Primary - "강조 배경"
```css
.surface-primary {
  background-color: var(--primary-bg);  /* #18181b 검정 */
  color: var(--primary-fg);             /* 흰색 */
}
```
**정체성**: 강조된 액션
**사용처**: Primary button, 선택된 상태

### 1.2 핵심 원칙

1. **Surface = 정체성 조합**
   - Border/shadow는 **정체성의 일부**
   - 제거하면 정체성이 깨짐
   - Raised는 **원래 border+shadow 있는 게 맞음**

2. **안 쓰는 건 선언 안 함**
   - Base: border 없음 (평평함의 본질)
   - Ghost: background 없음 (투명함의 본질)
   - 명시적으로 `border: none` 쓰지 않음

3. **통일 = 일관성**
   - 같은 surface는 어디서나 같은 모양
   - Interactive 여부와 무관하게 정체성 유지

---

## 2. Interactive의 올바른 역할

### 2.1 Interactive ≠ Surface 상승

**잘못된 생각**:
> "Base → Raised → Overlay로 상승시킨다"

**올바른 생각**:
> "각 surface가 **자기답게** 반응한다"

### 2.2 각 Surface의 Interactive 전략

#### Base Interactive - "평평함을 유지하면서 반응"
```css
.frame.interactive.surface-base:hover {
  background-color: var(--surface-panel);  /* 살짝 어둡게 */
}

.frame.interactive.surface-base:active {
  background-color: var(--surface-sunken);  /* 더 어둡게 */
}
```
**전략**: 평평한 상태를 유지하면서 **배경만 어둡게**
- Raised로 "상승"하지 않음
- Border/shadow 추가하지 않음
- 평면성 유지

**사용처**: List item, Menu item

#### Sunken Interactive - "음각 → Base로 Pop"
```css
.frame.interactive.surface-sunken {
  background-color: var(--surface-sunken);
  border: 1px solid var(--border-color);  /* Input은 border 필요 */
}

.frame.interactive.surface-sunken:focus-within {
  background-color: var(--surface-base);  /* ✅ Pop! */
  border-color: var(--text-primary);
}
```
**전략**: Focus 시 **들어간 곳에서 튀어나옴**
- Sunken → Base (깊이 변화)
- Border 진해짐 (강조)
- Field 패턴의 본질

**사용처**: Input, Textarea

#### Ghost Interactive - "투명 → 실체화"
```css
.frame.interactive.surface-ghost:hover {
  background-color: var(--control-bg-hover);  /* 배경 나타남 */
  color: var(--text-primary);
}

.frame.interactive.surface-ghost:active {
  background-color: var(--surface-overlay);  /* 실체 강화 */
}
```
**전략**: 투명에서 **점점 실체화**
- Hover: 살짝 배경
- Active: 확실한 배경
- Ghost의 본질 (없다가 생김)

**사용처**: Ghost button, Toolbar icon

#### Raised Interactive - "떠오름 강조"
```css
.frame.interactive.surface-raised:hover {
  filter: brightness(0.95);        /* 살짝 어둡게 */
  border-color: var(--text-muted); /* Border 진해짐 */
}

.frame.interactive.surface-raised:active {
  filter: brightness(0.9);
  transform: translateY(1px);  /* 눌림 feedback */
}
```
**전략**: 떠오른 상태를 **더 강조** + 촉각 피드백
- Shadow 유지 (떠오름 유지)
- Brightness 감소 (반응 표현)
- TranslateY (눌림 느낌)
- Raised의 본질 유지

**사용처**: Raised button, Card (클릭 가능)

#### Primary Interactive - "강조 유지"
```css
.frame.interactive.surface-primary:hover {
  opacity: 0.9;
}

.frame.interactive.surface-primary:active {
  opacity: 0.8;
}
```
**전략**: 강조 배경을 **유지하면서 투명도만 조절**
- 배경색 유지 (정체성 유지)
- Opacity만 감소 (반응)
- Primary의 본질 (항상 강조)

**사용처**: Primary button

### 2.3 핵심 원칙

1. **자기답게 반응**
   - Base는 base답게 (평평하게)
   - Raised는 raised답게 (떠오른 채로)
   - Ghost는 ghost답게 (실체화)

2. **정체성 유지**
   - Interactive해도 surface 정체성은 유지
   - Raised가 Base로 "하강"하지 않음
   - Base가 Raised로 "상승"하지 않음

3. **어울리는 변화**
   - Base: 배경 어둡게
   - Raised: 촉각 피드백
   - Ghost: 실체화
   - Primary: 투명도

---

## 3. 현재 구현 재평가

### ✅ 올바르게 구현된 부분 (90%)

#### 3.1 Surface 정체성 보존
```css
/* ✅ Raised의 본질 유지 */
.surface-raised {
  background-color: var(--surface-raised);
  box-shadow: var(--shadow-sm);
  border: var(--border-width) solid var(--border-color);
}

/* ✅ Overlay의 본질 유지 */
.surface-overlay {
  background-color: var(--surface-overlay);
  box-shadow: var(--shadow-lg);
  border: var(--border-width) solid var(--border-color);
}
```
**평가**: ✅ **완벽!** Border+shadow는 raised/overlay의 정체성

#### 3.2 Ghost Interactive (완벽)
```css
.surface-ghost {
  background-color: transparent;
  border: 1px solid transparent;  /* ✅ Layout shift 방지 */
}

.frame.interactive.surface-ghost:hover {
  background-color: var(--control-bg-hover);  /* ✅ 실체화 */
}
```
**평가**: ✅ **완벽!** Ghost의 본질 (투명 → 실체화) 정확히 표현

#### 3.3 Sunken Interactive (Field 패턴, 완벽)
```css
.frame.interactive.surface-sunken {
  border: 1px solid var(--border-color);  /* ✅ Input border */
}

.frame.interactive.surface-sunken:focus-within {
  background-color: var(--surface-base);  /* ✅ Pop! */
  border-color: var(--text-primary);
  z-index: 1;
}
```
**평가**: ✅ **완벽!** Sunken → Base pop 전략 정확

#### 3.4 Primary Interactive (완벽)
```css
.frame.interactive.surface-primary:hover {
  opacity: 0.9;
}
```
**평가**: ✅ **완벽!** 정체성 유지하며 반응

#### 3.5 Raised Interactive (의도적 선택)
```css
.frame.interactive.surface-raised:hover {
  filter: brightness(0.95);        /* 어둡게 */
  border-color: var(--text-muted); /* Border 진해짐 */
}

.frame.interactive.surface-raised:active {
  transform: translateY(1px);  /* 촉각 피드백 */
}
```
**평가**: ✅ **의도적 선택** - Raised의 떠오름을 유지하면서 반응

---

### ❓ 검토 필요 부분 (10%)

#### 4.1 Base Interactive - Panel 사용

**현재**:
```css
.frame.interactive.surface-base:hover {
  background-color: var(--surface-panel);  /* Panel? */
}

.frame.interactive.surface-base:active {
  background-color: var(--surface-sunken);  /* Sunken? */
}
```

**질문**:
1. **Panel은 sidebar 전용 토큰**인데 일반 interactive에 적합한가?
2. Base의 "평평함"에 어울리는 반응인가?

**대안 1**: Control token 사용
```css
.frame.interactive.surface-base:hover {
  background-color: var(--control-bg-hover);  /* #f4f4f5 */
}
```
- Ghost와 일관성 (둘 다 control-bg-hover 사용)
- Semantic하게 더 맞음

**대안 2**: 현재 유지
- Panel = 살짝 회색 (#f9f9fb)
- Control-bg-hover = 살짝 회색 (#f4f4f5)
- 거의 같은 색이므로 **큰 차이 없음**

**권장**: 대안 1 (일관성)

#### 4.2 Overlay Interactive - 누락

**문제**: Overlay interactive CSS가 전혀 없음
```css
/* ❌ 없음 */
.frame.interactive.surface-overlay:hover { /* ... */ }
```

**왜 필요한가**:
- `<Frame surface="overlay" interactive />` 사용 가능
- Dropdown menu item 같은 케이스

**제안**:
```css
.frame.interactive.surface-overlay:hover {
  filter: brightness(0.98);  /* 살짝 어둡게 */
}

.frame.interactive.surface-overlay:active {
  filter: brightness(0.95);
  box-shadow: var(--shadow-xl);  /* Shadow 더 강하게 */
}
```
**전략**: Overlay의 "최상단 부유"를 유지하면서 반응

---

## 4. 개선 제안

### Priority 1: Overlay Interactive 추가
```css
/* 추가 필요 */
.frame.interactive.surface-overlay:hover {
  filter: brightness(0.98);
}

.frame.interactive.surface-overlay:active {
  filter: brightness(0.95);
  box-shadow: var(--shadow-xl);
}
```

### Priority 2: Base Interactive Token 일관성
```css
/* 현재 */
.frame.interactive.surface-base:hover {
  background-color: var(--surface-panel);
}

/* 제안 */
.frame.interactive.surface-base:hover {
  background-color: var(--control-bg-hover);
}
```
**이유**: Ghost와 일관성, Semantic하게 더 적합

### Priority 3: 문서 수정

**docs/claude/2026-01-16/19-[Surface]interactive-option-strategy.md** 수정:
- ❌ "Surface는 색상만" 삭제
- ✅ "Surface = 정체성 조합" 추가
- ❌ "Base → Raised 상승" 삭제
- ✅ "각 surface에 어울리는 반응" 추가

**docs/claude/2026-01-16/20-[Surface]implementation-review.md** 폐기:
- 완전히 잘못된 분석
- 무시할 것

---

## 5. Surface별 정체성 완전 정리

### 요약 테이블

| Surface | 기본 스타일 | Interactive 전략 | 어울리는 이유 |
|---------|-----------|----------------|-------------|
| **base** | bg only | 배경 어둡게 | 평평함 유지 |
| **sunken** | bg only | Focus 시 base로 pop | 음각 → 평면 |
| **raised** | bg + border + shadow-sm | Brightness + translateY | 떠오름 유지 |
| **overlay** | bg + border + shadow-lg | Brightness + shadow 강화 | 최상단 유지 |
| **ghost** | transparent | 실체화 (배경 나타남) | 없음 → 있음 |
| **primary** | bg (black) + fg (white) | Opacity 감소 | 강조 유지 |

### 정체성 보존 원칙

1. **Raised는 항상 border+shadow 있음**
   - Interactive 여부와 무관
   - 이게 raised의 본질

2. **Base는 항상 평평함**
   - Interactive해도 raised로 "상승" 안 함
   - 배경만 어둡게

3. **Ghost는 항상 투명함**
   - Interactive 시 점진적 실체화
   - 갑자기 raised로 변하지 않음

4. **각 surface는 자기답게**
   - 정체성 유지
   - 어울리는 방식으로 반응

---

## 6. 최종 평가

### 구현 품질: A (95/100)

**강점** (95%):
1. ✅ Surface 정체성 완벽 보존
2. ✅ Ghost interactive 완벽 (투명 → 실체화)
3. ✅ Sunken interactive 완벽 (Field 패턴)
4. ✅ Primary interactive 완벽
5. ✅ Raised interactive 의도적 선택 (떠오름 유지)
6. ✅ TypeScript 타입 명확
7. ✅ 코드 구조 깔끔

**개선 필요** (5%):
1. ❓ Base interactive - panel vs control-bg-hover (minor)
2. ❌ Overlay interactive 누락 (추가 필요)

### 핵심 통찰

**이전 리뷰 (20번 문서)의 오류**:
- ❌ "Surface는 색상만" → 완전히 틀림
- ❌ "Border+shadow 제거" → 정체성 파괴
- ❌ "상승 전략" → 각 surface의 본질 무시

**올바른 이해**:
- ✅ Surface = 정체성 조합 (bg + border + shadow)
- ✅ Raised의 border+shadow는 **원래 맞는 것**
- ✅ Interactive = 각 surface에 **어울리는** 반응
- ✅ 제거가 아니라 **통일** = 일관성

### 결론

**현재 구현은 거의 완벽합니다.**

단 2가지만 추가하면 100%:
1. Overlay interactive CSS 추가
2. Base interactive token 일관성 (선택사항)

**기존 raised/overlay의 border+shadow는 절대 제거하면 안 됩니다.**
이것은 **버그가 아니라 의도된 정체성**입니다.

---

**작성자**: Claude
**이전 리뷰 폐기**: 20-[Surface]implementation-review.md는 완전히 잘못된 분석
**올바른 리뷰**: 본 문서 (21번)