const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const pages = [
  { url: 'http://localhost:3000/', name: 'home.png' },
  { url: 'http://localhost:3000/register', name: 'register.png' },
  { url: 'http://localhost:3000/login', name: 'login.png' },
  { url: 'http://localhost:3000/queue', name: 'queue.png' },
  { url: 'http://localhost:3000/dashboard', name: 'dashboard.png' },
  { url: 'http://localhost:3000/book', name: 'book.png' },
  { url: 'http://localhost:3000/admin', name: 'admin.png' },
  { url: 'http://localhost:3000/admin/doctors', name: 'admin-doctors.png' },
  { url: 'http://localhost:3000/admin/reports', name: 'admin-reports.png' }
];

(async () => {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch();
  const dir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  for (const pageInfo of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    console.log(`\nNavigating to ${pageInfo.url}...`);
    try {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000)); // wait for renders/animations
      const filepath = path.join(dir, pageInfo.name);
      await page.screenshot({ path: filepath, fullPage: true });
      console.log(`SUCCESS: ${filepath}`);
    } catch (e) {
      console.log(`ERROR on ${pageInfo.url}: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\nAll done!');
})();
