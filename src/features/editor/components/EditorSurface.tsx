import * as styles from './EditorSurface.css';


export function EditorSurface() {
    return (
        <main className={styles.container}>
            <div className={styles.codeArea}>
                <CodeLine num={1} content={<span style={{ color: '#c586c0' }}>import</span>} content2={<span style={{ color: '#9cdcfe' }}> React</span>} />
                <CodeLine num={2} content="" />
                <CodeLine num={3} content={<span style={{ color: '#569cd6' }}>function</span>} content2={<span style={{ color: '#dcdcaa' }}> App</span>} content3="() {" />
                <CodeLine num={4} content="  " content2={<span style={{ color: '#c586c0' }}>return</span>} content3=" <div>Hello World</div>;" />
                <CodeLine num={5} content="}" />
            </div>

            <div className={styles.terminal}>
                <div className={styles.terminalHeader}>
                    <span className={styles.activeTerminalTab}>Terminal</span>
                    <span>Output</span>
                    <span>Debug Console</span>
                </div>
                <div className={styles.terminalBody}>
                    <div>➜  fusion-hypernova git:(main) <span>npm run dev</span></div>
                    <br />
                    <div>  VITE v4.4.9  ready in 250 ms</div>
                    <br />
                    <div>  ➜  Local:   <span>http://localhost:5173/</span></div>
                    <div>  ➜  Network: use --host to expose</div>
                </div>
            </div>
        </main>
    );
}

function CodeLine({ num, content, content2, content3 }: { num: number, content: React.ReactNode, content2?: React.ReactNode, content3?: React.ReactNode }) {
    return (
        <div>
            <span className={styles.lineVal}>{num}</span>
            {content}{content2}{content3}
        </div>
    )
}
