import { MDXProvider } from "@mdx-js/react";
import { SourceViewer } from "./components/SourceViewer";
import * as classes from "./MDXComponents.css";

const components = {
    h1: (props: any) => (
        <div className={classes.h1Wrapper}>
            <h1 {...props} className="" />
        </div>
    ),
    h2: (props: any) => (
        <div className={classes.h2Wrapper}>
            <h2 {...props} />
        </div>
    ),
    h3: (props: any) => (
        <div className={classes.h3Wrapper}>
            <h3 {...props} />
        </div>
    ),
    p: (props: any) => (
        <p className={classes.paragraph} {...props} />
    ),
    ul: (props: any) => (
        <ul className={classes.list} {...props} />
    ),
    li: (props: any) => (
        <li className={classes.listItem} {...props} />
    ),
    strong: (props: any) => (
        <strong className={classes.strong} {...props} />
    ),
    blockquote: (props: any) => (
        <blockquote className={classes.blockquote} {...props} />
    ),
    code: (props: any) => (
        <code className={classes.inlineCode} {...props} />
    ),
    pre: (props: any) => (
        <pre className={classes.preBlock} {...props} />
    ),
    SourceViewer: SourceViewer,
};

export function MDXProviderWrapper({ children }: { children: React.ReactNode }) {
    return <MDXProvider components={components}>{children}</MDXProvider>;
}
