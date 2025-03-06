import jwt from "jsonwebtoken";

const generateToken = (payload, res) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return token;
};

export default generateToken;
