import prisma from "../db/prisma.js";

export const getAccounts = async (req, res) => {
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
    return;

    // if (noneAdminUsers) {
    //   res.status(200).json(noneAdminUsers);
    // } else {
    //   res.status(404).json({ error: "Không tìm thấy tài nguyên" });
    // }
  } catch (error) {
    console.log("Error in getShops controller: ", error.message);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};
