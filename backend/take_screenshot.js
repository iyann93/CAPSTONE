const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Inject localStorage
    await page.evaluate(() => {
      localStorage.setItem('siakad_user', JSON.stringify({
        id: "d8fb8dc3-c0d2-43bb-8f0a-74fc21945c7d",
        role: "Admin TU",
        name: "Dr. Wahyu",
        accessToken: "placeholder_to_prevent_logout_if_possible"
      }));
    });
    
    // Reload to apply localStorage
    await page.reload({ waitUntil: 'networkidle0' });
    
    // If it kicks us out due to invalid token, let's also try to bypass or just take a screenshot anyway.
    // Wait for 1 second just to be sure animations finish
    await new Promise(r => setTimeout(r, 1000));
    
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    console.log("Screenshot saved to screenshot.png");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
})();
