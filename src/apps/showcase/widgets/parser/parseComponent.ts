/**
 * TypeScript Parser (공식 typescript 모듈 사용)
 *
 * 컴포넌트 소스 코드를 파싱하여 메타데이터 추출
 */

import ts from 'typescript';
import type { ComponentMetadata, PropInfo, PropType, ImportInfo } from './types';

/**
 * 컴포넌트 소스 코드 파싱
 */
export function parseComponent(sourceCode: string, filePath: string): ComponentMetadata {
  try {
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );

    const metadata: ComponentMetadata = {
      name: extractComponentName(filePath),
      filePath,
      sourceCode,
      props: {},
      imports: extractImports(sourceFile),
      externalDeps: [],
      isDefaultExport: false,
      exportedNames: [],
    };

    // AST 순회
    visitNode(sourceFile, metadata);

    // 외부 deps 계산
    metadata.externalDeps = metadata.imports
      .filter((imp) => !imp.source.startsWith('.') && !imp.source.startsWith('@/'))
      .map((imp) => imp.source);

    return metadata;
  } catch (error) {
    console.error(`Failed to parse ${filePath}:`, error);
    return {
      name: extractComponentName(filePath),
      filePath,
      sourceCode,
      props: {},
      imports: [],
      externalDeps: [],
      isDefaultExport: false,
      exportedNames: [],
    };
  }
}

/**
 * 파일 경로에서 컴포넌트 이름 추출
 */
function extractComponentName(filePath: string): string {
  const match = filePath.match(/\/([^/]+)\.tsx?$/);
  return match ? match[1] : 'Unknown';
}

/**
 * Import 문 추출
 */
function extractImports(sourceFile: ts.SourceFile): ImportInfo[] {
  const imports: ImportInfo[] = [];

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        const importInfo: ImportInfo = {
          source: moduleSpecifier.text,
          imports: [],
        };

        if (node.importClause) {
          // Default import
          if (node.importClause.name) {
            importInfo.imports.push({
              name: node.importClause.name.text,
              isDefault: true,
              isNamespace: false,
            });
          }

          // Named imports
          if (node.importClause.namedBindings) {
            if (ts.isNamedImports(node.importClause.namedBindings)) {
              for (const element of node.importClause.namedBindings.elements) {
                importInfo.imports.push({
                  name: element.name.text,
                  alias: element.propertyName ? element.propertyName.text : undefined,
                  isDefault: false,
                  isNamespace: false,
                });
              }
            } else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
              importInfo.imports.push({
                name: node.importClause.namedBindings.name.text,
                isDefault: false,
                isNamespace: true,
              });
            }
          }
        }

        imports.push(importInfo);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return imports;
}

/**
 * AST 노드 방문
 */
function visitNode(node: ts.Node, metadata: ComponentMetadata) {
  // Export default
  if (
    ts.isExportAssignment(node) &&
    !node.isExportEquals
  ) {
    metadata.isDefaultExport = true;
  }

  // Export named
  if (ts.isExportDeclaration(node) && node.exportClause) {
    if (ts.isNamedExports(node.exportClause)) {
      for (const element of node.exportClause.elements) {
        metadata.exportedNames.push(element.name.text);
      }
    }
  }

  // Variable exports
  if (
    ts.isVariableStatement(node) &&
    node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
  ) {
    for (const decl of node.declarationList.declarations) {
      if (ts.isIdentifier(decl.name)) {
        metadata.exportedNames.push(decl.name.text);
      }
    }
  }

  // Function exports
  if (
    ts.isFunctionDeclaration(node) &&
    node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) &&
    node.name
  ) {
    metadata.exportedNames.push(node.name.text);
  }

  // Interface (Props)
  if (ts.isInterfaceDeclaration(node)) {
    const interfaceName = node.name.text;
    if (interfaceName.endsWith('Props') || interfaceName.includes('Props')) {
      const props = extractPropsFromInterface(node);
      Object.assign(metadata.props, props);

      // JSDoc 추출
      const jsdoc = extractJSDoc(node);
      if (jsdoc.description) {
        metadata.description = jsdoc.description;
      }
      if (jsdoc.examples) {
        metadata.examples = jsdoc.examples;
      }
    }
  }

  // 자식 노드 재귀
  ts.forEachChild(node, (child) => visitNode(child, metadata));
}

