/**
 * Prominence System - 주목도 토큰 시스템
 *
 * 핵심 원칙:
 * - 디자인을 못하는 사람도 사용 가능하도록 수학적 공식으로 정의
 * - depth (0-6) × prominence (primary/secondary/tertiary) = 자동 스타일 결정
 * - 개발자는 그룹화(Layout depth)와 주목도(prominence)만 지정
 */

export type ProminenceLevel = 'primary' | 'secondary' | 'tertiary';

/**
 * 주목도별 텍스트 투명도
 * - primary: 100% (가장 중요, 완전히 선명)
 * - secondary: 70% (보조 정보)
 * - tertiary: 50% (덜 중요한 정보)
 */
export const textOpacity: Record<ProminenceLevel, number> = {
  primary: 1.0,
  secondary: 0.7,
  tertiary: 0.5,
};

/**
 * 주목도별 폰트 weight
 * - primary: 600 (semibold)
 * - secondary: 500 (medium)
 * - tertiary: 400 (normal)
 */
export const fontWeight: Record<ProminenceLevel, number> = {
  primary: 600,
  secondary: 500,
  tertiary: 400,
};

/**
 * 주목도별 폰트 크기 배율
 * - primary: 100% (기본 크기)
 * - secondary: 87.5% (약간 작게)
 * - tertiary: 75% (더 작게)
 */
export const fontSizeScale: Record<ProminenceLevel, number> = {
  primary: 1.0,
  secondary: 0.875,
  tertiary: 0.75,
};

/**
 * 주목도별 배경 강도 (depth에 따라 달라짐)
 *
 * 공식: baseIntensity + (depth × depthMultiplier)
 * - primary: depth가 증가할수록 배경이 더 강해짐
 * - secondary: depth 영향을 덜 받음
 * - tertiary: 배경 없음 (투명)
 *
 * @param depth - Layout의 depth (0-6)
 * @param prominence - 주목도 레벨
 * @returns 배경 강도 (0-1)
 */
export function getBackgroundIntensity(
  depth: number,
  prominence: ProminenceLevel
): number {
  const config = {
    primary: { base: 0.02, depthMultiplier: 0.015 },
    secondary: { base: 0.01, depthMultiplier: 0.008 },
    tertiary: { base: 0, depthMultiplier: 0 },
  };

  const { base, depthMultiplier } = config[prominence];
  return Math.min(base + depth * depthMultiplier, 0.15); // 최대 15%
}

/**
 * 주목도별 여백/간격 배율 (Compact Density 적용)
 * - primary: 60% (조밀한 여백)
 * - secondary: 50% (더 조밀함)
 * - tertiary: 30% (최소 여백)
 */
export const spacingScale: Record<ProminenceLevel, number> = {
  primary: 0.6,
  secondary: 0.5,
  tertiary: 0.3,
};

/**
 * 주목도별 라인 높이 배율 (Compact Density 적용)
 * - primary: 1.4 (조밀한 행간)
 * - secondary: 1.3 (더 조밀한 행간)
 * - tertiary: 1.2 (최소 행간)
 */
export const lineHeightScale: Record<ProminenceLevel, number> = {
  primary: 1.4,
  secondary: 1.3,
  tertiary: 1.2,
};

/**
 * depth와 prominence에 따른 모든 스타일 값 계산
 *
 * @param depth - Layout의 depth (0-6)
 * @param prominence - 주목도 레벨
 * @returns 계산된 모든 스타일 값
 */
export function calculateProminenceStyles(
  depth: number,
  prominence: ProminenceLevel
) {
  return {
    textOpacity: textOpacity[prominence],
    fontWeight: fontWeight[prominence],
    fontSizeScale: fontSizeScale[prominence],
    backgroundIntensity: getBackgroundIntensity(depth, prominence),
    spacingScale: spacingScale[prominence],
    lineHeightScale: lineHeightScale[prominence],
  };
}

/**
 * 주목도 시스템 전체 설정
 */
export const prominenceSystem = {
  levels: ['primary', 'secondary', 'tertiary'] as const,
  textOpacity,
  fontWeight,
  fontSizeScale,
  spacingScale,
  lineHeightScale,
  getBackgroundIntensity,
  calculateProminenceStyles,
};
