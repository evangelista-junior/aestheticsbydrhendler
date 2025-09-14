const nodemailer = require("nodemailer");

const port = Number(process.env.SMTP_PORT);

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465, // 465=SSL, 587=STARTTLS
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  authMethod: "LOGIN",
  logger: true,
  // debug: true,
});

export async function testConnection() {
  const pass = process.env.SMTP_PASS ?? "";

  const verify = await transporter.verify();
  console.log(verify);
  return verify;
}

export async function sendMail({
  emailTo,
  emailSubject,
  emailText,
  emailHtml,
}) {
  const email = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: emailTo,
    subject: emailSubject,
    text: emailText,
    html: emailHtml,
  });
  return email.messageId;
}
