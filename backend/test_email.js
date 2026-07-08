const fs = require('fs');

async function getLog() {
    // We don't have a direct log file, but let's check Nodemailer directly.
    const EmailService = require('./src/services/email.service');
    try {
        await EmailService.sendResetPasswordEmail('test@siakad.id', 'Budi', 'dummy-token-123');
        console.log("Email service works!");
    } catch (e) {
        console.error("Email service error:", e);
    }
}
getLog();
