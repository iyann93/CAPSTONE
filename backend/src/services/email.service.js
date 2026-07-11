'use strict';

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

let transporter;

const initializeTransporter = async () => {
  if (transporter) return transporter;

  // Jika pakai credentials asli dari .env
  if (process.env.SMTP_USER && process.env.SMTP_USER !== 'test@ethereal.email') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
    });
    return transporter;
  }

  // Jika belum diset di .env, generate akun Ethereal otomatis
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  
  console.log("Ethereal Test Account generated:", testAccount.user);
  return transporter;
};

const EmailService = {
  sendResetPasswordEmail: async (userEmail, userName, resetToken) => {
    try {
      // Gunakan IP WiFi laptop agar link bisa diklik/dibuka dari HP
      const resetLink = `http://192.168.1.56:5173/reset-password?token=${resetToken}`;

      // Jika tidak ada email, fallback untuk keamanan
      if (!userEmail) throw new Error('Email pengguna tidak ditemukan');

      const mailOptions = {
        from: `"Sistem Akademik MBS" <${process.env.SMTP_USER || 'noreply@siakad-mbs.id'}>`, // sender address
        to: userEmail, // list of receivers
        subject: '[SIAKAD MBS] Informasi Akun', // Subject line
        text: `Halo ${userName},\n\nUntuk mengakses sistem Anda, silakan kunjungi tautan berikut: ${resetLink}\n\nTerima kasih,\nTim SIAKAD MBS`,
      };

      const mailTransporter = await initializeTransporter();
      const info = await mailTransporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      
      // Jika pakai Ethereal, kita bisa lihat preview emailnya
      if (process.env.SMTP_HOST === 'smtp.ethereal.email' || !process.env.SMTP_HOST) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
};

module.exports = EmailService;
