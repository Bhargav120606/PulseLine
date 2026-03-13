const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const startUrl = "https://pulseline-neon.vercel.app/";
const visited = new Set();
const queue = [startUrl];

// Create screenshots folder
const screenshotsDir = path.join(__dirname, "../screenshots");
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    while (queue.length) {
        const url = queue.shift();
        if (visited.has(url)) continue;
        visited.add(url);

        console.log("Visiting:", url);

        try {
            await page.goto(url, { waitUntil: "networkidle2" });

            const fileName = url
                .replace(/https?:\/\//, "")
                .replace(/[\/:?&=]/g, "_") + ".jpg";

            await page.screenshot({
                path: path.join(screenshotsDir, fileName),
                type: "jpeg",
                fullPage: true,
            });

            // Extract all internal links
            const links = await page.evaluate(() =>
                Array.from(document.querySelectorAll("a")).map(a => a.href)
            );

            links.forEach(link => {
                if (link.startsWith(startUrl) && !visited.has(link)) {
                    queue.push(link);
                }
            });

        } catch (err) {
            console.log("Error:", err.message);
        }
    }

    await browser.close();
    console.log("All pages captured!");
})();