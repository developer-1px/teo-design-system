/**
 * CSS Token Parser
 *
 * themes.css를 파싱하여 Design Token을 추출하고 분류합니다.
 */

import type { Token, TokenCategory, TokenTier, TokenType } from './types';

/**
 * CSS custom property를 추출하는 정규식
 * --token-name: value; 패턴 매칭
 */
const TOKEN_REGEX = /--([\w-]+):\s*([^;]+);/g;

/**
 * var() 참조를 추출하는 정규식
 * var(--token-name) 패턴 매칭
 */
const VAR_REF_REGEX = /var\((--[\w-]+)\)/g;

/**
 * Tier 주석을 감지하는 정규식
 */
const TIER_COMMENT_REGEX = /\/\*\s*={10,}\s*TIER\s+(\d):\s+([^=]+)={10,}\s*\*\//;

/**
 * 카테고리 주석을 감지하는 정규식
 * Example: /＊ Gray Scale (Neutral) ＊/ 패턴
 */
const CATEGORY_COMMENT_REGEX = /\/\*\s*([^*]+?)\s*\*\//;

/**
 * 토큰 이름에서 타입을 추론
 */
function inferTokenType(name: string): TokenType {
  if (name.startsWith('--color-')) return 'color';
  if (name.startsWith('--spacing-')) return 'spacing';
  if (name.startsWith('--radius-')) return 'radius';
  if (name.startsWith('--shadow-')) return 'shadow';
  if (
    name.startsWith('--button-') ||
    name.startsWith('--input-') ||
    name.startsWith('--panel-') ||
    name.startsWith('--card-') ||
    name.startsWith('--focus-')
  )
    return 'other';
  return 'other';
}

/**
 * 토큰 이름에서 카테고리를 추출
 * --color-gray-50 → gray
 * --color-surface-base → surface
 */
function extractCategory(name: string): string {
  const parts = name.split('-').slice(1); // -- 제거
  if (parts.length >= 2) {
    return parts[1]; // color-gray, spacing-0 등에서 두 번째 부분
  }
  return parts[0] || 'other';
}

/**
 * Tier 번호를 Tier 타입으로 변환
 */
function tierNumberToType(num: number): TokenTier {
  switch (num) {
    case 1:
      return 'primitive';
    case 2:
      return 'semantic';
    case 3:
      return 'component';
    default:
      return 'primitive';
  }
}

/**
 * var() 참조를 해석하여 실제 값으로 변환
 */
function resolveVarReferences(value: string, tokenMap: Map<string, Token>): string {
  let resolved = value;
  let iterations = 0;
  const maxIterations = 10; // 순환 참조 방지

  while (VAR_REF_REGEX.test(resolved) && iterations < maxIterations) {
    resolved = resolved.replace(VAR_REF_REGEX, (match, tokenName) => {
      const referencedToken = tokenMap.get(tokenName);
      if (referencedToken) {
        return referencedToken.value;
      }
      return match; // 해석 불가능하면 원본 유지
    });
    VAR_REF_REGEX.lastIndex = 0; // 정규식 리셋
    iterations++;
  }

  return resolved;
}

/**
 * CSS 내용을 파싱하여 TokenCategory 배열로 변환
 */
