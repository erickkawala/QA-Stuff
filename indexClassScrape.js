const { chromium } = require("playwright");

class HackerNewsScraper {
    constructor() {
        this.urls = [
            "https://news.ycombinator.com/",
            "https://news.ycombinator.com/?p=2",
            "https://news.ycombinator.com/?p=3",
            "https://news.ycombinator.com/?p=4"
        ];
        this.data = [];
    }

    async scrapeArticles() {
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        for (let i = 0; i < this.urls.length; i++) {
            const articlesToScrape = i === 3 ? 10 : 30;
            await page.goto(this.urls[i]);
            const articles = page.locator('.athing');

            for (let j = 0; j < articlesToScrape; j++) {
                const article = articles.nth(j);
                const isArticlePresent = await article.count();
                if (!isArticlePresent) continue;

                const rank = await article.locator('.rank').innerText();
                const title = await article.locator('.titleline > a').innerText();
                const dateElement = await article.locator('xpath=following-sibling::*[1]').locator('.age');
                const dateISO = await dateElement.count() > 0 ? await dateElement.getAttribute('title') : null;
                const isoDateMatch = dateISO ? dateISO.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/) : null;
                const date = isoDateMatch ? new Date(isoDateMatch[0]) : null;

                this.data.push({ rank, title, date });
            }
        }

        await browser.close();
        return this.sortData();
    }

    sortData() {
        return this.data.sort((a, b) => b.date - a.date);
    }
}

module.exports = HackerNewsScraper;

// Usage example:
// (async () => {
//   const scraper = new HackerNewsScraper();
//   const sortedData = await scraper.scrapeArticles();
//   console.log(sortedData);
// })();
