/**
 * ID generation utilities for headless components
 *
 * ARIA 관계 속성을 위한 고유 ID 생성 유틸리티
 * @see https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/
 */

/**
 * 전역 카운터 (고유 ID 생성용)
 */
let globalIdCounter = 0;

/**
 * 고유 ID 생성
 * @param prefix - ID 접두사
 * @returns 고유한 ID 문자열
 *
 * @example
 * const id1 = generateId('menu'); // 'menu-1'
 * const id2 = generateId('menu'); // 'menu-2'
 */
export function generateId(prefix = 'id'): string {
  globalIdCounter += 1;
  return `${prefix}-${globalIdCounter}`;
}

/**
 * React useId 폴백 (React 18 미만)
 * React 18의 useId를 사용할 수 없을 때 대체용
 */
export function useIdFallback(prefix = 'id'): string {
  // 실제 구현에서는 useState로 관리
  // const [id] = useState(() => generateId(prefix));
  // return id;
  return generateId(prefix);
}

/**
 * ARIA 관계 속성용 ID 쌍 생성
 * 예: label - input, tab - tabpanel 등
 *
 * @example
 * const { sourceId, targetId } = generateRelationIds('field');
 * // { sourceId: 'field-label-1', targetId: 'field-input-1' }
 *
 * <label id={sourceId} htmlFor={targetId}>Name</label>
 * <input id={targetId} aria-labelledby={sourceId} />
 */
export function generateRelationIds(
  prefix: string
): { sourceId: string; targetId: string } {
  const baseId = generateId(prefix);
  return {
    sourceId: `${baseId}-label`,
    targetId: `${baseId}-input`,
  };
}

/**
 * 아이템 ID 생성 (리스트, 메뉴, 트리 등)
 * @param prefix - 접두사 (예: 'menu', 'tree')
 * @param index - 아이템 인덱스
 * @returns 아이템 ID
 *
 * @example
 * const itemId = generateItemId('menu', 0); // 'menu-item-0'
 * const itemId2 = generateItemId('tree', 5); // 'tree-item-5'
 */
export function generateItemId(prefix: string, index: number): string {
  return `${prefix}-item-${index}`;
}

/**
 * describedby 속성용 ID 리스트 생성
 * 여러 설명 요소를 연결할 때 사용
 *
 * @example
 * const descriptionId = generateId('description');
 * const errorId = generateId('error');
 * const describedBy = joinIds([descriptionId, errorId]); // 'description-1 error-2'
 *
 * <input aria-describedby={describedBy} />
 * <p id={descriptionId}>Field description</p>
 * <p id={errorId}>Error message</p>
 */
export function joinIds(ids: (string | undefined | null)[]): string | undefined {
  const validIds = ids.filter((id): id is string => Boolean(id));
  return validIds.length > 0 ? validIds.join(' ') : undefined;
}

/**
 * 계층 구조용 ID 생성 (트리, 중첩 메뉴 등)
 * @param prefix - 접두사
 * @param path - 경로 (예: [0, 2, 1])
 * @returns 계층적 ID
 *
 * @example
 * const nodeId = generateHierarchicalId('tree', [0, 2, 1]); // 'tree-0-2-1'
 */
export function generateHierarchicalId(prefix: string, path: number[]): string {
  return `${prefix}-${path.join('-')}`;
}
