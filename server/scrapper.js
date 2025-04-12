import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        fullScreen: true,
        defaultViewport: null,
        executablePath: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
        userDataDir: path.resolve(__dirname, 'puppeteer_user_data') 
    });

    const page = await browser.newPage();
    const allResults = [];

    for (let i = 1; i <= 10; i++) {
        const url = `https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%2C%22101165590%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=FACETED_SEARCH&sid=HMj&titleFreeText=Founder&page=${i}`;
        
        console.log(`⏳ Scraping page ${i}...`);
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });
          
          await new Promise(resolve => setTimeout(resolve, 5000)); // ⏳ wait 5 seconds
          await page.waitForSelector('.pJrjdcyApQhWkFaALbbgwNxiuiJpNMiaUCjIOsIA', { timeout: 10000 });

        await page.waitForSelector('.pJrjdcyApQhWkFaALbbgwNxiuiJpNMiaUCjIOsIA', { timeout: 10000 });

        const results = await page.evaluate(() => {
            const items = document.querySelectorAll('.pJrjdcyApQhWkFaALbbgwNxiuiJpNMiaUCjIOsIA');
            const data = [];

            items.forEach(item => {
                const nameEl = item.querySelector('a span[aria-hidden="true"]');
                const profileLink = item.querySelector('a')?.href;
                const headline = item.querySelector('.t-14.t-black.t-normal')?.innerText;
                const location = item.querySelector('.PchPXnnMXFIVZtSxWMslpJfzWqvFCkVlM')?.innerText;
                const currentJob = item.querySelector('.XdFGKbWXDcnKCBrBFouHKPCaBNJLLh')?.innerText;

                data.push({
                    name: nameEl?.innerText || null,
                    profileLink: profileLink || null,
                    headline: headline || null,
                    location: location || null,
                    currentJob: currentJob || null
                });
            });

            return data;
        });

        allResults.push(...results);

        console.log(`✅ Page ${i} scraped. Waiting before next page...`);
        await delay(3000);
    }
    const outputPath = path.resolve(__dirname, 'linkedin_results.json');
    fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));

    console.log(`🎉 All data written to ${outputPath}`);
    await browser.close();
})();