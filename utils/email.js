const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Your SMTP host (e.g., smtp.gmail.com, smtp.office365.com)
  port: process.env.SMTP_PORT, // Your SMTP port (e.g., 465 for SSL, 587 for TLS)
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your SMTP username (email address)
    pass: process.env.SMTP_PASSWORD, // Your SMTP password or app-specific password
  },
  // tls: {
  //   rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === "true", // Set to false if using self-signed certificates
  // },
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content of the email
 * @param {string} html - HTML content of the email (optional)
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to, // Recipient email address
      subject, // Email subject
      text, // Plain text body
      html, // HTML body (optional)
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};

// const sendVerificationEmail = async (email, verification_token) => {
//   try {
//     // Create the verification link
//     const verificationLink = `${process.env.APP_PROTOCOL}://${process.env.APP_DOMAIN}/api/auth/verify/${verification_token}`;

//     // Email subject
//     const subject = "Verify Your Account";

//     // Plain text email body
//     const text = `Hello ${username},\n\nPlease verify your account by clicking the link below:\n\n${verificationLink}\n\nIf you did not request this, please ignore this email.`;

//     // HTML email body
//     const html = `
//       <p>Hello ${username},</p>
//       <p>Please verify your account by clicking the link below:</p>
//       <p><a href="${verificationLink}">Verify Account</a></p>
//       <p>If you did not request this, please ignore this email.</p>
//     `;

//     // Send the email
//     const emailSent = await sendEmail(email, subject, text, html);

//     if (!emailSent) {
//       throw new Error("Failed to send verification email");
//     }

//     // console.log(`Verification email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error("Error sending verification email: ", error);
//     return false;
//   }
// };

// const resendVerificationEmail = async (email, verification_token) => {
//   try {
//     // Create the verification link
//     const verificationLink = `${process.env.APP_PROTOCOL}://${process.env.APP_DOMAIN}/api/auth/verify/${verification_token}`;

//     // Email subject
//     const subject = "Verify Your Account";

//     // Plain text email body
//     const text = `Hello ${username},\n\nYou requested for verification link.\n\nPlease verify your account by clicking the link below:\n\n${verificationLink}\n\nIf you did not request this, please ignore this email.`;

//     // HTML email body
//     const html = `
//       <p>Hello ${username},</p>
//       <p>You requested for verification link.</p>
//       <p>Please verify your account by clicking the link below:</p>
//       <p><a href="${verificationLink}">Verify Account</a></p>
//       <p>If you did not request this, please ignore this email.</p>
//     `;

//     // Send the email
//     const emailSent = await sendEmail(email, subject, text, html);

//     if (!emailSent) {
//       throw new Error("Failed to send verification email");
//     }

//     // console.log(`Verification email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error("Error sending verification email: ", error);
//     return false;
//   }
// };

module.exports = {
  sendEmail,
  // sendVerificationEmail,
  // resendVerificationEmail,
};