/**
 * Interface에서 Props 추출
 */
function extractPropsFromInterface(node: ts.InterfaceDeclaration): Record<string, PropInfo> {
  const props: Record<string, PropInfo> = {};

  for (const member of node.members) {
    if (ts.isPropertySignature(member) && member.name && ts.isIdentifier(member.name)) {
      const propName = member.name.text;
      const required = !member.questionToken;
      const propType = extractPropType(member.type);

      props[propName] = {
        name: propName,
        type: propType,
        required,
        description: extractPropDescription(member),
      };
    }
  }

  return props;
}

/**
 * TypeScript 타입에서 PropType 추출
 */
function extractPropType(typeNode: ts.TypeNode | undefined): PropType {
  if (!typeNode) return { kind: 'unknown' };

  switch (typeNode.kind) {
    case ts.SyntaxKind.StringKeyword:
      return { kind: 'string' };

    case ts.SyntaxKind.NumberKeyword:
      return { kind: 'number' };

    case ts.SyntaxKind.BooleanKeyword:
      return { kind: 'boolean' };

    case ts.SyntaxKind.UnionType: {
      const union = typeNode as ts.UnionTypeNode;
      // 리터럴 union → enum
      const literals = union.types.filter((t) => ts.isLiteralTypeNode(t));
      if (literals.length === union.types.length) {
        const values = literals.map((lit) => {
          const literal = (lit as ts.LiteralTypeNode).literal;
          if (ts.isStringLiteral(literal)) {
            return literal.text;
          }
          if (ts.isNumericLiteral(literal)) {
            return literal.text;
          }
          return '';
        });
        return { kind: 'enum', values };
      }

      // 그 외 union
      const types = union.types.map((t) => extractPropType(t));
      return { kind: 'union', types };
    }

    case ts.SyntaxKind.ArrayType: {
      const array = typeNode as ts.ArrayTypeNode;
      return {
        kind: 'array',
        itemType: extractPropType(array.elementType),
      };
    }

    case ts.SyntaxKind.TypeReference: {
      const ref = typeNode as ts.TypeReferenceNode;
      if (ts.isIdentifier(ref.typeName)) {
        const typeName = ref.typeName.text;
        if (typeName === 'ReactNode' || typeName === 'ReactElement') {
          return { kind: 'ReactNode' };
        }
      }
      return { kind: 'unknown' };
    }

    case ts.SyntaxKind.FunctionType:
      return { kind: 'function' };

    case ts.SyntaxKind.TypeLiteral:
      return { kind: 'object' };

    default:
      return { kind: 'unknown' };
  }
}

/**
 * JSDoc 주석에서 설명 추출
 */
function extractJSDoc(node: ts.Node): { description?: string; examples?: string[] } {
  const jsDocTags = ts.getJSDocTags(node);
  const jsDocComments = ts.getJSDocCommentsAndTags(node);

  let description = '';
  const examples: string[] = [];

  // Description
  for (const comment of jsDocComments) {
    if (ts.isJSDoc(comment) && comment.comment) {
      if (typeof comment.comment === 'string') {
        description += comment.comment + ' ';
      }
    }
  }

  // @example tags
  for (const tag of jsDocTags) {
    if (tag.tagName.text === 'example' && tag.comment) {
      if (typeof tag.comment === 'string') {
        examples.push(tag.comment);
      }
    }
  }

  return {
    description: description.trim() || undefined,
    examples: examples.length > 0 ? examples : undefined,
  };
}

/**
 * Prop 설명 추출
 */
function extractPropDescription(node: ts.Node): string | undefined {
  const jsDocComments = ts.getJSDocCommentsAndTags(node);

  for (const comment of jsDocComments) {
    if (ts.isJSDoc(comment) && comment.comment) {
      if (typeof comment.comment === 'string') {
        return comment.comment.trim();
      }
    }
  }

  return undefined;
}
