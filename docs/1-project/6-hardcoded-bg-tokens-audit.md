# Hardcoded Background Token Audit

**작성일**: 2026-01-12
**목적**: Theme에 등록되지 않은 하드코딩된 bg 토큰 찾기 및 수정 계획 수립

---

## 요약

총 **22개 파일**에서 theme에 등록되지 않은 하드코딩된 color 토큰을 사용 중입니다.

### 주요 문제점

1. **Tailwind 기본 색상 직접 사용** (bg-red-500, bg-blue-500 등)
   - Theme 변수를 사용하지 않음 → Dark mode에서 일관성 없음
   - Color Scheme 변경 시 자동으로 변하지 않음

2. **Arbitrary Values 사용** (bg-[#...])
   - 디자인 토큰 시스템 우회
   - 유지보수 어려움

3. **일관성 없는 Semantic Color**
   - 같은 의미(success, error 등)를 다른 색상으로 표현
   - 예: `bg-green-500` vs `bg-green-100` 모두 "success" 의미

---

## 카테고리별 분류

### 1. Semantic Intent Colors (의미론적 색상)

**문제**: Intent (Positive, Caution, Critical, Info)를 표현하는데 직접 색상 사용

#### ✅ 등록된 Theme 토큰

```css
/* themes.css에 이미 정의됨 */
--color-success: var(--color-green-600);     /* Positive */
--color-warning: var(--color-orange-600);    /* Caution */
--color-error: var(--color-rose-600);        /* Critical */
--color-info: var(--color-sky-600);          /* Info */
```

#### ❌ 하드코딩된 사용 사례

| 파일 | 라인 | 현재 코드 | 올바른 코드 |
|------|------|-----------|-------------|
| `Progress.tsx` | 65-67 | `bg-green-500`, `bg-yellow-500`, `bg-red-500` | `bg-success`, `bg-warning`, `bg-error` |
| `ProgressRenderer.tsx` | 18-21 | `bg-green-500`, `bg-yellow-500`, `bg-red-500`, `bg-blue-500` | `bg-success`, `bg-warning`, `bg-error`, `bg-info` |
| `BadgeRenderer.tsx` | 54-57 | `bg-green-500`, `bg-yellow-500`, `bg-red-500`, `bg-blue-500` | `bg-success`, `bg-warning`, `bg-error`, `bg-info` |
| `Badge.tsx` | 19-20 | `bg-red-500`, `bg-blue-500` | `bg-error`, `bg-info` |
| `Alert.tsx` | 46-55 | `bg-blue-50`, `bg-green-50`, `bg-yellow-50`, `bg-red-50` | **Missing**: `bg-info-subtle`, `bg-success-subtle`, `bg-warning-subtle`, `bg-error-subtle` |

**수정 필요**: `Alert.tsx`와 `Badge.tsx`의 subtle background variants가 theme에 없음.

**제안**: themes.css에 추가
```css
--color-success-subtle: var(--color-green-50);   /* Light mode */
--color-warning-subtle: var(--color-orange-50);
--color-error-subtle: var(--color-rose-50);
--color-info-subtle: var(--color-sky-50);

/* Dark mode에서는 더 어두운 톤 */
[data-theme='dark'] {
  --color-success-subtle: var(--color-green-950);
  --color-warning-subtle: var(--color-orange-950);
  --color-error-subtle: var(--color-rose-950);
  --color-info-subtle: var(--color-sky-950);
}
```

---

### 2. Surface/Background Variants (표면 색상 변형)

**문제**: `bg-slate-50`, `bg-slate-100` 등 중립 배경색을 직접 사용

#### ✅ 등록된 Theme 토큰

```css
--color-surface-base: var(--color-gray-50);      /* Layer 0 */
--color-surface-sunken: var(--color-gray-100);   /* Layer 1 */
--color-surface: white;                          /* Layer 2 */
--color-surface-raised: white;                   /* Layer 3 */
--color-surface-elevated: white;                 /* Layer 4 */
--color-surface-floating: white;                 /* Layer 5 */
--color-surface-overlay: white;                  /* Layer 6 */
```

#### ❌ 하드코딩된 사용 사례

| 파일 | 라인 | 현재 코드 | 문제점 | 올바른 코드 |
|------|------|-----------|--------|-------------|
| `DocumentExample.tsx` | 78, 92 | `bg-slate-50` | slate 대신 gray 사용 | `bg-surface-base` |
| `DocumentExample.tsx` | 129 | `bg-slate-100/30` | 투명도와 함께 사용 | `bg-surface-sunken/30` |
| `ApplicationExample.tsx` | 67 | `bg-slate-50` | | `bg-surface-base` |
| `ApplicationExample.tsx` | 83 | `bg-slate-50/50` | | `bg-surface-base/50` |
| `ApplicationExample.tsx` | 129, 138, 175 | `bg-slate-50`, `bg-slate-50/50`, `bg-slate-50/30` | 여러 opacity 사용 | `bg-surface-base` + opacity variants |
| `OverlayExample.tsx` | 72 | `hover:bg-slate-50` | hover state | `hover:bg-hover` |
| `Block/role-config.ts` | 81 | `bg-slate-50/50` | | `bg-surface-base/50` |
| `Layout.tsx` | 127 | `bg-slate-50/50` | | `bg-surface-base/50` |

**문제 분석**:
- `slate` vs `gray`: Theme는 `gray`를 사용하는데 코드는 `slate` 사용
- Opacity variants: `/30`, `/50` 등이 필요하지만 theme에 명시적으로 정의되지 않음

**제안**: Tailwind 4의 opacity modifier는 자동으로 작동하므로, 색상만 통일하면 됨.

---

### 3. Interactive State Colors (인터랙션 상태 색상)

**문제**: Hover, active, focus 등의 상태 색상을 직접 지정

#### ✅ 등록된 Theme 토큰

```css
--color-hover: var(--color-gray-100);
--color-active: var(--color-gray-200);
--color-focus: var(--color-primary);
```

#### ❌ 하드코딩된 사용 사례

| 파일 | 라인 | 현재 코드 | 올바른 코드 |
|------|------|-----------|-------------|
| `ApplicationExample.tsx` | 171-172 | `hover:bg-slate-100` | `hover:bg-hover` |
| `Badge.tsx` | 19 | `hover:bg-red-600` | `hover:bg-error-hover` (Missing!) |
| `Badge.tsx` | 20 | `hover:bg-blue-600` | `hover:bg-info-hover` (Missing!) |
| `ColorPalette.tsx` | 57 | `hover:bg-red-600` | `hover:bg-error-hover` |
| `switch.tsx` | 11 | `bg-slate-200` (unchecked) | `bg-surface-sunken` |

**수정 필요**: Intent color의 hover variants가 theme에 없음.

**제안**:
```css
--color-success-hover: var(--color-green-700);
--color-warning-hover: var(--color-orange-700);
--color-error-hover: var(--color-rose-700);
--color-info-hover: var(--color-sky-700);
```

---

### 4. Special Purpose Colors (특수 목적 색상)

#### ❌ 하드코딩된 사용 사례

| 파일 | 라인 | 현재 코드 | 용도 | 제안 |
|------|------|-----------|------|------|
| `inline.ts` | 39 | `bg-yellow-200` | Highlight/Mark | Theme에 `--color-highlight` 추가 |
| `ImmersiveExample.tsx` | 40 | `bg-blue-500/10` | Decorative gradient | 예외 허용 (decorative only) |
| `ImmersiveExample.tsx` | 107 | `bg-green-500/10` | Decorative accent | 예외 허용 (decorative only) |
| `surface.ts` | 103 | `bg-slate-950` + arbitrary gradients | Immersive page background | Theme에 `--color-immersive-bg` 추가 고려 |
| `surface.ts` | 134 | `bg-gray-900/60` | Modal backdrop | Theme에 `--color-backdrop` 추가 |
| `Tooltip.tsx` | 70, 86 | `bg-gray-900` | Tooltip background | Theme에 `--color-tooltip-bg` 추가 |
| `Overlay.tsx` | 409 | `bg-gray-900` | Tooltip background | 위와 동일 |
| `role-registry.ts` | 142 | `bg-gray-900` | Tooltip background | 위와 동일 |

---

### 5. Component-Specific Colors (컴포넌트별 색상)

#### Field/Switch Components

| 파일 | 라인 | 현재 코드 | 문제점 | 제안 |
|------|------|-----------|--------|------|
| `field.styles.ts` | 272 | `bg-gray-200` (unchecked) | | `bg-surface-sunken` |
| `field.styles.ts` | 278 | `bg-gray-200` | | `bg-surface-sunken` |
| `switch.tsx` | 11 | `bg-slate-200` | | `bg-surface-sunken` |

#### Data Display (Status badges)

| 파일 | 라인 | 현재 코드 | 문제점 |
|------|------|-----------|--------|
| `DataDisplay.tsx` | 16 | `bg-green-100 text-green-800` | 직접 색상 지정 |

**제안**: Badge/Status 컴포넌트는 Intent 기반 토큰 사용

---

## 우선순위별 수정 계획

### Priority 1: Theme 토큰 추가 (High)

다음 토큰들을 `themes.css`에 추가해야 합니다:

```css
@theme {
  /* Intent Subtle Backgrounds (Alert, Badge 등에서 사용) */
  --color-success-subtle: var(--color-green-50);
  --color-warning-subtle: var(--color-orange-50);
  --color-error-subtle: var(--color-rose-50);
  --color-info-subtle: var(--color-sky-50);

  /* Intent Hover States */
  --color-success-hover: var(--color-green-700);
  --color-warning-hover: var(--color-orange-700);
  --color-error-hover: var(--color-rose-700);
  --color-info-hover: var(--color-sky-700);

  /* Special Purpose */
  --color-highlight: var(--color-yellow-200);      /* Highlight/Mark */
  --color-backdrop: rgba(0, 0, 0, 0.6);             /* Modal backdrop */
  --color-tooltip-bg: var(--color-gray-900);        /* Tooltip background */
}

/* Dark mode overrides */
[data-theme='dark'] {
  --color-success-subtle: var(--color-green-950);
  --color-warning-subtle: var(--color-orange-950);
  --color-error-subtle: var(--color-rose-950);
  --color-info-subtle: var(--color-sky-950);

  --color-highlight: var(--color-yellow-900);
  --color-tooltip-bg: var(--color-gray-100);
}
```

### Priority 2: Slate → Gray 통일 (Medium)

모든 `bg-slate-*` 사용을 `bg-surface-*` 또는 `bg-gray-*`로 변경:

**자동 수정 스크립트**:
```bash
# Find all slate usage
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec grep -l "slate-" {} \;

# Replace slate-50 with surface-base
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/bg-slate-50/bg-surface-base/g' {} \;

# Replace slate-100 with surface-sunken
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/bg-slate-100/bg-surface-sunken/g' {} \;

# Replace slate-200 with gray-200 (for unchecked states)
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/bg-slate-200/bg-gray-200/g' {} \;
```

### Priority 3: Intent Colors 통일 (High)

**Before**:
```tsx
<div className="bg-green-500" />  // ❌ Hardcoded
```

**After**:
```tsx
<div className="bg-success" />     // ✅ Semantic token
```

**수정 대상 파일**:
1. `src/components/dsl/Block/role/Progress.tsx`
2. `src/components/dsl/Element/Text/renderers/ProgressRenderer.tsx`
3. `src/components/dsl/Element/Text/renderers/BadgeRenderer.tsx`
4. `src/components/dsl/Element/Text/role/Badge.tsx`
5. `src/components/dsl/Element/Text/role/Alert.tsx`

### Priority 4: Component Token 정의 (Low)

Tooltip, Backdrop 등 자주 사용되는 컴포넌트는 Tier 3 (Component Tokens)로 정의:

```css
@theme {
  /* Tooltip */
  --tooltip-bg: var(--color-gray-900);
  --tooltip-text: white;
  --tooltip-radius: var(--radius-md);

  /* Backdrop (Overlay dimmed background) */
  --backdrop-bg: rgba(0, 0, 0, 0.6);
  --backdrop-blur: blur(4px);

  /* Highlight (Mark text) */
  --highlight-bg: var(--color-yellow-200);
  --highlight-text: var(--color-gray-900);
}
```

---

## 예외 허용 사례

다음 경우는 하드코딩을 허용합니다 (문서화 필요):

### 1. Decorative Gradients (장식용 그라데이션)

**파일**: `ImmersiveExample.tsx`
**코드**:
```tsx
<div className="bg-blue-500/10 rounded-full blur-[120px]" />
```

**이유**: 순수 장식 목적, 의미론적 역할 없음. Theme 변경 시 자동으로 바뀔 필요 없음.

**원칙**:
- `/* DECORATIVE: ... */` 주석 추가
- 기능에 영향 없는 순수 시각 효과만 허용

### 2. Immersive Page Background (몰입형 페이지 배경)

**파일**: `surface.ts`
**코드**:
```tsx
background = 'bg-slate-950 relative overflow-hidden before:absolute ...'
```

**이유**: 특수한 배경 효과, 일반 surface 시스템과 독립적

**원칙**:
- PageRole="Immersive"인 경우만 허용
- Theme에 `--color-immersive-bg` 추가 고려

---

## 수정 체크리스트

### Phase 1: Theme 토큰 추가
- [ ] `themes.css`에 Intent Subtle Backgrounds 추가
- [ ] `themes.css`에 Intent Hover States 추가
- [ ] `themes.css`에 Special Purpose Colors 추가
- [ ] Dark mode overrides 추가

### Phase 2: 자동 수정 스크립트 실행
- [ ] Slate → Surface 변환 스크립트 실행
- [ ] 변환 결과 수동 검증

### Phase 3: Intent Colors 수동 수정
- [ ] Progress.tsx 수정
- [ ] ProgressRenderer.tsx 수정
- [ ] BadgeRenderer.tsx 수정
- [ ] Badge.tsx 수정
- [ ] Alert.tsx 수정

### Phase 4: Component-Specific 수정
- [ ] Field styles 수정 (bg-gray-200 → bg-surface-sunken)
- [ ] Switch 수정
- [ ] Tooltip 수정 (bg-gray-900 → bg-tooltip-bg)
- [ ] DataDisplay.tsx 수정

### Phase 5: 예외 문서화
- [ ] Decorative gradient에 주석 추가
- [ ] Immersive background에 주석 추가

### Phase 6: 검증
- [ ] Light mode 테스트
- [ ] Dark mode 테스트
- [ ] Color scheme 변경 테스트 (Emerald → Blue → Purple → Red)
- [ ] 모든 Intent (Positive, Caution, Critical, Info) 테스트

---

## 통계

### 파일별 하드코딩 개수

| 파일 | 하드코딩 개수 | Priority |
|------|---------------|----------|
| `BadgeRenderer.tsx` | 12 | High |
| `ApplicationExample.tsx` | 10 | Medium |
| `Alert.tsx` | 8 | High |
| `ProgressRenderer.tsx` | 4 | High |
| `Badge.tsx` | 4 | High |
| `DocumentExample.tsx` | 4 | Medium |
| `Tooltip.tsx` | 2 | Low |
| `Progress.tsx` | 3 | High |
| 기타 | 15 | Mixed |

### 색상별 하드코딩 개수

| 색상 | 개수 | 용도 |
|------|------|------|
| `slate-*` | 15 | Surface variants |
| `gray-*` | 12 | Neutral backgrounds |
| `green-*` | 8 | Success/Positive |
| `red-*` | 8 | Error/Critical |
| `blue-*` | 6 | Info |
| `yellow-*` | 5 | Warning/Highlight |

---

## 관련 문서

- `docs/1-project/5-design-theory-spacing-separation.md` - 디자인 이론적 배경
- `src/styles/themes.css` - Theme 토큰 정의
- `tailwind.config.js` - Tailwind 설정

---

**작성자**: Claude (Token Audit Project)
**문서 버전**: 1.0
**최종 수정**: 2026-01-12
