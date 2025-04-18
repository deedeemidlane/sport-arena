import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { sendVerificationEamil } from "../helpers/sendVerificationEmail.js";

export const createOwnerAccount = async (req, res) => {
  try {
    const { phone, email, password, name, gender } = req.body;

    console.log(req.body);
    // return;

    const userWithDuplicatePhone = await prisma.user.findUnique({
      where: { phone },
    });
    const userWithDuplicateEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithDuplicatePhone) {
      return res
        .status(400)
        .json({ error: "Số điện thoại đã được sử dụng cho tài khoản khác" });
    }

    if (userWithDuplicateEmail) {
      return res
        .status(400)
        .json({ error: "Email đã được sử dụng cho tài khoản khác" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    let randomVerificationCode = Math.random().toString().slice(2, 8);

    while (
      await prisma.user.findFirst({
        where: { verificationCode: randomVerificationCode },
      })
    ) {
      randomVerificationCode = Math.random().toString().slice(2, 8);
    }

    const newUser = await prisma.user.create({
      data: {
        phone,
        email,
        password: hashedPassword,
        name,
        role: "OWNER",
        gender,
        verificationCode: randomVerificationCode,
      },
    });

    if (newUser) {
      sendVerificationEamil(email, name, newUser.verificationCode);
      res.status(201).json({
        message:
          "Đăng ký tài khoản chủ sân thành công! Vui lòng xác thực email của bạn.",
      });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in createOwnerAccount controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const createCustomerAccount = async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    console.log("req.files: ", req.files);

    const data = JSON.parse(req.body.data);
    delete data.confirmPassword;
    const frontIdCardImageFile = req.files["frontIdCardImage"][0];
    const backIdCardImageFile = req.files["backIdCardImage"][0];

    console.log("data: ", data);
    console.log("frontIdCardImage: ", frontIdCardImageFile);
    console.log("backIdCardImage: ", backIdCardImageFile);

    const frontIdCardImageUrl = frontIdCardImageFile.path.slice(
      frontIdCardImageFile.path.lastIndexOf(
        "/",
        frontIdCardImageFile.path.indexOf("/" + frontIdCardImageFile.filename) -
          1,
      ) + 1,
    );
    const backIdCardImageUrl = backIdCardImageFile.path.slice(
      backIdCardImageFile.path.lastIndexOf(
        "/",
        backIdCardImageFile.path.indexOf("/" + backIdCardImageFile.filename) -
          1,
      ) + 1,
    );

    // return;

    const userWithDuplicatePhone = await prisma.user.findUnique({
      where: { phone: data.phone },
    });
    const userWithDuplicateEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userWithDuplicatePhone) {
      return res
        .status(400)
        .json({ error: "Số điện thoại đã được sử dụng cho tài khoản khác" });
    }

    if (userWithDuplicateEmail) {
      return res
        .status(400)
        .json({ error: "Email đã được sử dụng cho tài khoản khác" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(data.password, salt);

    let randomVerificationCode = Math.random().toString().slice(2, 8);

    while (
      await prisma.user.findFirst({
        where: { verificationCode: randomVerificationCode },
      })
    ) {
      randomVerificationCode = Math.random().toString().slice(2, 8);
    }

    const newUser = await prisma.user.create({
      data: {
        ...data,
        frontIdCardImageUrl,
        backIdCardImageUrl,
        password: hashedPassword,
        role: "CUSTOMER",
        verificationCode: randomVerificationCode,
      },
    });

    if (newUser) {
      sendVerificationEamil(data.email, data.name, newUser.verificationCode);
      res.status(201).json({
        message:
          "Đăng ký tài khoản người chơi thành công! Vui lòng xác thực email của bạn.",
      });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in createCustomerAccount controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await prisma.user.findFirst({
      where: { verificationCode: code },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Mã xác thực không đúng. Vui lòng thử lại!",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
        verificationCode: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Xác thực email thành công! Vui lòng đăng nhập lại.",
    });
  } catch (error) {
    console.log("Error in verifyEmail controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await prisma.user.findUnique({ where: { phone: username } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email: username } });
    }

    if (!user) {
      return res.status(400).json({ error: "Tài khoản không tồn tại" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Mật khẩu không đúng" });
    }

    if (!user.verified) {
      sendVerificationEamil(user.email, user.name, user.verificationCode);
      // return res.status(401).json({ error: "Vui lòng xác thực tài khoản" });
    }

    const payload = {
      ...user,
    };

    const token = generateToken(payload, res);

    res.status(200).json({ token: token, payload: payload });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const getUser = async (req, res) => {
  try {
    res.status(200).json(req.payload);
  } catch (error) {
    console.log("Error in getUser controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};
