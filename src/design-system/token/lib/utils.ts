/**
 * Token Utility Functions
 *
 * Branded Type 토큰을 CSS 값으로 변환하고 계산하는 유틸리티 함수들입니다.
 *
 * @example
 * ```typescript
 * // 단위 변환
 * px(Space.n8);         // "8px"
 * rem(FontSize.n16);    // "1rem"
 * percent(Opacity.n50); // "50%"
 *
 * // 계산
 * multiply(Space.n8, 2);      // 16 (SpaceToken)
 * add(Space.n8, Space.n12);   // 20 (SpaceToken)
 * ```
 */

import type {
  Brand,
  FontSizeToken,
  LineHeightToken,
  NumericToken,
  OpacityToken,
} from "./brand.ts";

// ---------------------------------
// Unit Conversion Functions
// ---------------------------------

/**
 * 숫자 토큰을 픽셀 단위 문자열로 변환합니다.
 *
 * @param value - Branded numeric token
 * @returns CSS px value (e.g., "8px")
 *
 * @example
 * ```typescript
 * px(Space.n8);      // "8px"
 * px(Size.n240);     // "240px"
 * px(FontSize.n14);  // "14px"
 * ```
 */
export function px(value: NumericToken): string {
  return `${value}px`;
}

/**
 * FontSize 토큰을 rem 단위 문자열로 변환합니다.
 *
 * @param value - FontSizeToken (16px = 1rem 기준)
 * @returns CSS rem value (e.g., "1rem")
 *
 * @example
 * ```typescript
 * rem(FontSize.n16);  // "1rem"
 * rem(FontSize.n14);  // "0.875rem"
 * rem(FontSize.n20);  // "1.25rem"
 * ```
 */
export function rem(value: FontSizeToken): string {
  return `${value / 16}rem`;
}

/**
 * Opacity 토큰을 퍼센트 문자열로 변환합니다.
 *
 * @param value - OpacityToken (0-100 스케일)
 * @returns CSS percentage (e.g., "50%")
 *
 * @example
 * ```typescript
 * percent(Opacity.n50);   // "50%"
 * percent(Opacity.n100);  // "100%"
 * ```
 */
export function percent(value: OpacityToken): string {
  return `${value}%`;
}

/**
 * Opacity 토큰을 0-1 사이 소수로 변환합니다.
 *
 * @param value - OpacityToken (0-100 스케일)
 * @returns CSS opacity value (e.g., 0.5)
 *
 * @example
 * ```typescript
 * opacity(Opacity.n50);   // 0.5
 * opacity(Opacity.n75);   // 0.75
 * opacity(Opacity.n100);  // 1
 * ```
 */
export function opacity(value: OpacityToken): number {
  return value / 100;
}

/**
 * LineHeight 토큰을 소수로 변환합니다.
 *
 * @param value - LineHeightToken (100 = 1.0, 150 = 1.5)
 * @returns CSS line-height value (e.g., 1.5)
 *
 * @example
 * ```typescript
 * lineHeight(LineHeight.n150);  // 1.5
 * lineHeight(LineHeight.n120);  // 1.2
 * ```
 */
export function lineHeight(value: LineHeightToken): number {
  return value / 100;
}

// ---------------------------------
// Arithmetic Helper Functions
// ---------------------------------

/**
 * 토큰 값에 숫자를 곱합니다.
 *
 * @param value - Branded token
 * @param factor - 곱할 숫자
 * @returns 계산된 값 (동일한 Brand 타입 유지)
 *
 * @example
 * ```typescript
 * multiply(Space.n8, 2);   // 16 (SpaceToken)
 * multiply(Size.n40, 1.5); // 60 (SizeToken)
 * ```
 */
export function multiply<T extends Brand<number, string>>(
  value: T,
  factor: number,
): T {
  return (value * factor) as T;
}

/**
 * 두 토큰 값을 더합니다.
 *
 * @param a - 첫 번째 토큰
 * @param b - 두 번째 토큰 (같은 타입)
 * @returns 합계 (동일한 Brand 타입 유지)
 *
 * @example
 * ```typescript
 * add(Space.n8, Space.n12);  // 20 (SpaceToken)
 * add(Size.n40, Size.n8);    // 48 (SizeToken)
 * ```
 */
export function add<T extends Brand<number, string>>(a: T, b: T): T {
  return (a + b) as T;
}

/**
 * 두 토큰 값을 뺍니다.
 *
 * @param a - 첫 번째 토큰
 * @param b - 두 번째 토큰 (같은 타입)
 * @returns 차이 (동일한 Brand 타입 유지)
 *
 * @example
 * ```typescript
 * subtract(Space.n16, Space.n8);  // 8 (SpaceToken)
 * subtract(Size.n40, Size.n12);   // 28 (SizeToken)
 * ```
 */
export function subtract<T extends Brand<number, string>>(a: T, b: T): T {
  return (a - b) as T;
}

/**
 * 토큰 값을 나눕니다.
 *
 * @param value - Branded token
 * @param divisor - 나눌 숫자
 * @returns 계산된 값 (동일한 Brand 타입 유지)
 *
 * @example
 * ```typescript
 * divide(Space.n16, 2);  // 8 (SpaceToken)
 * divide(Size.n40, 4);   // 10 (SizeToken)
 * ```
 */
export function divide<T extends Brand<number, string>>(
  value: T,
  divisor: number,
): T {
  return (value / divisor) as T;
}

// ---------------------------------
// Comparison Helper Functions
// ---------------------------------

/**
 * 두 토큰 값 중 큰 값을 반환합니다.
 *
 * @param a - 첫 번째 토큰
 * @param b - 두 번째 토큰 (같은 타입)
 * @returns 더 큰 값 (동일한 Brand 타입 유지)
 *
 * @example
 * ```typescript
 * max(Space.n8, Space.n12);  // 12 (SpaceToken)
 * ```
 */
export function max<T extends Brand<number, string>>(a: T, b: T): T {
  return (Math.max(a, b) as T);
}

/**
 * 두 토큰 값 중 작은 값을 반환합니다.
 *
 * @param a - 첫 번째 토큰
 * @param b - 두 번째 토큰 (같은 타입)
 * @returns 더 작은 값 (동일한 Brand 타입 유지)
 *
 * @example
 * ```typescript
 * min(Space.n8, Space.n12);  // 8 (SpaceToken)
 * ```
 */
export function min<T extends Brand<number, string>>(a: T, b: T): T {
  return (Math.min(a, b) as T);
}

/**
 * 토큰 값을 범위 내로 제한합니다.
 *
 * @param value - 제한할 값
 * @param minValue - 최소값
 * @param maxValue - 최대값
 * @returns 범위 내 값 (동일한 Brand 타입 유지)
 *
 * @example
 * ```typescript
 * clamp(Space.n20, Space.n8, Space.n16);  // 16 (SpaceToken)
 * ```
 */
export function clamp<T extends Brand<number, string>>(
  value: T,
  minValue: T,
  maxValue: T,
): T {
  return (Math.max(minValue, Math.min(maxValue, value)) as T);
}
