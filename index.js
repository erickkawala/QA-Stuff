const { chromium } = require("playwright");

async function scrapeAndSortArticles() {
  const browser = await chromium.launch({ headless: false }); 
  const context = await browser.newContext();
  const page = await context.newPage();

  const urls = [
    "https://news.ycombinator.com/",
    "https://news.ycombinator.com/?p=2",
    "https://news.ycombinator.com/?p=3",
    "https://news.ycombinator.com/?p=4"
  ];
  const data = [];


  // setTimeout after each page.goto to prevent rate limiting by server/ip soft ban
  async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  for (let i = 0; i < urls.length; i++) {
    const articlesToScrape = i === 3 ? 10 : 30; // or articlesToScrape = [30, 30, 30, 10];

    await page.goto(urls[i]);

    // CSS selector for all .athing class elements containing articles+data [for the current URL]
    const articles = page.locator('.athing');

    for (let j = 0; j < articlesToScrape; j++) {
      const article = articles.nth(j); // Select the jth article using nth selector
      const isArticlePresent = await article.count();
      if (!isArticlePresent) continue;

      // Select rank
      const rank = await article.locator('.rank').innerText();

      // Select title
      const title = await article.locator('.titleline > a').innerText();

      // Select date from the title attribute in the .age element using Xpath
      const dateElement = await article.locator('xpath=following-sibling::*[1]').locator('.age');

      const dateISO = await dateElement.count() > 0 ? await dateElement.getAttribute('title') : null;

      // Extract only the ISO date part using regex, other option is str1 = ele.innertext, str1.split(" ").
      const isoDateMatch = dateISO ? dateISO.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/) : null;
      const date = isoDateMatch ? new Date(isoDateMatch[0]) : null;

      // Add article data to array
      data.push({ rank, title, date });
    } // Could add setTimeout here, i*1000, but clunky and not necessary. 
          // Make sure to close all apps before PW test! 
          // And wait 30 seconds since last visit to HackerNews.com before running all tests from UI.
          // delayTime = i*1000;
          // delay(delayTime);
  }

  // Sort data by date in descending order (newest to oldest)
  const sortedData = data.sort((a, b) => b.date - a.date);

  return sortedData;
}

// Run and log the sorted data
(async () => {
  const sortedData = await scrapeAndSortArticles();
  console.log(sortedData);
  console.log("sortedData length: ", sortedData.length); // for testing purposes when using `node index.js`
})();

module.exports = { scrapeAndSortArticles };