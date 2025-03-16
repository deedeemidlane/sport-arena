import { transporter } from "../configs/emailConfig.js";
import { verificationEmailTemplate } from "../mails/verificationEmailTemplate.js";

export const sendVerificationEamil = async (email, name, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"SportArena" <no-reply@gmail.com>',
      to: email, // list of receivers
      subject: "Xác thực email", // Subject line
      text: "Xác thực email", // plain text body
      html: verificationEmailTemplate
        .replace("{verificationCode}", verificationCode)
        .replace("{name}", name),
    });
    console.log("Email send Successfully", response);
  } catch (error) {
    console.log("Email error", error);
  }
};
