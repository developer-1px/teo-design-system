/**
 * Design Token Types
 *
 * themes.css 파싱 결과를 나타내는 타입 정의
 */

export type TokenTier = 'primitive' | 'semantic' | 'component';
export type TokenType = 'color' | 'spacing' | 'radius' | 'shadow' | 'other';

/**
 * 개별 토큰 정보
 */
export interface Token {
  name: string; // --color-gray-50
  value: string; // #fafafa 또는 var(--color-gray-100)
  resolvedValue: string; // var() 해석된 최종 값
  tier: TokenTier;
  type: TokenType;
  category?: string; // gray, emerald, surface, text 등
  description?: string; // 주석에서 추출한 설명
}

/**
 * 토큰 카테고리 (그룹화된 토큰들)
 */
export interface TokenCategory {
  name: string; // "Gray Scale", "Surface", "Spacing" 등
  tier: TokenTier;
  type: TokenType;
  tokens: Token[];
  description?: string; // 카테고리 설명
}
