import nodemailer from "nodemailer";

export const sendResetEmail = async (to: string, token: string) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS, // your App Password (not your normal password!)
    },
  });

  const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: `"IntelloMeter" <${process.env.EMAIL_USER}>`, // Sender
    to, // Receiver email (can be Gmail, Yopmail, anything)
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  console.log("✅ Email sent:", info.response);
};
