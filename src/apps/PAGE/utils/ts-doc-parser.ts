import * as ts from 'typescript';

export interface TypeDefinition {
  name: string;
  description: string;
  type: string;
  kind: 'type' | 'interface' | 'enum';
  members?: string[]; // For unions or enum members
  memberDescriptions?: Record<string, string>; // Extracted from JSDoc bullet points
}

/**
 * Parses a raw TypeScript source string and extracts type definitions.
 * @param sourceCode The raw string content of the TS file
 * @param fileName fileName for the source file
 */
export function parseTsSource(sourceCode: string, fileName = 'file.ts'): TypeDefinition[] {
  const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest, true);

  const definitions: TypeDefinition[] = [];

  const visit = (node: ts.Node) => {
    // Check for exported Type Alias
    if (ts.isTypeAliasDeclaration(node) && isExported(node)) {
      const name = node.name.text;
      const description = getJSDocDescription(node);

      let members: string[] = [];

      // Extract Union Types if it's a union
      if (ts.isUnionTypeNode(node.type)) {
        members = node.type.types.map((t) => {
          if (ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal)) {
            return t.literal.text;
          }
          return t.getText(sourceFile);
        });
      }

      const memberDescriptions = parseMemberDescriptions(description, members);

      definitions.push({
        name,
        description,
        type: 'type',
        kind: 'type',
        members,
        memberDescriptions,
      });
    }
    // Check for Interface (future use)
    else if (ts.isInterfaceDeclaration(node) && isExported(node)) {
      definitions.push({
        name: node.name.text,
        description: getJSDocDescription(node),
        type: 'interface',
        kind: 'interface',
      });
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return definitions;
}

function isExported(node: ts.Declaration): boolean {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
}

function getJSDocDescription(node: ts.Node): string {
  const jsDocs = (node as any).jsDoc as ts.JSDoc[];
  if (jsDocs && jsDocs.length > 0) {
    return ts.getTextOfJSDocComment(jsDocs[0].comment) || '';
  }
  return '';
}

/**
 * Parses JSDoc description to find bullet points describing members.
 * Expected format:
 * - 'MemberName': Description
 */
function parseMemberDescriptions(jsDoc: string, members: string[]): Record<string, string> {
  const descriptions: Record<string, string> = {};

  if (!jsDoc) return descriptions;

  const lines = jsDoc.split('\n');

  lines.forEach((line) => {
    const trimmed = line.trim();
    // Match pattern: "- 'Value': Description" or "- Value: Description"
    const match = trimmed.match(/^-\s*['"]?(\w+)['"]?:\s*(.+)$/);
    if (match) {
      const [, key, desc] = match;
      if (members.includes(key)) {
        descriptions[key] = desc;
      }
    }
  });

  return descriptions;
}
