/**
 * JSON to TypeScript Interface Converter
 *
 * JSON 데이터를 분석하여 TypeScript interface를 생성합니다.
 * https://transform.tools/json-to-typescript 와 유사한 기능
 */

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface TypeInfo {
  type: string;
  isOptional: boolean;
  isArray: boolean;
  arrayItemType?: string;
  nestedInterface?: string;
}

/**
 * JSON 값의 TypeScript 타입 추론
 */
function inferType(value: JsonValue, key: string, interfaceNames: Set<string>): TypeInfo {
  // null
  if (value === null) {
    return { type: 'null', isOptional: true, isArray: false };
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: 'any[]', isOptional: false, isArray: true };
    }

    // 배열 요소들의 타입 분석
    const itemTypes = new Set<string>();
    let hasObject = false;
    let firstObject: JsonObject | null = null;

    for (const item of value) {
      if (item === null) {
        itemTypes.add('null');
      } else if (Array.isArray(item)) {
        itemTypes.add('any[]');
      } else if (typeof item === 'object') {
        hasObject = true;
        if (!firstObject) firstObject = item;
        itemTypes.add('object');
      } else {
        itemTypes.add(typeof item);
      }
    }

    // 배열이 모두 객체인 경우 → nested interface
    if (hasObject && itemTypes.size === 1 && firstObject) {
      const interfaceName = capitalize(key) + 'Item';
      return {
        type: interfaceName + '[]',
        isOptional: false,
        isArray: true,
        arrayItemType: interfaceName,
        nestedInterface: generateInterface(interfaceName, firstObject, interfaceNames),
      };
    }

    // Mixed types
    if (itemTypes.size > 1) {
      const typeUnion = Array.from(itemTypes).join(' | ');
      return { type: `(${typeUnion})[]`, isOptional: false, isArray: true };
    }

    // Single type
    const singleType = Array.from(itemTypes)[0];
    return { type: `${singleType}[]`, isOptional: false, isArray: true };
  }

  // Object
  if (typeof value === 'object') {
    const interfaceName = capitalize(key);
    return {
      type: interfaceName,
      isOptional: false,
      isArray: false,
      nestedInterface: generateInterface(interfaceName, value as JsonObject, interfaceNames),
    };
  }

  // Primitives
  return { type: typeof value, isOptional: false, isArray: false };
}

/**
 * 문자열 첫 글자 대문자화
 */
function capitalize(str: string): string {
  if (!str) return 'Item';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Interface 이름 중복 제거
 */
function getUniqueInterfaceName(baseName: string, usedNames: Set<string>): string {
  let name = baseName;
  let counter = 1;
  while (usedNames.has(name)) {
    name = `${baseName}${counter}`;
    counter++;
  }
  usedNames.add(name);
  return name;
}

/**
 * 단일 객체에서 Interface 생성
 */
function generateInterface(
  interfaceName: string,
  obj: JsonObject,
  interfaceNames: Set<string>
): string {
  const uniqueName = getUniqueInterfaceName(interfaceName, interfaceNames);
  const fields: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const typeInfo = inferType(value, key, interfaceNames);
    const optionalMarker = typeInfo.isOptional ? '?' : '';
    fields.push(`  ${key}${optionalMarker}: ${typeInfo.type};`);

    // Nested interface가 있으면 추가
    if (typeInfo.nestedInterface) {
      fields.push('');
      fields.push(typeInfo.nestedInterface);
      fields.push('');
    }
  }

  return `export interface ${uniqueName} {\n${fields.join('\n')}\n}`;
}

/**
 * 여러 객체를 분석하여 공통 interface 생성
 */
function generateInterfaceFromArray(
  interfaceName: string,
  array: JsonArray,
  interfaceNames: Set<string>
): string {
  if (array.length === 0) {
    return `export interface ${interfaceName} {\n  // Empty array\n}`;
  }

  // 모든 객체의 키 수집
  const allKeys = new Set<string>();
  const keyTypes = new Map<string, Set<string>>();

  for (const item of array) {
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      const obj = item as JsonObject;
      for (const [key, value] of Object.entries(obj)) {
        allKeys.add(key);

        if (!keyTypes.has(key)) {
          keyTypes.set(key, new Set());
        }

        const typeInfo = inferType(value, key, interfaceNames);
        keyTypes.get(key)!.add(typeInfo.type);
      }
    }
  }

  // Interface 생성
  const uniqueName = getUniqueInterfaceName(interfaceName, interfaceNames);
  const fields: string[] = [];
  const nestedInterfaces: string[] = [];

  for (const key of Array.from(allKeys).sort()) {
    const types = keyTypes.get(key)!;
    const typeUnion = Array.from(types).join(' | ');

    // 모든 아이템에 키가 존재하는지 확인
    const itemsWithKey = array.filter(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        !Array.isArray(item) &&
        key in (item as JsonObject)
    ).length;
    const isOptional = itemsWithKey < array.length;

    fields.push(`  ${key}${isOptional ? '?' : ''}: ${typeUnion};`);

    // Nested interfaces 수집 (첫 번째 아이템 기준)
    const firstItem = array[0];
    if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
      const obj = firstItem as JsonObject;
      const value = obj[key];
      if (value !== undefined) {
        const typeInfo = inferType(value, key, interfaceNames);
        if (typeInfo.nestedInterface) {
          nestedInterfaces.push(typeInfo.nestedInterface);
        }
      }
    }
  }

  let result = `export interface ${uniqueName} {\n${fields.join('\n')}\n}`;

  // Nested interfaces 추가
  if (nestedInterfaces.length > 0) {
    result = nestedInterfaces.join('\n\n') + '\n\n' + result;
  }

  return result;
}

/**
 * JSON을 TypeScript interface로 변환 (메인 함수)
 */
export function jsonToTypeScript(json: JsonValue, rootName: string = 'Root'): string {
  const interfaceNames = new Set<string>();

  try {
    // Array인 경우
    if (Array.isArray(json)) {
      return generateInterfaceFromArray(rootName, json, interfaceNames);
    }

    // Object인 경우
    if (typeof json === 'object' && json !== null) {
      return generateInterface(rootName, json as JsonObject, interfaceNames);
    }

    // Primitive인 경우
    return `// Primitive type: ${typeof json}\nexport type ${rootName} = ${typeof json};`;
  } catch (error) {
    console.error('[jsonToTypeScript] Error:', error);
    return `// Error generating TypeScript interface\n// ${error}`;
  }
}

/**
 * JSON 문자열을 TypeScript interface로 변환
 */
export function jsonStringToTypeScript(jsonString: string, rootName: string = 'Root'): string {
  try {
    const parsed = JSON.parse(jsonString);
    return jsonToTypeScript(parsed, rootName);
  } catch (error) {
    return `// Invalid JSON\n// ${error}`;
  }
}
