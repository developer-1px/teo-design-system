# ButtonSize & InputSize 구현 완료

**Date**: 2026-01-18
**Tags**: `#2tier-tokens` `#button-size` `#input-size` `#implementation`
**Status**: Implemented

---

## 구현 내용

### 1. ButtonSize (2-Tier Composite Token)

**파일**: `src/design-system/token/token.const.2tier.ts`

**구조**:
```typescript
export const ButtonSizeScale = ["xs", "sm", "md", "lg", "xl"] as const;
export type ButtonSizeScale = (typeof ButtonSizeScale)[number];
export type ButtonSizeKey = ButtonSizeScale;

export const ButtonSize = {
  xs: {
    height: Size.n24,       // 24px
    icon: IconSize.n14,     // 14px
    padding: Space.n6,      // 6px
    fontSize: FontSize.n12, // 12px
  },
  sm: {
    height: Size.n32,       // 32px
    icon: IconSize.n16,     // 16px
    padding: Space.n8,      // 8px
    fontSize: FontSize.n13, // 13px
  },
  md: {
    height: Size.n40,       // 40px
    icon: IconSize.n20,     // 20px
    padding: Space.n12,     // 12px
    fontSize: FontSize.n14, // 14px
  },
  lg: {
    height: Size.n48,       // 48px
    icon: IconSize.n24,     // 24px
    padding: Space.n16,     // 16px
    fontSize: FontSize.n16, // 16px
  },
  xl: {
    height: Size.n56,       // 56px
    icon: IconSize.n28,     // 28px
    padding: Space.n20,     // 20px
    fontSize: FontSize.n18, // 18px
  },
} as const;

export type ButtonSizeToken = keyof typeof ButtonSize;
```

**특징**:
- ActionSize보다 padding이 약간 더 큼 (md 기준: Action 10px vs Button 12px)
- Button은 텍스트 레이블이 주로 있어서 좌우 여백이 더 필요
- 5가지 크기 제공: xs, sm, md, lg, xl

---

### 2. InputSize (2-Tier Composite Token)

**파일**: `src/design-system/token/token.const.2tier.ts`

**구조**:
```typescript
export const InputSizeScale = ["sm", "md", "lg"] as const;
export type InputSizeScale = (typeof InputSizeScale)[number];
export type InputSizeKey = InputSizeScale;

export const InputSize = {
  sm: {
    height: Size.n32,       // 32px
    padding: Space.n8,      // 8px
    fontSize: FontSize.n13, // 13px
    iconSize: IconSize.n16, // 16px
  },
  md: {
    height: Size.n40,       // 40px
    padding: Space.n12,     // 12px
    fontSize: FontSize.n14, // 14px
    iconSize: IconSize.n20, // 20px
  },
  lg: {
    height: Size.n48,       // 48px
    padding: Space.n16,     // 16px
    fontSize: FontSize.n16, // 16px
    iconSize: IconSize.n24, // 24px
  },
} as const;

export type InputSizeToken = keyof typeof InputSize;
```

**특징**:
- 3가지 크기만 제공: sm, md, lg (xs, xl은 입력 필드에 잘 사용되지 않음)
- padding이 ButtonSize와 동일 (폼 일관성)
- iconSize 포함 (왼쪽/오른쪽 아이콘 지원)

---

## 사용 예시

### ButtonSize 사용

```typescript
import { ButtonSize } from "@/design-system/token/token.const.2tier";
import { Frame } from "@/design-system/Frame/Frame";
import { Text } from "@/design-system/text/Text";

// Example 1: Button with md size
<Frame
  as="button"
  override={{
    h: ButtonSize.md.height,          // 40px
    px: ButtonSize.md.padding,        // 12px
  }}
  surface="primary"
  rounded={Radius2.md}
>
  <Text size={ButtonSize.md.fontSize}>
    Save Changes
  </Text>
</Frame>

// Example 2: Icon Button
<Frame
  as="button"
  override={{
    h: ButtonSize.sm.height,          // 32px
    w: ButtonSize.sm.height,          // 32px (square)
  }}
  surface="ghost"
  rounded={Radius2.full}
>
  <Icon size={ButtonSize.sm.icon} />  // 16px
</Frame>

// Example 3: Large Primary Button
<Frame
  as="button"
  override={{
    h: ButtonSize.lg.height,          // 48px
    px: ButtonSize.lg.padding,        // 16px
  }}
  surface="primary"
  rounded={Radius2.lg}
>
  <Icon size={ButtonSize.lg.icon} />  // 24px
  <Text size={ButtonSize.lg.fontSize}>
    Get Started
  </Text>
</Frame>
```

