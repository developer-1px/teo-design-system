import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const PORT = 5555;
const MAX_RETRIES = 30; // 30 seconds timeout for server start

async function startDevServer() {
    console.log(`🚀 Starting Vite DEV server on port ${PORT}...`);
    const server = spawn('npm', ['run', 'dev', '--', '--port', PORT.toString()], {
        stdio: 'pipe',
        shell: true,
    });

    // Promise to resolve when URL is found
    const urlPromise = new Promise((resolve, reject) => {
        let buffer = '';
        const onData = (data) => {
            const text = data.toString();
            console.log(`[Vite]: ${text}`);
            buffer += text;

            // Look for "Local:   http://localhost:XXXX"
            const match = buffer.match(/Local:\s+(http:\/\/localhost:\d+)/);
            if (match) {
                resolve(match[1]);
                server.stdout.off('data', onData);
            }
        };

        server.stdout.on('data', onData);
        server.stderr.on('data', (data) => console.error(`[Vite Error]: ${data}`));

        // Timeout if not found
        setTimeout(() => reject(new Error('Timeout waiting for Dev Server URL')), 30000);
    });

    return { process: server, urlPromise };
}

async function verify() {
    let serverProcess;
    let browser;
    let hasError = false;

    try {
        const { process: proc, urlPromise } = await startDevServer();
        serverProcess = proc;

        console.log('⏳ Waiting for Dev Server URL...');
        const dynamicUrl = await urlPromise;
        console.log(`🌍 Detected Dev Server URL: ${dynamicUrl}`);

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        const errors = [];
        page.on('console', msg => {
            const type = msg.type();
            if (type === 'error') {
                // Filter out HMR connection errors which are common in automated tests
                if (!msg.text().includes('[vite] connecting') && !msg.text().includes('ERR_CONNECTION_REFUSED')) {
                    errors.push(`Console Error: ${msg.text()}`);
                }
            }
        });
        page.on('pageerror', err => {
            errors.push(`Page Error: ${err.toString()}`);
        });

        console.log(`🚀 Navigating to ${dynamicUrl}...`);
        await page.goto(dynamicUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait a bit for overlay to appear if any
        await new Promise(r => setTimeout(r, 2000));

        // CHECK FOR VITE ERROR OVERLAY (Shadow DOM)
        const overlayError = await page.evaluate(() => {
            const overlay = document.querySelector('vite-error-overlay');
            if (!overlay) return null;
            if (!overlay.shadowRoot) return "Vite Overlay found but no shadow root";

            // Try to get the main message
            const messageBody = overlay.shadowRoot.querySelector('.message-body');
            const fileLink = overlay.shadowRoot.querySelector('.file-link');
            const stack = overlay.shadowRoot.querySelector('.stack');

            return {
                message: messageBody ? messageBody.innerText : "Unknown Error",
                file: fileLink ? fileLink.innerText : "Unknown File",
                stack: stack ? stack.innerText : ""
            };
        });

        if (overlayError) {
            console.error('\n🚨 VITE ERROR OVERLAY DETECTED!');
            console.error(`   Message: ${overlayError.message}`);
            console.error(`   File:    ${overlayError.file}`);
            if (overlayError.stack) console.error(`   Stack:   ${overlayError.stack.split('\n')[0]}...`);
            errors.push(`Vite Overlay: ${overlayError.message}`);
        }

        // Check for empty root (React failed to mount)
        const rootContent = await page.$eval('#root', el => el.innerHTML);
        if ((!rootContent || rootContent.trim().length === 0) && !overlayError) {
            errors.push('🚨 #root element is empty! React might have failed to mount.');
        }

        if (errors.length > 0) {
            console.error('\n❌ Runtime Verification Failed with the following errors:');
            errors.forEach(e => console.error(`   - ${e}`));
            hasError = true;

            await page.screenshot({ path: 'runtime-error.png', fullPage: true });
            console.log('📸 Screenshot saved to runtime-error.png');
        } else {
            console.log('\n✅ Runtime Verification Passed! App loaded successfully.');
        }

    } catch (err) {
        console.error('\n💥 Critical Failure during verification:', err);
        hasError = true;
    } finally {
        if (browser) await browser.close();
        if (serverProcess) {
            serverProcess.kill();
            try { process.kill(-serverProcess.pid) } catch (e) { }
        }
        process.exit(hasError ? 1 : 0);
    }
}

verify();
