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
      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

      // Jika tidak ada email, fallback untuk keamanan
      if (!userEmail) throw new Error('Email pengguna tidak ditemukan');

      const mailOptions = {
        from: '"Sistem Akademik MBS" <noreply@siakad-mbs.id>', // sender address
        to: userEmail, // list of receivers
        subject: 'Reset Password Akun SIAKAD MBS', // Subject line
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1A3D63;">Permintaan Reset Password</h2>
            <p>Halo <strong>\${userName}</strong>,</p>
            <p>Kami menerima permintaan untuk mereset password akun SIAKAD Anda. Klik tombol di bawah ini untuk mengatur ulang password Anda:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="\${resetLink}" style="background-color: #1A3D63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password Sekarang
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">Tautan ini hanya berlaku selama 1 jam. Jika Anda tidak merasa meminta reset password, abaikan email ini.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 SIAKAD MBS Prambanan. All rights reserved.</p>
          </div>
        `,
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
