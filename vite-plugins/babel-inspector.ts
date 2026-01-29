// @ts-nocheck
import path from 'path';

export default function inspectorBabelPlugin({ types: t }: any) {
    return {
        visitor: {
            JSXOpeningElement(jsxPath: any, state: any) {
                if (
                    state.filename &&
                    !state.filename.includes('node_modules') &&
                    jsxPath.node.loc
                ) {
                    const { line, column } = jsxPath.node.loc.start;
                    const relativePath = path.relative(process.cwd(), state.filename);
                    const fileVal = `${relativePath}:${line}:${column + 1}`;

                    jsxPath.pushContainer(
                        'attributes',
                        t.jsxAttribute(
                            t.jsxIdentifier('data-inspector-line'),
                            t.stringLiteral(fileVal)
                        )
                    );

                    // Find total lines in file
                    if (state.file.ast.loc) {
                        const fileLocCount = state.file.ast.loc.end.line;
                        jsxPath.pushContainer(
                            'attributes',
                            t.jsxAttribute(
                                t.jsxIdentifier('data-inspector-loc'),
                                t.stringLiteral(fileLocCount.toString())
                            )
                        );
                    }
                }
            }
        }
    };
}
