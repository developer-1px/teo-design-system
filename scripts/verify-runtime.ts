
import { chromium, Page } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import waitPort from 'wait-port';
import getPort from 'get-port';

const ROUTES = [
    '/',
    '/#/table',
    '/#/agent-editor',
    '/#/slide',
    '/#/cms',
    '/#/crm',
    '/#/mail',
    '/#/discord',
    '/#/login',
    '/#/notebook',
    '/#/calendar',
    '/#/playground',
    '/#/grid',
];

async function startServer(): Promise<{ process: ChildProcess; port: number }> {
    const port = 5555;

    console.log(`⚡ Starting fresh Vite server on port ${port}...`);
    const server = spawn('npm', ['run', 'dev', '--', '--port', port.toString(), '--strictPort'], {
        stdio: 'inherit',
        shell: true,
        detached: true,
        env: { ...process.env, FORCE_COLOR: 'true' }
    });

    const connected = await waitPort({ host: 'localhost', port: port, timeout: 30000, output: 'dots' });
    if (!connected) {
        throw new Error(`Failed to start server on port ${port}`);
    }

    return { process: server, port };
}

async function verifyRoute(page: Page, url: string) {
    const errors: string[] = [];

    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(`[Console Error] ${msg.text()}`);
        }
    });

    page.on('pageerror', exception => {
        errors.push(`[Uncaught Exception] ${exception.message}\n${exception.stack}`);
    });

    page.on('requestfailed', request => {
        if (request.url().includes('localhost')) {
            errors.push(`[Network Error] ${request.url()} - ${request.failure()?.errorText || 'Failed'}`);
        }
    });

    // Also catch simple 404s
    page.on('response', response => {
        if (response.status() === 404 && response.url().includes('localhost')) {
            errors.push(`[404 Error] ${response.url()}`);
        }
    });

    console.log(`Checking route: ${url}`);
    try {
        const response = await page.goto(url, { waitUntil: 'networkidle' });
        if (response?.status() === 404) {
            errors.push('[404] Page returned 404');
        }

        // Quick heuristic: Check if root element exists and isn't empty
        const root = await page.$('#root');
        if (!root) {
            errors.push('[Visual Error] #root element not found');
        }
    } catch (e: any) {
        errors.push(`[Navigation Error] ${e.message}`);
    }

    return errors;
}

async function run() {
    let serverProcess: ChildProcess | null = null;
    let hasErrors = false;

    try {
        // 1. Check if server is already running
        const connected = await waitPort({ host: 'localhost', port: 5555, output: 'silent', timeout: 2000 });

        if (!connected) {
            // Always start a fresh server if not running
            const { process: proc } = await startServer();
            serverProcess = proc;
        } else {
            console.log('✅ Server already running on port 5555.');
        }

        const baseUrl = 'http://localhost:5555';
        const browser = await chromium.launch();

        for (const route of ROUTES) {
            const page = await browser.newPage();
            const errors = await verifyRoute(page, `${baseUrl}${route}`);
            if (errors.length > 0) {
                console.error(`❌ Errors found on ${route}:`);
                errors.forEach(e => console.error(`   ${e}`));
                hasErrors = true;
            } else {
                console.log(`✅ ${route} passed.`);
            }
            await page.close();
        }

        await browser.close();

    } catch (error) {
        console.error('🔥 Fatal error during verification:', error);
        hasErrors = true;
    } finally {
        if (serverProcess) {
            console.log('🛑 Stopping temporary server...');
            try {
                process.kill(-serverProcess.pid!); // Kill process group
            } catch (e) {
                // Ignore kill errors
            }
        }

        if (hasErrors) {
            process.exit(1);
        } else {
            console.log('✨ All routes passed runtime checks.');
            process.exit(0);
        }
    }
}

run();