---

### InputSize 사용

```typescript
import { InputSize } from "@/design-system/token/token.const.2tier";
import { Frame } from "@/design-system/Frame/Frame";

// Example 1: Text Input with md size
<Frame
  as="input"
  override={{
    h: InputSize.md.height,           // 40px
    px: InputSize.md.padding,         // 12px
  }}
  surface="base"
  rounded={Radius2.md}
  style={{
    fontSize: InputSize.md.fontSize,  // 14px
  }}
/>

// Example 2: Input with Left Icon
<Frame override={{ position: "relative" }}>
  <Icon
    size={InputSize.md.iconSize}      // 20px
    style={{
      position: "absolute",
      left: InputSize.md.padding,     // 12px
    }}
  />
  <Frame
    as="input"
    override={{
      h: InputSize.md.height,         // 40px
      pl: Space.n40,                  // 40px (icon + padding)
      pr: InputSize.md.padding,       // 12px
    }}
    surface="base"
    rounded={Radius2.md}
    style={{
      fontSize: InputSize.md.fontSize, // 14px
    }}
  />
</Frame>

// Example 3: Large Search Input
<Frame
  as="input"
  override={{
    h: InputSize.lg.height,           // 48px
    px: InputSize.lg.padding,         // 16px
  }}
  surface="base"
  rounded={Radius2.lg}
  style={{
    fontSize: InputSize.lg.fontSize,  // 16px
  }}
  placeholder="Search..."
/>
```

---

## ActionSize vs ButtonSize vs InputSize 비교

| Size | Component | Height | Padding | Icon | Font Size |
|------|-----------|--------|---------|------|-----------|
| **xs** | ActionSize | 24px | 6px | 14px | 12px |
| **xs** | ButtonSize | 24px | 6px | 14px | 12px |
| **sm** | ActionSize | 32px | 8px | 16px | 13px |
| **sm** | ButtonSize | 32px | 8px | 16px | 13px |
| **sm** | InputSize | 32px | 8px | 16px | 13px |
| **md** | ActionSize | 40px | **10px** | 20px | 14px |
| **md** | ButtonSize | 40px | **12px** | 20px | 14px |
| **md** | InputSize | 40px | **12px** | 20px | 14px |
| **lg** | ActionSize | 48px | 12px | 24px | 16px |
| **lg** | ButtonSize | 48px | 16px | 24px | 16px |
| **lg** | InputSize | 48px | 16px | 24px | 16px |
| **xl** | ActionSize | 56px | 16px | 28px | 18px |
| **xl** | ButtonSize | 56px | 20px | 28px | 18px |

**주요 차이점**:
- **ActionSize**: Icon-only action에 최적화 (padding 작음)
- **ButtonSize**: Text button에 최적화 (padding 큼)
- **InputSize**: Form field에 최적화 (sm, md, lg만 제공)

---

## 타입 안전성

모든 토큰은 **Branded Type**을 통해 타입 안전성 보장:

```typescript
// ✅ OK: 올바른 토큰 사용
const buttonHeight = ButtonSize.md.height;  // SizeToken

// ❌ Error: 임의의 숫자 사용 불가
const buttonHeight = 40;  // Type 'number' is not assignable to type 'SizeToken'

// ❌ Error: 다른 토큰 타입 사용 불가
const buttonHeight = Space.n40;  // Type 'SpaceToken' is not assignable to type 'SizeToken'
```

---

## 다음 단계

### 즉시 구현 가능
1. **AvatarSize** - 아바타 컴포넌트 크기 토큰
2. **BadgeSize** - 뱃지/태그 크기 토큰
3. **SpacingScale** - T-shirt sizing으로 spacing 추상화

### 중기 구현
4. **Elevation** - Shadow + Z-Index 조합
5. **TypographyStyle** - Prose CSS vars의 TypeScript 버전

---

## 구현 완료 체크리스트

- [x] ButtonSize 2차 토큰 추가 (xs, sm, md, lg, xl)
- [x] InputSize 2차 토큰 추가 (sm, md, lg)
- [x] TypeScript 타입 정의 (Scale, Key, Token)
- [x] 1차 토큰 확인 (모두 존재, 추가 작업 불필요)
- [x] 타입 체크 통과 (기존 프로젝트 에러와 무관)
- [x] 사용 예시 문서 작성

---

## 참고

- 구현 파일: `src/design-system/token/token.const.2tier.ts:60-130`
- 1차 토큰 파일: `src/design-system/token/token.const.1tier.ts`
- 업계 표준 문서: `docs/claude/2026-01-18/01-[2tier-tokens]industry-standard-composite-patterns.md`
