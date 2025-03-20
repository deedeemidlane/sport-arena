import prisma from "../db/prisma.js";

export const getUsers = async (req, res) => {
  try {
    if (req.payload.role !== "ADMIN") {
      return res.status(401).json({ error: "Unauthorized - Not admin token" });
    }

    const noneAdminUsers = await prisma.user.findMany({
      where: {
        OR: [{ role: "OWNER" }, { role: "CUSTOMER" }],
      },
    });

    console.log(noneAdminUsers);
    // return;

    if (noneAdminUsers) {
      res.status(200).json(noneAdminUsers);
    } else {
      res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    }
  } catch (error) {
    console.log("Error in getUsers controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.payload.role !== "ADMIN") {
      return res.status(401).json({ error: "Unauthorized - Not admin token" });
    }

    console.log("req params: ", req.params);

    console.log("req body: ", req.body);

    const userId = req.params.userId;

    const deleteUser = await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    if (deleteUser) {
      res.status(200).json({ message: "Xoá tài khoản thành công!" });
    } else {
      res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log("Error in deleteUser controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};
