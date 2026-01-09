/**
 * Design System Tokens
 *
 * 모든 디자인 값의 단일 진실 공급원 (Single Source of Truth)
 * 이 파일의 값만 사용하여 일관성을 보장합니다.
 *
 * @see DESIGN_PRINCIPLES.md
 */

// =============================================================================
// COLORS
// =============================================================================

/**
 * Accent Color - 화면당 1-2개소만 사용
 * Primary CTA, 선택 상태, 포커스에만 사용
 */
export const accent = {
  DEFAULT: '#10b981',
  hover: '#059669',
  active: '#047857',
  subtle: '#d1fae5', // 선택된 배경용
} as const;

/**
 * Layer System Colors
 * PRINCIPLE: Layer 2-5는 같은 색상, 그림자로 깊이 표현
 */
export const layer = {
  0: '#fafafa', // App background
  1: '#f5f5f5', // Sunken (input, terminal)
  2: '#ffffff', // Surface (panel, sidebar)
  3: '#ffffff', // Elevated (card, hover)
  4: '#ffffff', // Floating (dropdown, tooltip)
  5: '#ffffff', // Modal (dialog, notification)
} as const;

/**
 * Text Colors - 3단계만 허용
 */
export const text = {
  primary: '#171717',
  secondary: '#525252',
  tertiary: '#a3a3a3',
  inverse: '#ffffff',
} as const;

/**
 * Border Colors - 최소한으로만 사용
 * PRINCIPLE: 면(surface)으로 먼저 구분 시도, 선은 예외적으로만
 */
export const border = {
  DEFAULT: '#e5e5e5',
  subtle: '#f5f5f5',
} as const;

/**
 * Semantic Colors - 의미가 있을 때만 사용
 * 장식용 사용 금지
 */
export const semantic = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

/**
 * Shadow System
 * PRINCIPLE: 그림자 = 물리적 높이 = 중요도/임시성
 *
 * NEVER: 버튼, 뱃지, 태그 등 인라인 요소에 사용
 * NEVER: border + shadow 동시 사용
 */
export const shadow = {
  0: 'none',
  1: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
  2: '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
  3: '0 4px 16px -4px rgba(0, 0, 0, 0.08)',
  4: '0 8px 32px -8px rgba(0, 0, 0, 0.15)',
} as const;

// =============================================================================
// SPACING
// =============================================================================

/**
 * Spacing Scale - 허용된 값만 사용
 * 다른 값 사용 시 린트 에러
 */
export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  24: '96px',
} as const;

/**
 * Spacing 용도별 가이드
 */
export const spacingGuide = {
  iconText: spacing[1], // 4px - 아이콘-텍스트 간격
  inlineGroup: spacing[2], // 8px - 관련 요소 그룹
  formElement: spacing[3], // 12px - 폼 요소
  cardPadding: spacing[4], // 16px - 카드 내부
  sectionInner: spacing[6], // 24px - 섹션 내 간격
  sectionOuter: spacing[8], // 32px - 섹션 간 간격
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Font Weights - 3가지만 허용
 * 300 이하, 700 이상 사용 금지
 */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

/**
 * Font Sizes - 6가지만 허용
 * PRINCIPLE: 한 화면에 3-4가지까지만 사용
 */
export const fontSize = {
  xs: '12px', // 라벨, 캡션, 메타 정보
  sm: '13px', // 코드
  base: '14px', // 본문
  lg: '16px', // 소제목, 강조 본문
  xl: '20px', // 제목
  '2xl': '24px', // 페이지 제목
} as const;

/**
 * Line Heights - font size와 매칭
 */
export const lineHeight = {
  xs: '16px',
  sm: '18px',
  base: '20px',
  lg: '24px',
  xl: '28px',
  '2xl': '32px',
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

/**
 * Border Radius - 일관된 모서리
 */
export const borderRadius = {
  sm: '4px',
  DEFAULT: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
} as const;

// =============================================================================
// Z-INDEX
// =============================================================================

/**
 * Z-Index - Layer 시스템과 매칭
 */
export const zIndex = {
  0: 0,
  1: 10,
  2: 20,
  3: 30,
  4: 40,
  5: 50,
} as const;

// =============================================================================
// ICONS
// =============================================================================

/**
 * Icon Sizes - 3가지만 허용
 */
export const iconSize = {
  sm: 16, // 인라인, 인풋 내부
  md: 20, // 버튼, 메뉴 아이템
  lg: 24, // 네비게이션, 강조
} as const;

// =============================================================================
// COMPONENT SIZES
// =============================================================================

/**
 * Button Heights
 */
export const buttonHeight = {
  sm: '28px', // h-7
  md: '36px', // h-9
  lg: '44px', // h-11
} as const;

/**
 * Input Heights
 */
export const inputHeight = {
  sm: '28px',
  md: '36px',
  lg: '44px',
} as const;

// =============================================================================
// TRANSITIONS
// =============================================================================

/**
 * Transition Durations
 */
export const duration = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const;

/**
 * Transition Easings
 */
export const easing = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * 허용된 spacing 값인지 확인
 */
export function isValidSpacing(value: number): boolean {
  const validValues = [4, 8, 12, 16, 24, 32, 48, 64, 96];
  return validValues.includes(value);
}

/**
 * 허용된 font-weight인지 확인
 */
export function isValidFontWeight(value: number): boolean {
  return value === 400 || value === 500 || value === 600;
}

/**
 * 허용된 icon size인지 확인
 */
export function isValidIconSize(value: number): boolean {
  return value === 16 || value === 20 || value === 24;
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type AccentColor = keyof typeof accent;
export type LayerLevel = keyof typeof layer;
export type TextColor = keyof typeof text;
export type SemanticColor = keyof typeof semantic;
export type ShadowLevel = keyof typeof shadow;
export type SpacingSize = keyof typeof spacing;
export type FontWeight = keyof typeof fontWeight;
export type FontSize = keyof typeof fontSize;
export type IconSize = keyof typeof iconSize;
