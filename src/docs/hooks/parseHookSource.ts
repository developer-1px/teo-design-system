import * as ts from 'typescript';

export interface ParsedHook {
    name: string;
    description: string;
    source: string;
    parameters: string[];
    docParams: Record<string, string>;
    example?: string;
    category: string;
    path: string;
}

/**
 * Parses raw TypeScript source code using the official TypeScript AST.
 * This ensures accuracy over Regex but is lighter than ts-morph.
 */
export function parseHookSource(source: string, filePath: string): ParsedHook {
    // 1. Create AST
    const sourceFile = ts.createSourceFile(
        filePath,
        source,
        ts.ScriptTarget.Latest,
        true
    );

    let name = filePath.split('/').pop()?.replace('.ts', '') || 'Unknown';
    let description = '';
    let docParams: Record<string, string> = {};
    let example = '';
    let parameters: string[] = [];

    // 2. Walk AST to find the main exported function
    // We assume the hook is the default export or a named export that matches the filename

    function visit(node: ts.Node) {
        if (
            ts.isFunctionDeclaration(node) ||
            ts.isVariableStatement(node)
        ) {
            const modifiers = ts.getModifiers(node as any);
            const isExported = modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword);

            if (isExported) {
                let declName = '';
                let params: ts.NodeArray<ts.ParameterDeclaration> | undefined;
                let jsDocNodes: readonly ts.JSDoc[] | undefined;

                if (ts.isFunctionDeclaration(node)) {
                    declName = node.name?.text || '';
                    params = node.parameters;
                    // @ts-ignore - TS types for JSDoc are sometimes tricky in raw api
                    jsDocNodes = (node as any).jsDoc;
                } else if (ts.isVariableStatement(node)) {
                    const declaration = node.declarationList.declarations[0];
                    if (ts.isIdentifier(declaration.name)) {
                        declName = declaration.name.text;
                    }
                    if (declaration.initializer && (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer))) {
                        params = declaration.initializer.parameters;
                    }
                    // @ts-ignore
                    jsDocNodes = (node as any).jsDoc;
                }

                // Simplistic matching: if it starts with 'use', it's likely our hook
                // OR if it matches the filename
                if (declName.startsWith('use')) {
                    name = declName;

                    // Extract Params
                    if (params) {
                        parameters = params.map(p => p.getText(sourceFile));
                    }

                    // Extract JSDoc
                    if (jsDocNodes && jsDocNodes.length > 0) {
                        const jsDoc = jsDocNodes[jsDocNodes.length - 1]; // Use the last one closest to function
                        if (typeof jsDoc.comment === 'string') {
                            description = jsDoc.comment;
                        } else if (Array.isArray(jsDoc.comment)) {
                            // @ts-ignore
                            description = jsDoc.comment.map(c => c.text).join("");
                        }

                        if (jsDoc.tags) {
                            jsDoc.tags.forEach(tag => {
                                if (ts.isJSDocParameterTag(tag)) {
                                    const paramName = tag.name.getText(sourceFile);
                                    const paramDesc = typeof tag.comment === 'string' ? tag.comment : (Array.isArray(tag.comment) ? tag.comment.map((c: any) => c.text).join("") : '');
                                    docParams[paramName] = paramDesc;
                                }
                                if (tag.tagName.text === 'example') {
                                    example = typeof tag.comment === 'string' ? tag.comment : (Array.isArray(tag.comment) ? tag.comment.map((c: any) => c.text).join("") : '');
                                }
                            });
                        }
                    }
                }
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    // Determine Category from path
    const parts = filePath.split('/');
    const categoryIndex = parts.indexOf('hooks');
    const category = categoryIndex !== -1 && parts[categoryIndex + 1]
        ? parts[categoryIndex + 1]
        : 'Uncategorized';

    return {
        name,
        description: description.trim(),
        source,
        parameters,
        docParams,
        example: example.trim(),
        category: category.endsWith('.ts') ? 'General' : category,
        path: filePath
    };
}
