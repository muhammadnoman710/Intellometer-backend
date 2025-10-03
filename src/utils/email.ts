import nodemailer from "nodemailer";

export const sendResetEmail = async (to: string, token: string) => {
  // ✅ Use Gmail SMTP instead of Ethereal
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS, // your App Password (not your normal password!)
    },
  });

  const resetLink = `http://localhost:5000/auth/reset-password/${token}`;

  const info = await transporter.sendMail({
    from: `"IntelloMeter" <${process.env.EMAIL_USER}>`, // Sender
    to, // Receiver email (can be Gmail, Yopmail, anything)
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  console.log("✅ Email sent:", info.response);
};
