type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface TypeInfo {
  type: string;
  isArray: boolean;
  isOptional: boolean;
  properties?: Map<string, TypeInfo>;
}

/**
 * Infer TypeScript type from JSON value
 */
function inferType(value: JsonValue, key?: string): TypeInfo {
  // null
  if (value === null) {
    return { type: 'null', isArray: false, isOptional: true };
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: 'unknown', isArray: true, isOptional: false };
    }

    // Analyze all items to get unified type
    const itemTypes = value.map((item) => inferType(item));
    const mergedType = mergeTypes(itemTypes);

    return {
      ...mergedType,
      isArray: true,
    };
  }

  // Object
  if (typeof value === 'object') {
    const properties = new Map<string, TypeInfo>();

    for (const [key, val] of Object.entries(value)) {
      properties.set(key, inferType(val, key));
    }

    return {
      type: 'object',
      isArray: false,
      isOptional: false,
      properties,
    };
  }

  // Primitives
  if (typeof value === 'string') {
    return { type: 'string', isArray: false, isOptional: false };
  }
  if (typeof value === 'number') {
    return { type: 'number', isArray: false, isOptional: false };
  }
  if (typeof value === 'boolean') {
    return { type: 'boolean', isArray: false, isOptional: false };
  }

  return { type: 'unknown', isArray: false, isOptional: false };
}

/**
 * Merge multiple type infos into one (for array items)
 */
function mergeTypes(types: TypeInfo[]): TypeInfo {
  if (types.length === 0) {
    return { type: 'unknown', isArray: false, isOptional: false };
  }

  if (types.length === 1) {
    return types[0];
  }

  // Check if all types are the same
  const firstType = types[0];
  const allSame = types.every(
    (t) => t.type === firstType.type && t.isArray === firstType.isArray
  );

  if (allSame && firstType.type === 'object' && firstType.properties) {
    // Merge object properties
    const mergedProps = new Map<string, TypeInfo>();
    const allKeys = new Set<string>();

    types.forEach((t) => {
      if (t.properties) {
        t.properties.forEach((_, key) => allKeys.add(key));
      }
    });

    allKeys.forEach((key) => {
      const keyTypes: TypeInfo[] = [];
      let isOptional = false;

      types.forEach((t) => {
        if (t.properties?.has(key)) {
          keyTypes.push(t.properties.get(key)!);
        } else {
          isOptional = true;
        }
      });

      if (keyTypes.length > 0) {
        const merged = mergeTypes(keyTypes);
        mergedProps.set(key, { ...merged, isOptional: isOptional || merged.isOptional });
      }
    });

    return {
      type: 'object',
      isArray: false,
      isOptional: false,
      properties: mergedProps,
    };
  }

  if (allSame) {
    return firstType;
  }

  // Mixed types - create union
  const uniqueTypes = [...new Set(types.map((t) => t.type))];
  return {
    type: uniqueTypes.join(' | '),
    isArray: false,
    isOptional: false,
  };
}

/**
 * Generate TypeScript interface from JSON data
 */
export function generateTypeScriptInterface(
  data: JsonValue,
  interfaceName: string = 'Root'
): string {
  const typeInfo = inferType(data);
  const interfaces: string[] = [];

  function generateInterface(
    name: string,
    info: TypeInfo,
    indent: number = 0
  ): string {
    const indentStr = '  '.repeat(indent);

    if (info.type === 'object' && info.properties) {
      let result = `${indentStr}interface ${name} {\n`;

      info.properties.forEach((propInfo, propKey) => {
        const optional = propInfo.isOptional ? '?' : '';
        const arrayBrackets = propInfo.isArray ? '[]' : '';

        if (propInfo.type === 'object' && propInfo.properties) {
          // Nested object - create interface
          const nestedName = capitalize(propKey);
          interfaces.push(generateInterface(nestedName, propInfo, 0));
          result += `${indentStr}  ${propKey}${optional}: ${nestedName}${arrayBrackets};\n`;
        } else {
          result += `${indentStr}  ${propKey}${optional}: ${propInfo.type}${arrayBrackets};\n`;
        }
      });

      result += `${indentStr}}`;
      return result;
    }

    return '';
  }

  if (typeInfo.type === 'object' && typeInfo.properties) {
    const mainInterface = generateInterface(interfaceName, typeInfo);
    return [...interfaces, mainInterface].join('\n\n');
  }

  if (typeInfo.isArray) {
    return `type ${interfaceName} = ${typeInfo.type}[];`;
  }

  return `type ${interfaceName} = ${typeInfo.type};`;
}

/**
 * Analyze JSON and return schema information
 */
export function analyzeJsonSchema(data: JsonValue): {
  totalKeys: number;
  depth: number;
  types: Set<string>;
  typeInfo: TypeInfo;
} {
  const types = new Set<string>();
  let maxDepth = 0;
  let totalKeys = 0;

  function analyze(value: JsonValue, depth: number = 0): void {
    maxDepth = Math.max(maxDepth, depth);

    if (value === null) {
      types.add('null');
      return;
    }

    if (Array.isArray(value)) {
      types.add('array');
      value.forEach((item) => analyze(item, depth + 1));
      return;
    }

    if (typeof value === 'object') {
      types.add('object');
      totalKeys += Object.keys(value).length;
      Object.values(value).forEach((val) => analyze(val, depth + 1));
      return;
    }

    types.add(typeof value);
  }

  analyze(data);
  const typeInfo = inferType(data);

  return { totalKeys, depth: maxDepth, types, typeInfo };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
