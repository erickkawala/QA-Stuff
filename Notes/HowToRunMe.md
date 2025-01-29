# How to Run this on Mac OS

## OS: Apple Silicon M2Pro. 

### Need to have all other apps closed when testing via command line. Not sure about this on --ui, but the tests will pass if the following command is run via terminal:

### npx playwright test --ui

### Running `npx playwright test --ui' fixes the command line errors completely. See below. (Plenty of different problems that were popping up, especially if VS Code or Chrome was open during testing. Run out of RAM, anti-bot setup on URL...)

### In the playwright test --ui gui: look toward the icons at the top left and find the green play button triangle icon. Click that button to run the tests. They will all pass.

<!--  Something like this will happen if PC runs out of RAM or target URL to scrape limits requests.
  2 failed
    [Microsoft Edge] › scrape.spec.js:13:5 › has Hacker News in title ──────────────────────────────
    [Microsoft Edge] › scrape.spec.js:35:5 › final array has length of 100 ─────────────────────────
  18 passed (18.3s) -->