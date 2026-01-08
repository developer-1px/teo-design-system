/// <reference types="vite/client" />

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

interface ImportMeta {
  readonly glob: (pattern: string, options?: {
    query?: string;
    import?: string;
  }) => Record<string, () => Promise<unknown>>;
}
