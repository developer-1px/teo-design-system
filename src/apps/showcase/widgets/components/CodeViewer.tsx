/**
 * CodeViewer - 소스 코드 syntax highlighting
 */

import { Highlight, themes } from 'prism-react-renderer';

interface CodeViewerProps {
  sourceCode: string;
}

export function CodeViewer({ sourceCode }: CodeViewerProps) {
  return (
    <div className="p-6">
      <Highlight theme={themes.vsLight} code={sourceCode} language="tsx">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 rounded-lg overflow-auto text-sm`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-8 text-right mr-4 text-gray-400 select-none">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