export function parseCSSTokens(cssContent: string): TokenCategory[] {
  // 1. @theme 블록 추출
  const themeBlockMatch = cssContent.match(/@theme\s*{([^}]+(?:{[^}]*}[^}]*)*)}/s);
  if (!themeBlockMatch) {
    console.warn('[cssParser] @theme block not found');
    return [];
  }

  const themeBlock = themeBlockMatch[1];
  const lines = themeBlock.split('\n');

  // 2. 토큰 추출 및 임시 저장
  let currentTier: TokenTier = 'primitive';
  let currentCategoryName = '';
  const tokens: Token[] = [];
  const tokenMap = new Map<string, Token>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Tier 주석 감지
    const tierMatch = line.match(TIER_COMMENT_REGEX);
    if (tierMatch) {
      const tierNum = parseInt(tierMatch[1], 10);
      currentTier = tierNumberToType(tierNum);
      currentCategoryName = tierMatch[2].trim();
      continue;
    }

    // 카테고리 주석 감지 (/* Gray Scale (Neutral) */)
    const categoryMatch = line.match(CATEGORY_COMMENT_REGEX);
    if (categoryMatch && !line.includes('=====')) {
      currentCategoryName = categoryMatch[1].trim();
      continue;
    }

    // 토큰 추출
    TOKEN_REGEX.lastIndex = 0;
    const tokenMatch = TOKEN_REGEX.exec(line);
    if (tokenMatch) {
      const name = `--${tokenMatch[1]}`;
      const value = tokenMatch[2].trim();
      const type = inferTokenType(name);
      const category = extractCategory(name);

      // 다음 줄의 주석을 description으로
      let description = '';
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        const descMatch = nextLine.match(/\/\*\s*([^*]+)\s*\*\//);
        if (descMatch) {
          description = descMatch[1].trim();
        }
      }

      const token: Token = {
        name,
        value,
        resolvedValue: value, // 나중에 해석
        tier: currentTier,
        type,
        category,
        description: description || currentCategoryName,
      };

      tokens.push(token);
      tokenMap.set(name, token);
    }
  }

  // 3. var() 참조 해석
  for (const token of tokens) {
    token.resolvedValue = resolveVarReferences(token.value, tokenMap);
  }

  // 4. 카테고리별로 그룹화
  const categoryMap = new Map<string, Token[]>();

  for (const token of tokens) {
    const key = `${token.tier}-${token.category}`;
    if (!categoryMap.has(key)) {
      categoryMap.set(key, []);
    }
    categoryMap.get(key)!.push(token);
  }

  // 5. TokenCategory 배열로 변환
  const categories: TokenCategory[] = [];

  for (const [key, categoryTokens] of categoryMap.entries()) {
    if (categoryTokens.length === 0) continue;

    const firstToken = categoryTokens[0];
    const categoryName = generateCategoryName(firstToken.category, firstToken.type);

    categories.push({
      name: categoryName,
      tier: firstToken.tier,
      type: firstToken.type,
      tokens: categoryTokens.sort((a, b) => a.name.localeCompare(b.name)),
      description: firstToken.description,
    });
  }

  // Tier → 타입 → 이름 순으로 정렬
  return categories.sort((a, b) => {
    const tierOrder = { primitive: 1, semantic: 2, component: 3 };
    if (tierOrder[a.tier] !== tierOrder[b.tier]) {
      return tierOrder[a.tier] - tierOrder[b.tier];
    }
    const typeOrder = { color: 1, spacing: 2, radius: 3, shadow: 4, other: 5 };
    if (typeOrder[a.type] !== typeOrder[b.type]) {
      return typeOrder[a.type] - typeOrder[b.type];
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * 카테고리 표시 이름 생성
 */
function generateCategoryName(category: string, type: TokenType): string {
  // 특별한 카테고리 이름 매핑
  const specialNames: Record<string, string> = {
    gray: 'Gray Scale',
    emerald: 'Emerald (Primary)',
    blue: 'Blue (Alternative)',
    purple: 'Purple (Alternative)',
    red: 'Red (Alternative)',
    green: 'Green (Semantic)',
    orange: 'Orange (Semantic)',
    rose: 'Rose (Semantic)',
    sky: 'Sky (Semantic)',
    surface: 'Surface (Backgrounds)',
    text: 'Text Colors',
    border: 'Border Colors',
    primary: 'Primary (Brand)',
    accent: 'Accent (Alias)',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    info: 'Info',
    hover: 'Interactive States',
    button: 'Button Tokens',
    input: 'Input Tokens',
    panel: 'Panel Tokens',
    card: 'Card Tokens',
    focus: 'Focus Ring',
  };

  if (specialNames[category]) {
    return specialNames[category];
  }

  // 기본: 카테고리 이름 capitalize
  if (type === 'spacing') return 'Spacing';
  if (type === 'radius') return 'Border Radius';
  if (type === 'shadow') return 'Shadows';

  return category.charAt(0).toUpperCase() + category.slice(1);
}
