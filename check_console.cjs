const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching puppeteer...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`)
  );

  console.log("Navigating to http://localhost:5173/ ...");
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 10000 });
  } catch (e) {
    console.log("Navigation error or timeout:", e.message);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
  console.log("Done.");
})();
