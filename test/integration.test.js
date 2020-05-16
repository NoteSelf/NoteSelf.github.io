// eslint is looking for `puppeteer` at root level package.json
// eslint-disable-next-line import/no-unresolved
const puppeteer = require('puppeteer');
const path = require('path');

const wait = time => new Promise(res => setTimeout(res, time))

const waitForWikiLoad = async (page) => {
    await page.waitForSelector('#TP_splash_screen', { hidden: true });
    await page.waitForSelector('body.tc-body.tc-dirty', { hidden: true });
};

describe('Visual regression test of online version', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            defaultViewport: {
                height: 1011,
                width: 800,
            }
        });
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto( `file:${ path.join(__dirname, '..', 'dist', 'online', 'index.html') }`);
        await waitForWikiLoad(page);
    });

    it('works', async () => {
        const image = await page.screenshot({fullPage: true});
        expect(image).toMatchImageSnapshot();
    });

    it('login modal', async () => {
        await page.click('[aria-label="login"]')
        await page.waitForSelector('.tc-ns-login-popup', {visible: true})
        await wait(1000)
        const image = await page.screenshot({fullPage: true});
        expect(image).toMatchImageSnapshot();
    });

    it('custom login tab', async () => {
        await expect( page ).toClick('[aria-label="login"]')
        await page.waitForSelector('.tc-ns-login-popup', {visible: true})
        await wait(1000)
        await expect(page).toClick('button',{text: 'Custom'})
        const image = await page.screenshot({fullPage: true});
        expect(image).toMatchImageSnapshot();
    });

    afterAll(async () => {
        await browser.close();
    });
});
