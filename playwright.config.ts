import {defineConfig} from '@playwright/test';
import {config as testConfig} from "./config/config";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    globalSetup: './globalSetup',
    globalTeardown: './tearDown',
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    workers: process.env.CI ? 3 : 5,
    maxFailures: process.env.CI ? 10 : undefined,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html', {open: process.env.CI ? 'never': 'on-failure'}],
        [process.env.CI ? 'github' : 'list'],
        // [
        //     '@testomatio/reporter/lib/adapter/playwright.js',
        //     {
        //         apiKey: testConfig.reporters.testomat.key,
        //     },
        // ],
    ],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        httpCredentials: testConfig.httpCredentials,
        headless: true,
        baseURL: testConfig.baseURL,
        trace: process.env.CI ? 'off' : 'on-first-retry',
        screenshot: 'only-on-failure',
        video: process.env.CI ? 'off' : 'retain-on-failure',
    },

    projects: [
        // Setup project
        {name: 'setupAuthE2E', testMatch: /.*\authE2E.setup\.ts/},
        {
            name: 'e2e-chromium',
            testMatch: /\/tests\/e2e\/.*\/*.(test|spec).(js|ts)/,
            dependencies: ['setupAuthE2E'],
            use: {
                screenshot: {
                    mode: process.env.CI ? 'only-on-failure' : "on",
                    fullPage: true
                },
                browserName: 'chromium',
                video: process.env.CI ? 'off' : 'on',
                viewport: {width: 1920, height: 1080},
                trace: process.env.CI ? 'off' : 'retain-on-failure'
            }
        },
        {
            name: 'api',
            testMatch: /\/tests\/api\/.*\/*.(test|spec).(js|ts)/
        },
    ],
});