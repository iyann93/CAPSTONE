'use strict';

const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter;

if (env.email.host && env.email.user && env.email.pass) {
  transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.port === 465,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });
} else {
  // Mock transporter for development if no email config is provided
  console.warn('⚠️ No email configuration found. Using ethereal email for testing.');
  nodemailer.createTestAccount().then((account) => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  });
}

const sendResetPasswordEmail = async (email, nama, token) => {
  if (!transporter) {
    console.error('Email transporter is not initialized.');
    return;
  }

  const resetLink = `${env.frontendUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"SIAKAD Admin" <${env.email.user || 'admin@siakad.local'}>`,
    to: email,
    subject: 'Reset Password',
    text: `Halo ${nama},\n\nKlik link berikut untuk mengatur ulang password Anda:\n\n${resetLink}\n\nLink berlaku selama 1 jam.\n\nJika Anda tidak meminta reset password, abaikan email ini.`,
    html: `<p>Halo ${nama},</p>
           <p>Klik link berikut untuk mengatur ulang password Anda:</p>
           <p><a href="${resetLink}">${resetLink}</a></p>
           <p>Link berlaku selama 1 jam.</p>
           <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email reset password terkirim ke ${email}. Message ID: ${info.messageId}`);
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error(`Gagal mengirim email ke ${email}:`, error);
    throw new Error('Gagal mengirim email reset password');
  }
};

module.exports = {
  sendResetPasswordEmail,
};
