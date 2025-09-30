import nodemailer from "nodemailer";

export const sendResetEmail = async (to: string, token: string) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const resetLink = `http://localhost:5000/auth/reset-password/${token}`;

  const info = await transporter.sendMail({
    from: '"IntelloMeter" <no-reply@intellometer.com>',
    to,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
};
