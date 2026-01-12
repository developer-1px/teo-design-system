import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { Section } from '@/components/dsl/Section/Section.tsx';
import { MarkdownViewer } from './MarkdownViewer.tsx';

interface CodeEditorProps {
  content: string;
  filename: string;
  onChange?: (value: string) => void;
}

const customTheme = EditorView.theme({
  '&': {
    backgroundColor: '#ffffff',
    color: '#171717',
    height: '100%',
  },
  '.cm-content': {
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    fontSize: '13px',
  },
  '.cm-gutters': {
    backgroundColor: '#fafafa',
    color: '#a3a3a3',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f5f5f5',
  },
  '.cm-activeLine': {
    backgroundColor: '#fafafa',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#d1fae5 !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: '#d1fae5 !important',
  },
  '.cm-cursor': {
    borderLeftColor: '#10b981',
  },
});

function getLanguageExtension(filename: string) {
  if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) {
    return javascript({ jsx: true, typescript: filename.endsWith('.tsx') });
  }
  if (filename.endsWith('.ts') || filename.endsWith('.js')) {
    return javascript({ typescript: filename.endsWith('.ts') });
  }
  if (filename.endsWith('.json')) {
    return json();
  }
  if (filename.endsWith('.css')) {
    return css();
  }
  if (filename.endsWith('.html')) {
    return html();
  }
  if (filename.endsWith('.md')) {
    return markdown();
  }
  return javascript();
}

export const CodeEditor = ({ content, filename, onChange }: CodeEditorProps) => {
  // If it's a markdown file, show the MarkdownViewer
  if (filename?.endsWith('.md')) {
    return <MarkdownViewer content={content} filename={filename} />;
  }

  // Otherwise, show the code editor
  return (
    <Section role="Container" className="flex-1 overflow-hidden">
      <CodeMirror
        value={content}
        height="100%"
        extensions={[getLanguageExtension(filename || ''), customTheme]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: true,
        }}
      />
    </Section>
  );
};
