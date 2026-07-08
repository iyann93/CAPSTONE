import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching puppeteer...");
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  } catch (e) {
    console.log("Failed default launch, trying specific path...");
    browser = await puppeteer.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  }

  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log("Navigating to http://localhost:5173/bendahara ...");
  try {
    await page.goto('http://localhost:5173/bendahara', { waitUntil: 'networkidle0', timeout: 10000 });
  } catch (e) {
    console.log("Navigation error or timeout:", e.message);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
  console.log("Done.");
})();
