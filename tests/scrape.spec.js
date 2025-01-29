import { test as base, expect } from '@playwright/test';
import { scrapeAndSortArticles } from '../index.js';



// scrape test fixture
const test = base.extend<{}>({
    articleScrape: async ({ page }, use) => {
        const articleScrape = new articleScrape(page);
        await scrapeAndSortArticles();

        await articleScrape.removeAll(); // or just remove()?
    }

});

// Fetch articles once before all tests run
test.beforeAll(async () => {
    articles = await scrapeAndSortArticles().catch(error => console.error(error))
        .then(console.log("await scrapeAndSortArticles() completed."))
        console.log('articles:', articles)
    // console.log(articles.length);   // This resulted in: final array has length of 100 (4ms)
});

// Ensure the Hacker News title appears correctly
// test('has Hacker News in title', async ({ page }) => { // this is probably triggering the rate limit by server,
//     await page.goto('https://news.ycombinator.com/'); // since this test is not important and redundant,
//     await expect(page).toHaveTitle(/Hacker News/);          //  temporarily commenting it out
// }); 

// Check that the data object is an array
test('final data object is an array', async () => {
    expect(Array.isArray(articles)).toBe(true);
});

// Verify articles are sorted from newest to oldest
test('sort scraped articles from newest to oldest', async () => {
    for (let i = 0; i < articles.length - 1; i++) {

        const currentArticleDate = articles[i].date;
        const nextArticleDate = articles[i + 1].date;

        expect(currentArticleDate.getTime()).toBeGreaterThanOrEqual(nextArticleDate.getTime());
    }
});

// Check that the final array has a length of 100
test('final array has length of 100', async () => {
    expect(articles).toHaveLength(100);
});
// This test will fail if the server starts limiting requests from my IP address.../
// Often, articles.Length will be 40, 60, 70, or 90 depending on when the request was denied.