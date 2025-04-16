import { verificationEmailTemplate } from "../mails/verificationEmailTemplate.js";
import sgMail from "@sendgrid/mail";

export const sendVerificationEamil = async (email, name, verificationCode) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "sportarena12341234@gmail.com",
    subject: "Xác thực email",
    text: "Xác thực email",
    html: verificationEmailTemplate
      .replace("{verificationCode}", verificationCode)
      .replace("{name}", name),
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
