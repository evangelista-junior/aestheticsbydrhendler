import { parseContactEmail } from "@/lib/utils/parseContactEmail";

const nodemailer = require("nodemailer");
const path = require("node:path");
const fs = require("node:fs/promises");

const port = Number(process.env.SMTP_PORT);

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465, // 465=SSL, 587=STARTTLS
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  authMethod: "LOGIN",
  logger: true,
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

export async function sendContactMessage({
  contactName,
  contactEmail,
  contactPhone,
  contactMessage,
}) {
  const emailHTML = path.join(
    process.cwd(),
    "lib/templates/contactMessage/index.html"
  );
  const emailHTMLStringFormat = await fs.readFile(emailHTML, "utf-8");
  const customEmail = parseContactEmail({
    string: emailHTMLStringFormat,
    contactName,
    contactEmail,
    contactPhone,
    contactMessage,
  });

  const email = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    subject: `[Website/Contact] - New contact message from ${contactName}`,
    html: customEmail,
  });
  return email.messageId;
}
