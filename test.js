const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('Navigating...');
    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 10000 });
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'test_screenshot.png' });
    console.log('Done!');
    await browser.close();
  } catch (e) {
    console.error('ERROR:', e);
    process.exit(1);
  }
})();
