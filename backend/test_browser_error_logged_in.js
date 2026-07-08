const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Tangkap semua log konsol
  page.on('console', msg => {
    console.log(`[Browser Console ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`[Browser PageError] ${error.message}`);
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Inject localStorage
    await page.evaluate(() => {
      localStorage.setItem('siakad_user', JSON.stringify({
        id: "d8fb8dc3-c0d2-43bb-8f0a-74fc21945c7d",
        role: "Admin TU",
        name: "Dr. Wahyu"
      }));
    });
    
    // Reload to apply localStorage
    await page.reload({ waitUntil: 'networkidle0' });
    
    console.log("Page reloaded with user logged in.");
    
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
