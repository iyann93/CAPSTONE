const EmailService = require('./src/services/email.service');

async function test() {
  try {
    const res = await EmailService.sendResetPasswordEmail('pedoko49@gmail.com', 'Test User', 'dummy-token');
    console.log('Success:', res);
  } catch(e) {
    console.error('Failed:', e);
  }
}
test();
