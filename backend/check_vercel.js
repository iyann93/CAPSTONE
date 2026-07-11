const axios = require('axios');
async function run() {
  const res = await axios.get('https://cp-sia.vercel.app');
  const jsMatch = res.data.match(/src="(\/assets\/index-.*?\.js)"/);
  if (jsMatch) {
    const jsUrl = 'https://cp-sia.vercel.app' + jsMatch[1];
    const jsRes = await axios.get(jsUrl);
    const startIdx = jsRes.data.indexOf('baseURL');
    if(startIdx !== -1) {
      console.log(jsRes.data.substring(startIdx, startIdx + 100));
    } else {
      console.log('baseURL not found');
    }
  }
}
run();
