// @ts-nocheck
export default function inspectorBabelPlugin({ types: t }: any) {
    return {
        visitor: {
            JSXOpeningElement(path: any, state: any) {
                if (
                    state.filename &&
                    !state.filename.includes('node_modules') &&
                    path.node.loc
                ) {
                    const { line, column } = path.node.loc.start;
                    const fileVal = `${state.filename}:${line}:${column + 1}`;

                    path.pushContainer(
                        'attributes',
                        t.jsxAttribute(
                            t.jsxIdentifier('data-inspector-line'),
                            t.stringLiteral(fileVal)
                        )
                    );
                }
            }
        }
    };
}
