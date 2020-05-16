// eslint is looking for `puppeteer` at root level package.json
// eslint-disable-next-line import/no-unresolved
const puppeteer = require('puppeteer');
const path = require('path');

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

    afterAll(async () => {
        await browser.close();
    });
});
