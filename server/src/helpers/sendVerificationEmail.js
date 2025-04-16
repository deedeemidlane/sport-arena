import { transporter } from "../configs/emailConfig.js";
import { verificationEmailTemplate } from "../mails/verificationEmailTemplate.js";

export const sendVerificationEamil = async (email, name, verificationCode) => {
  try {
    const mailData = {
      from: '"SportArena" <no-reply@gmail.com>',
      to: email, // list of receivers
      subject: "Xác thực email", // Subject line
      text: "Xác thực email", // plain text body
      html: verificationEmailTemplate
        .replace("{verificationCode}", verificationCode)
        .replace("{name}", name),
    };
    const response = await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
    console.log("Email send Successfully", response);
  } catch (error) {
    console.log("Email error", error);
  }
};
