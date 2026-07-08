const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Tangkap semua log konsol
  page.on('console', msg => {
    console.log(`[Browser Console ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  // Tangkap error yang tidak tertangani
  page.on('pageerror', error => {
    console.log(`[Browser PageError] ${error.message}`);
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log("Page loaded successfully.");
    
    // Check if the body is empty (blank screen)
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    if (bodyHTML.trim() === '' || bodyHTML.includes('<div id="root"></div>') && bodyHTML.length < 100) {
      console.log("WARNING: Page body appears to be blank/empty.");
    }
  } catch (err) {
    console.error("Navigation error:", err);
  } finally {
    await browser.close();
  }
})();
