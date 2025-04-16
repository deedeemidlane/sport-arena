import { transporter } from "../configs/emailConfig.js";
import { verificationEmailTemplate } from "../mails/verificationEmailTemplate.js";

export const sendVerificationEamil = async (email, name, verificationCode) => {
  try {
    const mailData = {
      from: '"SportArena" <no-reply@gmail.com>',
      to: email,
      subject: "Xác thực email",
      text: "Xác thực email",
      html: verificationEmailTemplate
        .replace("{verificationCode}", verificationCode)
        .replace("{name}", name),
    };
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
    console.log("Email send Successfully");
  } catch (error) {
    console.log("Email error", error);
  }
};
