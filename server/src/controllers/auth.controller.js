import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const createOwnerAccount = async (req, res) => {
  try {
    const { phone, password, name, gender } = req.body;

    console.log(req.body);
    // return;

    const user = await prisma.user.findUnique({ where: { phone } });

    if (user) {
      return res
        .status(400)
        .json({ error: "Số điện thoại đã được sử dụng cho tài khoản khác" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        name,
        role: "OWNER",
        gender,
        verified: true,
      },
    });

    if (newUser) {
      res.status(201).json({
        id: newUser.id,
        phone: newUser.phone,
        name: newUser.name,
        role: newUser.role,
        gender: newUser.gender,
      });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in createAccount controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return res.status(400).json({ error: "Tài khoản không tồn tại" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Mật khẩu không đúng" });
    }

    const payload = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      shopId: user.shopId,
    };

    const token = generateToken(payload, res);

    res.status(200).json({ token: token, payload: payload });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
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
